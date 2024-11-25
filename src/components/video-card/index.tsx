'use-client'

import { IVideo } from "@/interface/video.interface"
import styles from './styles.module.scss'
import Image from "next/image"
export default function VideoCard({ video }: { video: IVideo }) {
  const { snippet: {
    thumbnails: {
      medium: { url, width, height }
    },
    title,
    description,
    views,
    comments,
  }, contentDetails: { upload: { videoId } } } = video
  return (
    <div className={styles.container}>
      <div className={styles.leftContainer}>
        <div className={styles.thumbnail}>
          <a href={`/video/${videoId}`}>
            <Image
              src={url}
              alt={title}
              width={width}
              height={height}
            />
          </a>
        </div>
        <div className={styles.content}>
          <div className={styles.info}>
            <h3>
              <a href={`/video/${videoId}`}>
                {title}
              </a>
            </h3>
            <p>{description}</p>
          </div>
          <div className={styles.statictics}>
            <p>Số lượt xem: {views}</p>
            <p>Số lượt bình luận: {comments}</p>
          </div>
        </div>
      </div>
      <a
        href={`/video/${videoId}`}
        className={styles.viewDetail}
      >
        Xem chi tiết
      </a>
    </div>
  )
}