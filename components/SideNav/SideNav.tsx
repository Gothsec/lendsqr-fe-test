'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import styles from './SideNav.module.scss'

interface NavItem {
  label: string
  icon: string
  href?: string
}

const customerItems: NavItem[] = [
  { label: 'Users', icon: 'user-friends-3.svg', href: '/users' },
  { label: 'Guarantors', icon: 'users-4.svg' },
  { label: 'Loans', icon: 'sack-5.svg' },
  { label: 'Decision Models', icon: 'handshake-regular-6.svg' },
  { label: 'Savings', icon: 'piggy-bank-7.svg' },
  { label: 'Loan Requests', icon: 'loan-req-8.svg' },
  { label: 'Whitelist', icon: 'user-check-9.svg' },
  { label: 'Karma', icon: 'user-times-10.svg' },
]

const businessItems: NavItem[] = [
  { label: 'Organization', icon: 'briefcase-1.svg' },
  { label: 'Loan Products', icon: 'np-bank-11.svg' },
  { label: 'Savings Products', icon: 'coins-solid-12.svg' },
  { label: 'Fees and Charges', icon: 'badge-percent-19.svg' },
  { label: 'Transactions', icon: 'transactions-13.svg' },
  { label: 'Services', icon: 'galaxy-14.svg' },
  { label: 'Service Account', icon: 'user-cog-15.svg' },
  { label: 'Settlements', icon: 'settlements-16.svg' },
  { label: 'Reports', icon: 'chart-bar-17.svg' },
]

const settingsItems: NavItem[] = [
  { label: 'Preferences', icon: 'sliders-18.svg' },
  { label: 'Fees and Pricing', icon: 'badge-percent-19.svg' },
  { label: 'Audit Logs', icon: 'clipboard-list-20.svg' },
]

function NavIcon({ src }: { src: string }) {
  return <Image src={`/sidebar-icons/${src}`} alt="" width={16} height={16} className={styles.icon} />
}

export default function SideNav({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuth()
  const [orgOpen, setOrgOpen] = useState(false)

  const handleLogout = useCallback(() => {
    logout()
    router.push('/login')
  }, [logout, router])

  function isActive(item: NavItem): boolean {
    if (item.href === '/users' && pathname.startsWith('/users')) return true
    return false
  }

  const linkClass = (cond: boolean) => `${styles.navItem} ${cond ? styles.active : ''}`.trim()

  return (
    <>
      <div className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ''}`} onClick={onClose} />
      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        <button className={styles.closeBtn} onClick={onClose} type="button" aria-label="Close navigation">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        <button className={styles.switchOrg} onClick={() => setOrgOpen(v => !v)} type="button">
        <Image src="/sidebar-icons/briefcase-1.svg" alt="" width={16} height={16} className={styles.icon} />
        <span className={styles.switchOrgLabel}>Switch Organization</span>
        <svg className={`${styles.arrow} ${orgOpen ? styles.arrowUp : ''}`} width="10" height="6" viewBox="0 0 10 6" fill="none">
          <path d="M0 0l5 5 5-5" fill="#213F7D"/>
        </svg>
      </button>

      <Link href="/dashboard" className={linkClass(pathname === '/dashboard')}>
        <Image src="/sidebar-icons/home-2.svg" alt="" width={16} height={16} className={styles.icon} />
        <span>Dashboard</span>
      </Link>

      <div className={styles.group}>
        <span className={styles.groupLabel}>CUSTOMERS</span>
        {customerItems.map(item =>
          item.href ? (
            <Link key={item.label} href={item.href} className={linkClass(isActive(item))}>
              <NavIcon src={item.icon} />
              <span>{item.label}</span>
            </Link>
          ) : (
            <a key={item.label} href="#" className={styles.navItem} onClick={e => e.preventDefault()}>
              <NavIcon src={item.icon} />
              <span>{item.label}</span>
            </a>
          )
        )}
      </div>

      <div className={styles.group}>
        <span className={styles.groupLabel}>BUSINESSES</span>
        {businessItems.map(item => (
          <a key={item.label} href="#" className={styles.navItem} onClick={e => e.preventDefault()}>
            <NavIcon src={item.icon} />
            <span>{item.label}</span>
          </a>
        ))}
      </div>

      <div className={styles.group}>
        <span className={styles.groupLabel}>SETTINGS</span>
        {settingsItems.map(item => (
          <a key={item.label} href="#" className={styles.navItem} onClick={e => e.preventDefault()}>
            <NavIcon src={item.icon} />
            <span>{item.label}</span>
          </a>
        ))}
      </div>

      <div className={styles.divider} />

      <button className={`${styles.navItem} ${styles.logoutItem}`} onClick={handleLogout} type="button">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={styles.icon}>
          <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M11 5l3 3-3 3M14 8H6" stroke="#213F7D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>Logout</span>
      </button>

      <div className={styles.version}>v1.2.0</div>
    </aside>
    </>
  )
}
