import { NextResponse } from 'next/server';
import { google } from 'googleapis';

const youtube = google.youtube('v3');

export async function POST(req) {
  const body = await req.json();
  const { type, data, accessToken } = body

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    switch (type) {
      case 'getActivities':
        return await getActivitiesReport(accessToken);

      case 'getVideoDetail':
        return await getVideoDetail(data.videoId, accessToken);

      case 'listComments':
        return await listComments(data.videoId, accessToken);

      case 'removeComment':
        return await removeComment(data.commentId, accessToken);

      case 'replyToComment':
        return await replyToComment(data.commentId, data.text, accessToken);

      case 'insertComment':
        return await insertComment(data.videoId, data.text, accessToken);

      default:
        return NextResponse.json({ error: 'Invalid request type' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.code });
  }
}

async function getActivitiesReport(accessToken) {
  const activityResponse = await youtube.activities.list({
    part: ['snippet', 'contentDetails'],
    access_token: accessToken,
    mine: true,
  });

  const activities = activityResponse.data.items || [];

  for (const activity of activities) {
    const videoId = activity.contentDetails?.upload?.videoId;
    if (videoId) {
      const videoResponse = await getVideoDetail(videoId, accessToken)
      const video = await videoResponse.json()
      const views = video?.statistics?.viewCount || 0;
      const comments = video?.statistics?.commentCount || 0;

      activity.snippet = {
        ...activity.snippet,
        views,
        comments,
      }
    }
  }

  return NextResponse.json(activities);
}

async function getVideoDetail(videoId, accessToken) {
  const response = await youtube.videos.list({
    part: ['statistics', 'snippet'],
    id: videoId,
    access_token: accessToken,
  })
  const videoDetail = response?.['data']?.['items'][0] ?? {}
  return NextResponse.json(videoDetail)
}

async function listComments(videoId, accessToken) {
  let allComments = [];
  let nextPageToken = null;

  do {
    const response = await youtube.commentThreads.list({
      part: ['snippet', 'replies'],
      videoId,
      access_token: accessToken,
      maxResults: 100,
      pageToken: nextPageToken,
    });

    const comments = response?.data?.items ?? [];

    for (const comment of comments) {
      const commentId = comment.id;
      const commentData = {
        ...comment.snippet,
        replies: [],
        commentId
      };

      if (comment.replies) {
        const repliesResponse = await youtube.comments.list({
          part: ['snippet'],
          parentId: commentId,
          access_token: accessToken,
        });

        commentData.replies = repliesResponse?.data?.items ?? [];
      }

      allComments.push(commentData);
    }

    nextPageToken = response?.data?.nextPageToken;
  } while (nextPageToken);

  return NextResponse.json(allComments);
}


async function removeComment(commentId, accessToken, isUserChannelId) {
  if (isUserChannelId) {
    await youtube.comments.delete({
      id: commentId,
      access_token: accessToken,
    });
  } else {
    await youtube.comments.setModerationStatus({
      id: commentId,
      moderationStatus: 'rejected',
      access_token: accessToken,
    });
  }

  return NextResponse.json({ message: 'Comment removed successfully' });

}

async function replyToComment(commentId, text, accessToken) {
  const response = await youtube.comments.insert({
    part: ['snippet'],
    requestBody: {
      snippet: {
        textOriginal: text,
        parentId: commentId,
      },
    },
    access_token: accessToken,
  });

  return NextResponse.json(response.data);

}

async function insertComment(videoId, text, accessToken) {
  const response = await youtube.commentThreads.insert({
    part: ['snippet'],
    requestBody: {
      snippet: {
        videoId,
        topLevelComment: {
          snippet: {
            textOriginal: text,
          },
        },
      },
    },
    access_token: accessToken,
  });

  return NextResponse.json(response.data);
}
