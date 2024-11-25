import { IStatistics, IVideo } from "@/interface/video.interface";
import styles from './styles.module.scss'
import Comments from "../comments";

export default function VideoInfo({ video }: { video: IVideo }) {
  const { snippet: { title, description }, statistics } = video
  const { viewCount } = statistics as IStatistics

  return (
    <div className={styles.container}>
      <h2>{title} ({viewCount} lượt xem)</h2>
      {description && <p>{description}</p>}
      <div className={styles.comment}>
        <Comments videoId={video.id} channelId={video.snippet.channelId} />
      </div>
    </div>
  )
}