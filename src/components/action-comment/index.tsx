'use client'
import { LegacyRef, useCallback, useEffect, useRef, useState } from "react"
import styles from './styles.module.scss'
import Image from "next/image"



interface PropsReplyComment {
  onCancel?: () => void
  onOk: (text: string) => void,
  visible?: boolean,
  isReply?: boolean,
  authorProfileImageUrl?: string,
  authorDisplayName?: string,
}

export default function ActionComment(props: PropsReplyComment) {
  const { onOk, onCancel, visible,
    isReply, authorProfileImageUrl, authorDisplayName,
  } = props
  const [content, setContent] = useState<string>('')
  const contentRef: LegacyRef<HTMLTextAreaElement> = useRef(null);

  const onChangeContent = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
    const textarea = contentRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [])


  const boxReplyCommentRef = useRef<HTMLDivElement>(null)

  const handleOk = useCallback(() => {
    if (onOk) {
      onOk(content)
      setContent('')
    }
  }, [content, onOk])

  useEffect(() => {
    if (isReply && boxReplyCommentRef.current) {
      boxReplyCommentRef.current.classList.add(styles.isReply)
      if (visible) {
        boxReplyCommentRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        })
        boxReplyCommentRef.current.classList.add(styles.visible)
      } else {
        boxReplyCommentRef?.current?.classList.remove(styles.visible)
      }
    }

  }, [visible, isReply])

  const renderBtnAction = useCallback(() => {
    if (isReply) {
      return (
        <>
          <button onClick={onCancel}>Hủy bỏ</button>
          <button onClick={handleOk}>Phản hồi</button>
        </>
      )
    }
    return (
      <button onClick={handleOk}>Viết bình luận</button>
    )
  }, [handleOk, isReply, onCancel])


  const renderInfoAccount = useCallback(() => {
    if (isReply) {
      return null
    }

    return (
      <div className={styles.avatar}>
        <Image width={40} height={40} src={authorProfileImageUrl ?? ''} alt={authorDisplayName ?? 'N/A'} />
      </div>
    )
  }, [authorDisplayName, authorProfileImageUrl, isReply])

  return (
    <div className={styles.boxReplyComment} ref={boxReplyCommentRef}>
      {renderInfoAccount()}
      <textarea
        value={content}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChangeContent(e)}
        rows={1}
        ref={contentRef}
      />
      <div className={styles.btnAction}>
        {renderBtnAction()}
      </div>

    </div>
  )
}