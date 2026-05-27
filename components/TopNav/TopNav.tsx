'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import styles from './TopNav.module.scss'

export default function TopNav({ onToggleNav }: { onToggleNav: () => void }) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleLogout() {
    logout()
    router.push('/login')
  }

  return (
    <header className={styles.topnav}>
      <div className={styles.logoWrap}>
        <Image src="/logo.svg" alt="lendsqr" width={144} height={30} priority />
      </div>

      <button className={styles.hamburger} onClick={onToggleNav} type="button" aria-label="Toggle navigation menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      <div className={styles.searchWrap}>
        <input
          type="search"
          className={styles.search}
          placeholder="Search for anything"
        />
        <button className={styles.searchBtn} type="button">
          <Image src="/search-icon.svg" alt="Search" width={14} height={14} />
        </button>
      </div>

      <div className={styles.actions}>
        <a href="#" className={styles.docs} onClick={e => e.preventDefault()}>Docs</a>

        <button className={styles.notif} type="button" aria-label="Notifications">
          <Image src="/notification-icon.svg" alt="Notifications" width={21} height={24} />
        </button>

        <div className={styles.userWrap} ref={ref}>
          {mounted && user?.avatar && (
            <img
              src={user.avatar}
              alt={user.name || ''}
              width={48}
              height={48}
              className={styles.avatar}
            />
          )}
          <span className={styles.userName} onClick={() => setOpen(v => !v)}>{mounted ? user?.name : ''}</span>
          <button
            className={styles.dropdownBtn}
            type="button"
            aria-label="Toggle user menu"
            onClick={() => setOpen(v => !v)}
          >
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path d="M0 0L5 5L10 0H0Z" fill="#213F7D"/>
            </svg>
          </button>

          {open && (
            <div className={styles.dropdown}>
              <button className={styles.dropdownItem} onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
