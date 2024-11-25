export interface ITopLevelComment {
  kind: string,
  etag: string,
  id: string,
  snippet: {
    channelId: string,
    videoId: string,
    textDisplay: string,
    textOriginal: string,
    authorDisplayName: string,
    authorProfileImageUrl: string,
    authorChannelId: {
      value: string
    },
    canRate: boolean,
    publishedAt: string,
    updatedAt: string
  }
}

export interface ICommentReplied {
  id: string,
  snippet: {
    channelId: string,
    videoId: string,
    textDisplay: string,
    textOriginal: string,
    parentId: string,
    authorDisplayName: string,
    authorProfileImageUrl: string,
    authorChannelUrl: string,
    authorChannelId: {
      value: string
    },
    canRate: boolean,
    viewerRating: string | number,
    likeCount: number,
    publishedAt: string,
    updatedAt: string
  }
}

export interface IComment {
  commentId: string,
  channelId: string,
  videoId: string,
  topLevelComment: ITopLevelComment,
  replies: ICommentReplied[],
  canReply: boolean,
  totalReplyCount: 0,
  isPublic: boolean
}