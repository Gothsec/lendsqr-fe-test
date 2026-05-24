'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import styles from './layout.module.scss'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAuthenticated, logout, user } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  function handleLogout() {
    logout()
    router.replace('/login')
  }

  return (
    <div className={styles.wrap}>
      <header className={styles.topbar}>
        <span className={styles.user}>{user?.name}</span>
        <button className={styles.logout} onClick={handleLogout}>Logout</button>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  )
}
