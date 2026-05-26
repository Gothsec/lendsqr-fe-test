'use client'

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getUsers } from '@/lib/data'
import type { User, UserStatus } from '@/lib/types'
import styles from './UsersTable.module.scss'

// Helper SVG Icons
const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '6px', cursor: 'pointer', verticalAlign: 'middle' }}>
    <path d="M6.22222 12.4444H9.77778V10.6667H6.22222V12.4444ZM1.77778 3.55556V5.33333H14.2222V3.55556H1.77778ZM3.55556 8.88889H12.4444V7.11111H3.55556V8.88889Z" fill="#545F7D"/>
  </svg>
)

const ChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 9L12 15L18 9" stroke="#545F7D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ThreeDots = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="5" r="1.5" fill="#545F7D"/>
    <circle cx="10" cy="10" r="1.5" fill="#545F7D"/>
    <circle cx="10" cy="15" r="1.5" fill="#545F7D"/>
  </svg>
)

const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#545F7D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const UserXIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#545F7D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="17" y1="8" x2="23" y2="14" />
    <line x1="23" y1="8" x2="17" y2="14" />
  </svg>
)

const UserCheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#545F7D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <polyline points="17 11 19 13 23 9" />
  </svg>
)

const ArrowLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#213F7D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)

const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#213F7D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#545F7D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer' }}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

interface FilterState {
  orgName: string
  userName: string
  email: string
  date: string
  phoneNumber: string
  status: string
}

const initialFilters: FilterState = {
  orgName: '',
  userName: '',
  email: '',
  date: '',
  phoneNumber: '',
  status: '',
}

interface UsersTableProps {
  onUsersUpdate?: (users: User[]) => void
}

