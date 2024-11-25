'use client'

import styles from './styles.module.scss'

export default function Loading({ visible = false, size = 60 }: { visible?: boolean, size?: number }) {
  if (!visible) {
    return null
  }
  return (
    <div className={styles.container}>
      <div className={styles.loading} style={{
        width: size,
        height: size
      }} />
    </div>
  )
}