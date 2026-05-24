'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import TopNav from '@/components/TopNav/TopNav'
import styles from './layout.module.scss'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  return (
    <div className={styles.wrap}>
      <TopNav />
      <div className={styles.body}>
        <aside className={styles.sidebar}>
          <nav className={styles.nav}>
            <div className={styles.navGroup}>
              <span className={styles.navGroupTitle}>CUSTOMERS</span>
              <a href="/users" className={`${styles.navItem} ${styles.active}`}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 0a4 4 0 100 8A4 4 0 008 0zM0 16c0-4 3.5-6 8-6s8 2 8 6" fill="#213F7D"/></svg>
                Users
              </a>
              <a href="#" className={styles.navItem} onClick={e => e.preventDefault()}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 0a4 4 0 100 8A4 4 0 008 0zM0 16c0-4 3.5-6 8-6s8 2 8 6" fill="#545F7D"/></svg>
                Guarantors
              </a>
              <a href="#" className={styles.navItem} onClick={e => e.preventDefault()}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="14" height="14" rx="2" stroke="#545F7D" strokeWidth="2"/></svg>
                Loans
              </a>
              <a href="#" className={styles.navItem} onClick={e => e.preventDefault()}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="#545F7D" strokeWidth="2"/></svg>
                Decision Models
              </a>
              <a href="#" className={styles.navItem} onClick={e => e.preventDefault()}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h12M2 12h12" stroke="#545F7D" strokeWidth="2"/></svg>
                Savings
              </a>
              <a href="#" className={styles.navItem} onClick={e => e.preventDefault()}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="#545F7D" strokeWidth="2"/></svg>
                Loan Requests
              </a>
              <a href="#" className={styles.navItem} onClick={e => e.preventDefault()}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 8l6-6 6 6" stroke="#545F7D" strokeWidth="2"/></svg>
                Whitelist
              </a>
              <a href="#" className={styles.navItem} onClick={e => e.preventDefault()}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1v14M1 8h14" stroke="#545F7D" strokeWidth="2"/></svg>
                Karma
              </a>
            </div>
          </nav>
        </aside>
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  )
}
