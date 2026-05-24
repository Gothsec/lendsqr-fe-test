import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'
import styles from './TopNav.module.scss'

export default function TopNav() {
  const { user, logout } = useAuth()

  return (
    <header className={styles.topnav}>
      <div className={styles.logoWrap}>
        <Image src="/logo.svg" alt="lendsqr" width={144} height={30} priority />
      </div>

      <div className={styles.searchWrap}>
        <input
          type="search"
          className={styles.search}
          placeholder="Search for anything"
        />
        <button className={styles.searchBtn} type="button">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5.5 0C8.538 0 11 2.462 11 5.5c0 1.327-.47 2.546-1.254 3.49l4.132 4.132-.707.707-4.132-4.132A5.47 5.47 0 015.5 11C2.462 11 0 8.538 0 5.5S2.462 0 5.5 0zm0 1A4.5 4.5 0 1010 5.5 4.505 4.505 0 005.5 1z" fill="#fff"/>
          </svg>
        </button>
      </div>

      <div className={styles.actions}>
        <a href="#" className={styles.docs} onClick={e => e.preventDefault()}>Docs</a>

        <button className={styles.notif} type="button" aria-label="Notifications">
          <svg width="22" height="24" viewBox="0 0 22 24" fill="none">
            <path d="M12.8 2.04v.56a4.501 4.501 0 013.356 4.227L17 9.5c0 .789.172 1.534.478 2.197l1.267 2.748c.287.622.066 1.343-.519 1.693A8.853 8.853 0 0111 18a8.853 8.853 0 01-7.226-3.862c-.585-.35-.806-1.07-.519-1.693l1.267-2.748A5.983 5.983 0 005 9.5l.844-2.673a4.502 4.502 0 013.356-4.227V2.04a1.8 1.8 0 113.6 0zM11 20c2.21 0 4-1.79 4-4H7c0 2.21 1.79 4 4 4z" fill="#213F7D"/>
          </svg>
        </button>

        <div className={styles.userWrap}>
          <Image
            src={user?.avatar || ''}
            alt={user?.name || ''}
            width={48}
            height={48}
            className={styles.avatar}
          />
          <span className={styles.userName}>{user?.name}</span>
          <button className={styles.dropdownBtn} type="button">
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path d="M1.41 0L6 4.58 10.59 0 12 1.41l-6 6-6-6L1.41 0z" fill="#213F7D"/>
            </svg>
          </button>
        </div>

        <button className={styles.logoutBtn} onClick={() => { logout() }} type="button" aria-label="Logout">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7 1H3a2 2 0 00-2 2v14a2 2 0 002 2h4M17 10H7m6-4l4 4-4 4" stroke="#213F7D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </header>
  )
}
