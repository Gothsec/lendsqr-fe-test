'use client'

import React, { useState, useEffect, useCallback, use } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import type { User, UserStatus } from '@/lib/types'
import { getUsers } from '@/lib/data'
import styles from './page.module.scss'

// SVG Icons
const BackArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#545F7D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '10px', verticalAlign: 'middle' }}>
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
)

const StarFilled = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#E9B200" style={{ marginRight: '2px' }}>
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
)

const StarOutline = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E9B200" strokeWidth="2" style={{ marginRight: '2px' }}>
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
)

type TabType = 'General Details' | 'Documents' | 'Bank Details' | 'Loans' | 'Savings' | 'App and System'

export default function UserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const [user, setUser] = useState<User | null>(null)
  const [usersList, setUsersList] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('General Details')

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('lendsqr_users')
    let parsed: User[] = []
    
    if (stored) {
      try {
        parsed = JSON.parse(stored) as User[]
      } catch (e) {
        parsed = getUsers()
        localStorage.setItem('lendsqr_users', JSON.stringify(parsed))
      }
    } else {
      parsed = getUsers()
      localStorage.setItem('lendsqr_users', JSON.stringify(parsed))
    }

    setUsersList(parsed)
    const found = parsed.find(u => u.id === id)
    if (found) {
      setUser(found)
    }
    setLoading(false)
  }, [id])

  // Update Status and Save
  const handleUpdateStatus = (newStatus: UserStatus) => {
    if (!user) return
    const updatedUser = { ...user, status: newStatus }
    setUser(updatedUser)
    
    const updatedList = usersList.map(u => (u.id === id ? updatedUser : u))
    setUsersList(updatedList)
    localStorage.setItem('lendsqr_users', JSON.stringify(updatedList))
  }

  // Deterministic Extra Fields to perfectly match Figma
  const getExtraFields = useCallback((userId: string) => {
    const numId = Number(userId) || 1
    return {
      maritalStatus: numId % 2 === 0 ? 'Married' : 'Single',
      children: numId % 3 === 0 ? 'None' : numId % 3 === 1 ? '1' : '2',
      residenceType: numId % 3 === 0 ? "Parent's House" : numId % 3 === 1 ? 'Rented Apartment' : 'Owned House',
      guarantorRelationship: numId % 2 === 0 ? 'Sibling' : 'Parent',
      guarantorEmail: `guarantor.${numId}@gmail.com`,
      bankName: numId % 3 === 0 ? 'Providus Bank' : numId % 3 === 1 ? 'GT Bank' : 'Access Bank',
      kycTier: numId % 3 === 0 ? 1 : numId % 3 === 1 ? 2 : 3,
    }
  }, [])

  if (loading) {
    return <div className={styles.loading}>Loading user profile...</div>
  }

  if (!user) {
    return (
      <div className={styles.notFound}>
        <h2>User profile not found</h2>
        <Link href="/users" className={styles.backLinkBtn}>
          <BackArrow /> Back to Users
        </Link>
      </div>
    )
  }

  const extra = getExtraFields(user.id)
  const incomeMin = user.education.monthlyIncome[0] || '₦0'
  const incomeMax = user.education.monthlyIncome[1] || '₦0'

  const tabs: TabType[] = ['General Details', 'Documents', 'Bank Details', 'Loans', 'Savings', 'App and System']

  return (
    <main className={styles.container}>
      {/* Back Link */}
      <Link href="/users" className={styles.backLink}>
        <BackArrow />
        <span>Back to Users</span>
      </Link>

      {/* Top Banner Actions */}
      <div className={styles.headerRow}>
        <h1 className={styles.title}>User Details</h1>
        <div className={styles.actionBtns}>
          <button
            onClick={() => handleUpdateStatus('blacklisted')}
            className={styles.blacklistBtn}
            type="button"
          >
            BLACKLIST USER
          </button>
          <button
            onClick={() => handleUpdateStatus('active')}
            className={styles.activateBtn}
            type="button"
          >
            ACTIVATE USER
          </button>
        </div>
      </div>

      {/* Profile Summary Card */}
      <div className={styles.summaryCard}>
        <div className={styles.summaryUpper}>
          <div className={styles.profileMeta}>
            <div className={styles.avatarWrap}>
              {user.profile.avatar ? (
                <img
                  src={user.profile.avatar}
                  alt={`${user.profile.firstName} ${user.profile.lastName}`}
                  width={100}
                  height={100}
                  className={styles.avatar}
                />
              ) : (
                <div className={styles.avatarFallback}>
                  {user.profile.firstName[0]}
                  {user.profile.lastName[0]}
                </div>
              )}
            </div>
            <div className={styles.metaText}>
              <h2>
                {user.profile.firstName} {user.profile.lastName}
              </h2>
              <p>{user.userName}</p>
            </div>
          </div>

          <div className={styles.verticalDivider} />

          <div className={styles.tierWrap}>
            <span className={styles.tierLabel}>User's Tier</span>
            <div className={styles.stars}>
              {Array.from({ length: 3 }).map((_, i) =>
                i < extra.kycTier ? <StarFilled key={i} /> : <StarOutline key={i} />
              )}
            </div>
          </div>

          <div className={styles.verticalDivider} />

          <div className={styles.financeWrap}>
            <span className={styles.balance}>{user.accountBalance}</span>
            <span className={styles.bankInfo}>
              {user.accountNumber || '9912345678'}/{extra.bankName}
            </span>
          </div>
        </div>

        {/* Tab Selection Navigation */}
        <nav className={styles.tabNav} aria-label="User profile sections">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${styles.tabBtn} ${activeTab === tab ? styles.activeTab : ''}`}
              type="button"
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Bottom Section Details Panel */}
      <div className={styles.detailsPanel}>
        {activeTab === 'General Details' ? (
          <div className={styles.generalDetails}>
            {/* 1. Personal Information */}
            <section className={styles.sectionBlock}>
              <h3>Personal Information</h3>
              <div className={styles.infoGrid}>
                <div className={styles.infoField}>
                  <span className={styles.label}>FULL NAME</span>
                  <span className={styles.value}>
                    {user.profile.firstName} {user.profile.lastName}
                  </span>
                </div>
                <div className={styles.infoField}>
                  <span className={styles.label}>PHONE NUMBER</span>
                  <span className={styles.value}>{user.profile.phoneNumber}</span>
                </div>
                <div className={styles.infoField}>
                  <span className={styles.label}>EMAIL ADDRESS</span>
                  <span className={styles.value}>{user.email}</span>
                </div>
                <div className={styles.infoField}>
                  <span className={styles.label}>BVN</span>
                  <span className={styles.value}>{user.profile.bvn}</span>
                </div>
                <div className={styles.infoField}>
                  <span className={styles.label}>GENDER</span>
                  <span className={styles.value}>{user.profile.gender}</span>
                </div>
                <div className={styles.infoField}>
                  <span className={styles.label}>MARITAL STATUS</span>
                  <span className={styles.value}>{extra.maritalStatus}</span>
                </div>
                <div className={styles.infoField}>
                  <span className={styles.label}>CHILDREN</span>
                  <span className={styles.value}>{extra.children}</span>
                </div>
                <div className={styles.infoField}>
                  <span className={styles.label}>TYPE OF RESIDENCE</span>
                  <span className={styles.value}>{extra.residenceType}</span>
                </div>
              </div>
            </section>

            <hr className={styles.divider} />

            {/* 2. Education and Employment */}
            <section className={styles.sectionBlock}>
              <h3>Education and Employment</h3>
              <div className={styles.infoGrid}>
                <div className={styles.infoField}>
                  <span className={styles.label}>LEVEL OF EDUCATION</span>
                  <span className={styles.value}>{user.education.level}</span>
                </div>
                <div className={styles.infoField}>
                  <span className={styles.label}>EMPLOYMENT STATUS</span>
                  <span className={styles.value}>{user.education.employmentStatus}</span>
                </div>
                <div className={styles.infoField}>
                  <span className={styles.label}>SECTOR OF EMPLOYMENT</span>
                  <span className={styles.value}>{user.education.sector}</span>
                </div>
                <div className={styles.infoField}>
                  <span className={styles.label}>DURATION OF EMPLOYMENT</span>
                  <span className={styles.value}>{user.education.duration}</span>
                </div>
                <div className={styles.infoField}>
                  <span className={styles.label}>OFFICE EMAIL</span>
                  <span className={styles.value}>{user.education.officeEmail}</span>
                </div>
                <div className={styles.infoField}>
                  <span className={styles.label}>MONTHLY INCOME</span>
                  <span className={styles.value}>
                    {incomeMin} - {incomeMax}
                  </span>
                </div>
                <div className={styles.infoField}>
                  <span className={styles.label}>LOAN REPAYMENT</span>
                  <span className={styles.value}>{user.education.loanRepayment}</span>
                </div>
              </div>
            </section>

            <hr className={styles.divider} />

            {/* 3. Socials */}
            <section className={styles.sectionBlock}>
              <h3>Socials</h3>
              <div className={styles.infoGrid}>
                <div className={styles.infoField}>
                  <span className={styles.label}>TWITTER</span>
                  <span className={styles.value}>
                    {user.socials.twitter.replace('https://twitter.com/', '')}
                  </span>
                </div>
                <div className={styles.infoField}>
                  <span className={styles.label}>FACEBOOK</span>
                  <span className={styles.value}>
                    {user.socials.facebook.replace('https://facebook.com/', '')}
                  </span>
                </div>
                <div className={styles.infoField}>
                  <span className={styles.label}>INSTAGRAM</span>
                  <span className={styles.value}>
                    {user.socials.instagram.replace('https://instagram.com/', '')}
                  </span>
                </div>
              </div>
            </section>

            <hr className={styles.divider} />

            {/* 4. Guarantor */}
            <section className={styles.sectionBlock}>
              <h3>Guarantor</h3>
              <div className={styles.infoGrid}>
                <div className={styles.infoField}>
                  <span className={styles.label}>FULL NAME</span>
                  <span className={styles.value}>
                    {user.guarantor.firstName} {user.guarantor.lastName}
                  </span>
                </div>
                <div className={styles.infoField}>
                  <span className={styles.label}>PHONE NUMBER</span>
                  <span className={styles.value}>{user.guarantor.phoneNumber}</span>
                </div>
                <div className={styles.infoField}>
                  <span className={styles.label}>EMAIL ADDRESS</span>
                  <span className={styles.value}>{extra.guarantorEmail}</span>
                </div>
                <div className={styles.infoField}>
                  <span className={styles.label}>RELATIONSHIP</span>
                  <span className={styles.value}>{extra.guarantorRelationship}</span>
                </div>
              </div>
            </section>
          </div>
        ) : (
          <div className={styles.placeholderTab}>
            <h3>{activeTab}</h3>
            <p>Documents, verification records and history for {user.profile.firstName}.</p>
          </div>
        )}
      </div>
    </main>
  )
}
