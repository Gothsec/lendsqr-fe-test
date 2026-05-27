'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import TopNav from '@/components/TopNav/TopNav'
import SideNav from '@/components/SideNav/SideNav'
import styles from './layout.module.scss'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [navOpen, setNavOpen] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login')
    }
  }, [isAuthenticated, router])

  return (
    <div className={styles.wrap}>
      <TopNav onToggleNav={() => setNavOpen(v => !v)} />
      <div className={styles.body}>
        <SideNav isOpen={navOpen} onClose={() => setNavOpen(false)} />
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  )
}
