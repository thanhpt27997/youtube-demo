'use client';

import { signOut, useSession } from 'next-auth/react';
import styles from './styles.module.scss'
import Image from 'next/image';

export default function Header() {

  const { data: session } = useSession()

  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/",
    });
  };

  if (!session) {
    return null
  }

  return (
    <div className={styles.header}>
      <h1>
        <Image src={session.user?.image ?? ''} width={64} height={64} alt={session.user?.name ?? ''} />
        <a href="/dashboard">
          Kênh của bạn
        </a>
      </h1>
      <button onClick={handleLogout}>Đăng xuất</button>
    </div>
  )
}