export default function UsersTable({ onUsersUpdate }: UsersTableProps) {
  const router = useRouter()
  
  // Data state
  const [users, setUsers] = useState<User[]>([])
  const [mounted, setMounted] = useState(false)
  
  // Filter popover state
  const [filterOpen, setFilterOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>(initialFilters)
  const [activeFilters, setActiveFilters] = useState<FilterState>(initialFilters)
  
  // Actions dropdown state
  const [activeRowId, setActiveRowId] = useState<string | null>(null)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Refs for closing dropdowns when clicking outside
  const filterRef = useRef<HTMLDivElement>(null)
  const actionsRef = useRef<HTMLDivElement>(null)
  const filterBtnRef = useRef<HTMLButtonElement>(null)

  // Load from localStorage or set defaults
  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('lendsqr_users')
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as User[]
        setUsers(parsed)
        if (onUsersUpdate) onUsersUpdate(parsed)
      } catch (e) {
        const initial = getUsers()
        setUsers(initial)
        localStorage.setItem('lendsqr_users', JSON.stringify(initial))
        if (onUsersUpdate) onUsersUpdate(initial)
      }
    } else {
      const initial = getUsers()
      setUsers(initial)
      localStorage.setItem('lendsqr_users', JSON.stringify(initial))
      if (onUsersUpdate) onUsersUpdate(initial)
    }
  }, [onUsersUpdate])

  // Save to localStorage whenever users list changes
  const saveUsers = useCallback((updated: User[]) => {
    setUsers(updated)
    localStorage.setItem('lendsqr_users', JSON.stringify(updated))
    if (onUsersUpdate) onUsersUpdate(updated)
  }, [onUsersUpdate])

  // Extract unique organizations for the filter select input
  const organizations = useMemo(() => {
    const orgs = new Set(users.map(u => u.orgName))
    return Array.from(orgs).sort()
  }, [users])

  // Handle outside clicks
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        filterOpen &&
        filterRef.current &&
        !filterRef.current.contains(e.target as Node) &&
        filterBtnRef.current &&
        !filterBtnRef.current.contains(e.target as Node)
      ) {
        setFilterOpen(false)
      }
      if (
        activeRowId &&
        actionsRef.current &&
        !actionsRef.current.contains(e.target as Node)
      ) {
        setActiveRowId(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [filterOpen, activeRowId])

  // Date Formatter (matches Figma)
  const formatDate = useCallback((dateStr: string) => {
    try {
      const date = new Date(dateStr)
      const options: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }
      return date.toLocaleDateString('en-US', options)
    } catch (e) {
      return dateStr
    }
  }, [])

  // Filter handlers
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  const applyFilters = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setActiveFilters(filters)
    setCurrentPage(1)
    setFilterOpen(false)
  }

  const resetFilters = () => {
    setFilters(initialFilters)
    setActiveFilters(initialFilters)
    setCurrentPage(1)
    setFilterOpen(false)
  }

  // Row status toggles
  const updateStatus = (userId: string, newStatus: UserStatus) => {
    const updated = users.map(u => {
      if (u.id === userId) {
        return { ...u, status: newStatus }
      }
      return u
    })
    saveUsers(updated)
    setActiveRowId(null)
  }

  // Filter application to mock users list
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      if (activeFilters.orgName && user.orgName !== activeFilters.orgName) return false
      
      if (
        activeFilters.userName &&
        !user.userName.toLowerCase().includes(activeFilters.userName.toLowerCase())
      )
        return false

      if (
        activeFilters.email &&
        !user.email.toLowerCase().includes(activeFilters.email.toLowerCase())
      )
        return false

      if (
        activeFilters.phoneNumber &&
        !user.phoneNumber.includes(activeFilters.phoneNumber)
      )
        return false

      if (activeFilters.status && user.status !== activeFilters.status) return false

      if (activeFilters.date) {
        const formatted = formatDate(user.createdAt).toLowerCase()
        const search = activeFilters.date.toLowerCase()
        if (!formatted.includes(search) && !user.createdAt.includes(search)) return false
      }

      return true
    })
  }, [users, activeFilters, formatDate])

  // Pagination logic
  const totalItems = filteredUsers.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const displayedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredUsers.slice(start, start + pageSize)
  }, [filteredUsers, currentPage, pageSize])

  // Page index helpers
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      setActiveRowId(null)
    }
  }

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value))
    setCurrentPage(1)
    setActiveRowId(null)
  }

  // Build page buttons range (e.g. 1 2 3 ... 9 10)
  const paginationRange = useMemo(() => {
    const range: (number | string)[] = []
    const siblingCount = 1

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        range.push(i)
      }
      return range
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)

    const shouldShowLeftDots = leftSiblingIndex > 2
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount
      for (let i = 1; i <= leftItemCount; i++) {
        range.push(i)
      }
      range.push('...')
      range.push(totalPages)
    } else if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount
      range.push(1)
      range.push('...')
      for (let i = totalPages - rightItemCount + 1; i <= totalPages; i++) {
        range.push(i)
      }
    } else if (shouldShowLeftDots && shouldShowRightDots) {
      range.push(1)
      range.push('...')
      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        range.push(i)
      }
      range.push('...')
      range.push(totalPages)
    }

    return range
  }, [totalPages, currentPage])

  if (!mounted) {
    return <div className={styles.loading}>Loading data...</div>
  }

  return (
    <div className={styles.tableSection}>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>
                <div className={styles.headerCell}>
                  <span>ORGANIZATION</span>
                  <button 
                    ref={filterBtnRef}
                    onClick={() => setFilterOpen(o => !o)} 
                    type="button" 
                    className={styles.iconBtn}
                    aria-label="Filter columns"
                  >
                    <FilterIcon />
                  </button>
                  
                  {/* Floating Filter Popover */}
                  {filterOpen && (
                    <div ref={filterRef} className={styles.filterPopup}>
                      <form onSubmit={applyFilters} className={styles.filterForm}>
                        <div className={styles.formGroup}>
                          <label htmlFor="orgName">Organization</label>
                          <div className={styles.selectWrap}>
                            <select
                              id="orgName"
                              name="orgName"
                              value={filters.orgName}
                              onChange={handleFilterChange}
                            >
                              <option value="">Select</option>
                              {organizations.map(org => (
                                <option key={org} value={org}>
                                  {org}
                                </option>
                              ))}
                            </select>
                            <span className={styles.selectChevron}>
                              <ChevronDown />
                            </span>
                          </div>
                        </div>

                        <div className={styles.formGroup}>
                          <label htmlFor="userName">Username</label>
                          <input
                            id="userName"
                            name="userName"
                            type="text"
                            placeholder="User"
                            value={filters.userName}
                            onChange={handleFilterChange}
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label htmlFor="email">Email</label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={filters.email}
                            onChange={handleFilterChange}
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label htmlFor="date">Date</label>
                          <div className={styles.inputIconWrap}>
                            <input
                              id="date"
                              name="date"
                              type="text"
                              placeholder="Date"
                              value={filters.date}
                              onChange={handleFilterChange}
                            />
                            <span className={styles.inputIcon}>
                              <CalendarIcon />
                            </span>
                          </div>
                        </div>

                        <div className={styles.formGroup}>
                          <label htmlFor="phoneNumber">Phone Number</label>
                          <input
                            id="phoneNumber"
                            name="phoneNumber"
                            type="text"
                            placeholder="Phone Number"
                            value={filters.phoneNumber}
                            onChange={handleFilterChange}
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label htmlFor="status">Status</label>
                          <div className={styles.selectWrap}>
                            <select
                              id="status"
                              name="status"
                              value={filters.status}
                              onChange={handleFilterChange}
                            >
                              <option value="">Select</option>
                              <option value="active">Active</option>
                              <option value="pending">Pending</option>
                              <option value="inactive">Inactive</option>
                              <option value="blacklisted">Blacklisted</option>
                            </select>
                            <span className={styles.selectChevron}>
                              <ChevronDown />
                            </span>
                          </div>
                        </div>

                        <div className={styles.formActions}>
                          <button
                            type="button"
                            className={styles.resetBtn}
                            onClick={resetFilters}
                          >
                            Reset
                          </button>
                          <button type="submit" className={styles.submitBtn}>
                            Filter
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </th>
              <th>
                <div className={styles.headerCell}>
                  <span>USERNAME</span>
                  <button onClick={() => setFilterOpen(o => !o)} type="button" className={styles.iconBtn} aria-label="Filter username">
                    <FilterIcon />
                  </button>
                </div>
              </th>
              <th>
                <div className={styles.headerCell}>
                  <span>EMAIL</span>
                  <button onClick={() => setFilterOpen(o => !o)} type="button" className={styles.iconBtn} aria-label="Filter email">
                    <FilterIcon />
                  </button>
                </div>
              </th>
              <th>
                <div className={styles.headerCell}>
                  <span>PHONE NUMBER</span>
                  <button onClick={() => setFilterOpen(o => !o)} type="button" className={styles.iconBtn} aria-label="Filter phone number">
                    <FilterIcon />
                  </button>
                </div>
              </th>
              <th>
                <div className={styles.headerCell}>
                  <span>DATE JOINED</span>
                  <button onClick={() => setFilterOpen(o => !o)} type="button" className={styles.iconBtn} aria-label="Filter date joined">
                    <FilterIcon />
                  </button>
                </div>
              </th>
              <th>
                <div className={styles.headerCell}>
                  <span>STATUS</span>
                  <button onClick={() => setFilterOpen(o => !o)} type="button" className={styles.iconBtn} aria-label="Filter status">
                    <FilterIcon />
                  </button>
                </div>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {displayedUsers.length > 0 ? (
              displayedUsers.map(user => {
                const isActionsOpen = activeRowId === user.id
                return (
                  <tr key={user.id}>
                    <td>{user.orgName}</td>
                    <td>{user.userName}</td>
                    <td>{user.email}</td>
                    <td>{user.phoneNumber}</td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[user.status]}`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className={styles.actionCell}>
                      <button
                        onClick={() => setActiveRowId(o => (o === user.id ? null : user.id))}
                        type="button"
                        className={styles.actionsBtn}
                        aria-label="User actions"
                      >
                        <ThreeDots />
                      </button>

                      {/* Row Action Dropdown Menu */}
                      {isActionsOpen && (
                        <div ref={actionsRef} className={styles.actionsDropdown}>
                          <Link href={`/users/${user.id}`} className={styles.actionItem}>
                            <EyeIcon />
                            <span>View Details</span>
                          </Link>
                          <button
                            type="button"
                            className={styles.actionItem}
                            onClick={() => updateStatus(user.id, 'blacklisted')}
                          >
                            <UserXIcon />
                            <span>Blacklist User</span>
                          </button>
                          <button
                            type="button"
                            className={styles.actionItem}
                            onClick={() => updateStatus(user.id, 'active')}
                          >
                            <UserCheckIcon />
                            <span>Activate User</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={7} className={styles.noResults}>
                  No users found matching filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Paginator Footer */}
      {totalPages > 0 && (
        <div className={styles.paginationSection}>
          <div className={styles.pageSizeSelector}>
            <span>Showing</span>
            <div className={styles.pageSizeSelectWrap}>
              <select value={pageSize} onChange={handlePageSizeChange}>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className={styles.chevronIcon}>
                <ChevronDown />
              </span>
            </div>
            <span>out of {totalItems}</span>
          </div>

          <div className={styles.pageNavigation}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              type="button"
              className={styles.navArrow}
              aria-label="Previous page"
            >
              <ArrowLeft />
            </button>

            <div className={styles.pageNumbers}>
              {paginationRange.map((pageNumber, idx) => {
                if (pageNumber === '...') {
                  return (
                    <span key={`dots-${idx}`} className={styles.dots}>
                      ...
                    </span>
                  )
                }
                return (
                  <button
                    key={`page-${pageNumber}`}
                    onClick={() => handlePageChange(pageNumber as number)}
                    className={`${styles.pageNumberBtn} ${
                      currentPage === pageNumber ? styles.activePage : ''
                    }`}
                    type="button"
                  >
                    {pageNumber}
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              type="button"
              className={styles.navArrow}
              aria-label="Next page"
            >
              <ArrowRight />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
