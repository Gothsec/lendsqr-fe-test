import { getDashboardStats, getStatusDistribution, getRecentUsers } from '@/lib/data'
import Image from 'next/image'
import styles from './page.module.scss'

const stats = getDashboardStats()
const distribution = getStatusDistribution()
const recentUsers = getRecentUsers(8)

const total = stats.totalUsers

const cards = [
  { label: 'USERS', value: stats.totalUsers, icon: '/users-dashboard-icons/users.svg' },
  { label: 'ACTIVE USERS', value: stats.activeUsers, icon: '/users-dashboard-icons/active-users.svg' },
  { label: 'USERS WITH LOANS', value: stats.usersWithLoans, icon: '/users-dashboard-icons/users-with-loans.svg' },
  { label: 'USERS WITH SAVINGS', value: stats.usersWithSavings, icon: '/users-dashboard-icons/users-with-savings.svg' },
] as const

const statusBars = [
  { label: 'Active', key: 'active' as const, color: 'var(--color-status-active)' },
  { label: 'Pending', key: 'pending' as const, color: 'var(--color-status-pending)' },
  { label: 'Inactive', key: 'inactive' as const, color: 'var(--color-status-inactive)' },
  { label: 'Blacklisted', key: 'blacklisted' as const, color: 'var(--color-status-blacklisted)' },
] as const

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function getInitials(firstName: string, lastName: string) {
  return `${(firstName ?? '')[0] ?? ''}${(lastName ?? '')[0] ?? ''}`.toUpperCase() || '?'
}

export default function DashboardPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Dashboard</h1>

      <div className={styles.grid}>
        {cards.map(card => (
          <article key={card.label} className={styles.card}>
            <div className={styles.cardIcon}>
              <Image src={card.icon} alt="" width={40} height={40} />
            </div>
            <span className={styles.cardLabel}>{card.label}</span>
            <span className={styles.cardValue}>{card.value.toLocaleString()}</span>
          </article>
        ))}
      </div>

      <div className={styles.bottomGrid}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>User Status Distribution</h2>
          <div className={styles.statusList}>
            {statusBars.map(({ label, key, color }) => {
              const count = distribution[key]
              const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : '0'
              return (
                <div key={key} className={styles.statusRow}>
                  <div className={styles.statusHeader}>
                    <span className={styles.statusLabel}>
                      <span className={styles.statusDot} style={{ background: color }} />
                      {label}
                    </span>
                    <span className={styles.statusCount}>
                      {count.toLocaleString()} ({percentage}%)
                    </span>
                  </div>
                  <div className={styles.statusBar}>
                    <div
                      className={styles.statusBarFill}
                      style={{
                        width: `${percentage}%`,
                        background: color,
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Recent Users</h2>
          <div className={styles.recentList}>
            {recentUsers.map(user => (
              <div key={user.id} className={styles.recentRow}>
                <div className={styles.recentAvatar}>
                  {user.profile.avatar ? (
                    <Image src={user.profile.avatar} alt="" width={36} height={36} className={styles.avatarImg} />
                  ) : (
                    <span className={styles.recentInitials}>
                      {getInitials(user.profile.firstName, user.profile.lastName)}
                    </span>
                  )}
                </div>
                <div className={styles.recentInfo}>
                  <span className={styles.recentName}>
                    {user.profile.firstName} {user.profile.lastName}
                  </span>
                  <span className={styles.recentEmail}>{user.email}</span>
                </div>
                <div className={styles.recentMeta}>
                  <span className={styles.recentOrg}>{user.orgName}</span>
                  <span className={styles.recentDate}>{formatDate(user.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
