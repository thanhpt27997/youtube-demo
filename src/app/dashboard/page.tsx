'use client';

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import VideoCard from "@/components/video-card";
import { callApi } from "@/utils/call-api";
import { TypeDataApis } from "@/enum/type-data-api.enum";
import { IVideo } from "@/interface/video.interface";
import styles from './styles.module.scss'
import Loading from "@/components/loading";
import { CustomSession } from "@/interface/session.interface";

const Dashboard = () => {
  const [data, setData] = useState<IVideo[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const { data: session, status } = useSession() as { data: CustomSession, status: string };

  const getListVideos = useCallback(async () => {
    const accessToken = session?.accessToken ?? session?.user?.accessToken as string
    if (accessToken) {
      const res = await callApi<IVideo[]>({ accessToken, type: TypeDataApis.GET_ACTIVITIES })
      setData(res)
      setLoading(false)
    }
  }, [session])

  useEffect(() => {
    if (session) {
      setLoading(true)
      getListVideos()
    }
  }, [session, getListVideos])


  useEffect(() => {
    if (status === 'unauthenticated') {
      window.location.href = '/'
    }
  }, [status])


  return (
    <div className={styles.container}>
      <h2>Danh sách videos</h2>
      <Loading visible={loading} />
      {
        data.length > 0 && (
          <div className={styles.list}>
            {data.map((video: IVideo) => <VideoCard video={video} key={video.id} />)}
          </div>
        )
      }
    </div >
  );
};

export default Dashboard;
