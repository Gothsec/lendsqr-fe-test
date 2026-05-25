import Image from 'next/image'
import { getDashboardStats } from '@/lib/data'
import styles from './page.module.scss'

const stats = getDashboardStats()

const cards = [
  { label: 'USERS', value: stats.totalUsers, icon: '/users-dashboard-icons/users.svg' },
  { label: 'ACTIVE USERS', value: stats.activeUsers, icon: '/users-dashboard-icons/active-users.svg' },
  { label: 'USERS WITH LOANS', value: stats.usersWithLoans, icon: '/users-dashboard-icons/users-with-loans.svg' },
  { label: 'USERS WITH SAVINGS', value: stats.usersWithSavings, icon: '/users-dashboard-icons/users-with-savings.svg' },
]

export default function DashboardPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Users</h1>
      <div className={styles.grid}>
        {cards.map(card => (
          <div key={card.label} className={styles.card}>
            <Image src={card.icon} alt="" width={40} height={40} />
            <span className={styles.label}>{card.label}</span>
            <span className={styles.value}>{card.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
