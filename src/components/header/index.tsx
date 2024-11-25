'use client';

import { signOut, useSession } from 'next-auth/react';
import styles from './styles.module.scss'
import Image from 'next/image';
import { CustomSession } from '@/interface/session.interface';

export default function Header() {

  const { data: session } = useSession() as { data: CustomSession };

  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/",
    });
  };

  if (!session) {
    return null
  }

  const srcSet = session.user?.image ?? session.user?.picture ?? ''

  return (
    <div className={styles.header}>
      <h1>
        <Image src={srcSet} width={64} height={64} alt={session.user?.name ?? ''} />
        <a href="/dashboard">
          Kênh của bạn
        </a>
      </h1>
      <button onClick={handleLogout}>Đăng xuất</button>
    </div>
  )
}