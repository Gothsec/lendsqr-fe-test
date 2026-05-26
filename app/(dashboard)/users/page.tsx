'use client'

import React, { useState, useCallback } from 'react'
import Image from 'next/image'
import type { User } from '@/lib/types'
import UsersTable from '@/components/UsersTable/UsersTable'
import styles from './page.module.scss'

export default function UsersPage() {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    loans: 0,
    savings: 0,
  })

  // Dynamic stats calculation when users list updates in the table component
  const handleUsersUpdate = useCallback((usersList: User[]) => {
    const total = usersList.length
    const active = usersList.filter(u => u.status === 'active').length
    
    const loans = usersList.filter(u => {
      const repayment = u.education.loanRepayment.replace(/[₦,]/g, '')
      return Number(repayment) > 0
    }).length

    const savings = usersList.filter(u => {
      const balance = u.accountBalance.replace(/[₦,]/g, '')
      return Number(balance) > 500000
    }).length

    setStats({ total, active, loans, savings })
  }, [])

  const cards = [
    { label: 'USERS', value: stats.total, icon: '/users-dashboard-icons/users.svg' },
    { label: 'ACTIVE USERS', value: stats.active, icon: '/users-dashboard-icons/active-users.svg' },
    { label: 'USERS WITH LOANS', value: stats.loans, icon: '/users-dashboard-icons/users-with-loans.svg' },
    { label: 'USERS WITH SAVINGS', value: stats.savings, icon: '/users-dashboard-icons/users-with-savings.svg' },
  ]

  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>Users</h1>
      
      <div className={styles.grid}>
        {cards.map(card => (
          <section key={card.label} className={styles.card} aria-label={card.label}>
            <Image src={card.icon} alt="" width={40} height={40} />
            <span className={styles.label}>{card.label}</span>
            <span className={styles.value}>{card.value.toLocaleString()}</span>
          </section>
        ))}
      </div>

      <UsersTable onUsersUpdate={handleUsersUpdate} />
    </main>
  )
}
