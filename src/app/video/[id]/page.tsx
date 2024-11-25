'use client'

import { TypeDataApis } from "@/enum/type-data-api.enum";
import { callApi } from "@/utils/call-api";
import VideoInfo from "@/components/video-info";
import VideoPlayer from "@/components/video-player";
import { IVideo } from "@/interface/video.interface";
import styles from './styles.module.scss'
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Loading from "@/components/loading";
import { CustomSession } from "@/interface/session.interface";

export default function VideoDetail() {
  const [video, setVideo] = useState<IVideo | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const { id: videoId } = useParams()
  const { data: session } = useSession() as { data: CustomSession };

  const accessToken = session?.accessToken ?? session?.user?.accessToken as string

  const getVideo = useCallback(async (accessToken: string) => {
    const video = await callApi<IVideo>({
      accessToken,
      type: TypeDataApis.GET_VIDEO_DETAIL,
      body: { videoId },
    });
    setVideo(video)
    setTimeout(() => setLoading(false), 1000)
  }, [videoId])

  useEffect(() => {
    if (accessToken) {
      setLoading(true)
      getVideo(accessToken)
    }
  }, [accessToken, getVideo])

  if (!video || !Object.values(video).length) {
    return null
  }

  return (
    <div className={styles.container}>
      {loading ? <Loading visible /> : (
        <>
          <VideoPlayer videoId={videoId as string} width={1366} height={680} />
          <VideoInfo video={video} /></>
      )}
    </div>
  )
}
