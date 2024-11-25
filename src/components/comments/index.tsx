'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { callApi } from '@/utils/call-api'
import { useSession } from 'next-auth/react'
import { TypeDataApis } from '@/enum/type-data-api.enum'
import { IComment, ICommentReplied } from '@/interface/comment.interface'
import { parseDatePublished } from '@/utils/time'
import ActionComment from '../action-comment'

import styles from './styles.module.scss'

function Comment({
  comment,
  isCurrentCommentReadyReply,
  onReadyReplyComment,
  onDeleteComment,
  channelId
}: {
  comment: IComment;
  isCurrentCommentReadyReply?: boolean;
  onReadyReplyComment?: (comment: IComment) => void;
  onDeleteComment?: (commentId: string, isUserChannelId: boolean) => void
  channelId: string
}) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const repliesRef = useRef<HTMLDivElement>(null);

  const toggleReplies = () => {
    if (repliesRef.current) {
      if (isExpanded) {
        repliesRef.current.style.height = '0px';
      } else {
        repliesRef.current.style.height = `${repliesRef.current.scrollHeight}px`;
      }
      setIsExpanded(!isExpanded);
    }
  };

  useEffect(() => {
    if (isExpanded && repliesRef.current && comment.replies.length > 0) {
      const heightListRepliedComments = repliesRef.current.scrollHeight / (comment.replies.length + 1) * comment.replies.length
      repliesRef.current.style.height = `${heightListRepliedComments}px`;
    }

    /* eslint-disable */
  }, [comment.replies.length])

  const {
    topLevelComment: {
      snippet: { authorDisplayName, authorProfileImageUrl, textOriginal, publishedAt },
    },
  } = comment;

  const isUserChannelId = comment.channelId === channelId

  return (
    <React.Fragment>
      <div className={styles.avatar}>
        <Image width={40} height={40} src={authorProfileImageUrl} alt={authorDisplayName} />
      </div>
      <div className={styles.content}>
        <p>
          {authorDisplayName}&nbsp;•&nbsp;<span>{parseDatePublished(publishedAt)}</span>
        </p>
        <div className={styles.contextAndReply}>
          <span className={styles.text}>{textOriginal}</span>
          <button
            className={isCurrentCommentReadyReply ? styles.hidden : ''}
            onClick={() => onReadyReplyComment?.(comment)}
          >
            Phản hồi
          </button>
          <button
            className={isCurrentCommentReadyReply ? styles.hidden : ''}
            onClick={() => onDeleteComment?.(comment.commentId, isUserChannelId)}
          >
            Xóa bình luận
          </button>

          {comment.replies?.length > 0 && (
            <div
              ref={repliesRef}
              className={styles.replies}
              style={{ height: comment.replies.length > 1 ? 0 : repliesRef.current?.scrollHeight }}
            >
              {comment.replies.map((reply: ICommentReplied) => {
                const {
                  snippet: {
                    authorDisplayName,
                    authorProfileImageUrl,
                    textOriginal,
                    publishedAt,
                  },
                } = reply;
                const isUserChannelId = reply.snippet.channelId === channelId
                return (
                  <div className={styles.reply} key={new Date(publishedAt).getTime()}>
                    <div className={styles.avatar}>
                      <Image
                        width={40}
                        height={40}
                        src={authorProfileImageUrl}
                        alt={authorDisplayName}
                      />
                    </div>
                    <div className={styles.content}>
                      <p>
                        {authorDisplayName}&nbsp;•&nbsp;
                        <span>{parseDatePublished(publishedAt)}</span>
                      </p>
                      <span className={styles.text}>{textOriginal}</span>
                      <button
                        className={isCurrentCommentReadyReply ? styles.hidden : ''}
                        onClick={() => onReadyReplyComment?.(comment)}
                      >
                        Phản hồi
                      </button>
                      <button
                        className={isCurrentCommentReadyReply ? styles.hidden : ''}
                        onClick={() => onDeleteComment?.(reply.id, isUserChannelId)}
                      >
                        Xóa bình luận
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {comment.replies.length > 1 && (
            <button className={styles.toggleReplies} onClick={toggleReplies}>
              {isExpanded ? 'Ẩn phản hồi' : `Hiển thị ${comment.replies.length} phản hồi`}
            </button>
          )}

        </div>
      </div>
    </React.Fragment>
  );
}


export default function Comments({ videoId, channelId }: { videoId: string, channelId: string }) {
  const [comments, setComments] = useState<IComment[]>([])
  const [currentCommentReplied, setCurrentCommentReplied] = useState<IComment | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)
  const { data: session } = useSession()

  const accessToken = useMemo(() => session?.accessToken, [session])

  const getVideoComments = useCallback(async (accessToken: string) => {
    const videoComments = await callApi<IComment[]>({
      accessToken,
      type: TypeDataApis.GET_COMMENTS,
      body: { videoId },
    });
    setComments(videoComments ?? [])
  }, [videoId])

  const onReadyReplyComment = useCallback((comment: IComment) => setCurrentCommentReplied(comment), [])
  const onCancelReplyComment = useCallback(() => setCurrentCommentReplied(undefined), [])

  const onComment = useCallback(async (text: string) => {
    setLoading(true)
    if (!accessToken || !text) {
      return;
    }
    const commentResponse = await callApi<{ id: string, snippet: IComment }>({
      accessToken,
      type: TypeDataApis.INSERT_COMMENT,
      body: {
        videoId,
        text
      },
    })

    const combineComment = {
      ...commentResponse.snippet,
      replies: [],
      commentId: commentResponse.id
    }

    setComments([...comments, combineComment])
    setTimeout(() => setLoading(false), 500)
  }, [accessToken, videoId, comments])

  const onReplyComment = useCallback(async (text: string) => {
    if (!accessToken || !text) {
      return;
    }
    setLoading(true)
    const repliedComment = await callApi<ICommentReplied>({
      accessToken,
      type: TypeDataApis.REPLY_COMMENT,
      body: {
        commentId: currentCommentReplied?.commentId,
        text
      },
    })

    const mappingComment: IComment[] = comments.map((comment) => {
      if (comment.commentId === repliedComment?.snippet?.parentId) {
        return {
          ...comment,
          replies: [...comment.replies, repliedComment]
        }
      }
      return comment
    })
    setComments(mappingComment)
    onCancelReplyComment()
    setTimeout(() => setLoading(false), 500)
  }, [accessToken, currentCommentReplied, onCancelReplyComment, comments])

  const onDeleteComment = useCallback(async (commentId: string, isUserChannelId: boolean) => {
    if (!accessToken) {
      return;
    }
    setLoading(true)
    await callApi<ICommentReplied>({
      accessToken,
      type: TypeDataApis.REMOVE_COMMENT,
      body: {
        commentId, isUserChannelId
      },
    })

    setTimeout(() => getVideoComments(accessToken), 2000)

  }, [accessToken, getVideoComments])

  useEffect(() => {
    if (accessToken) {
      getVideoComments(accessToken)
    }
  }, [accessToken, getVideoComments])


  return (
    <div className={`${styles.container} ${loading ? styles.loadingEffect : ''} `}>
      <h3>{comments.length} bình luận</h3>
      <ActionComment onOk={onComment}
        authorDisplayName={session?.user?.name ?? ''}
        authorProfileImageUrl={session?.user?.image ?? ''}
      />
      {comments.length > 0 && comments.map((comment: IComment) => {
        const {
          topLevelComment: {
            snippet: {
              publishedAt
            }
          },
        } = comment

        const isCurrentCommentReadyReply = currentCommentReplied?.commentId === comment.commentId
        return (
          <div className={styles.comment} key={new Date(publishedAt).getTime()}>
            <Comment
              comment={comment}
              isCurrentCommentReadyReply={isCurrentCommentReadyReply}
              onReadyReplyComment={onReadyReplyComment}
              onDeleteComment={onDeleteComment}
              channelId={channelId}
            />
            <ActionComment
              onCancel={onCancelReplyComment}
              onOk={onReplyComment}
              visible={isCurrentCommentReadyReply}
              isReply
            />
          </div>
        )
      })}
    </div >
  )
}