'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import TopNav from '@/components/TopNav/TopNav'
import SideNav from '@/components/SideNav/SideNav'
import styles from './layout.module.scss'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login')
    }
  }, [isAuthenticated, router])

  return (
    <div className={styles.wrap}>
      <TopNav />
      <div className={styles.body}>
        <SideNav />
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  )
}
