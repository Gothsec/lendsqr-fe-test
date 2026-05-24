'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { mockLogin } from '@/lib/auth'
import { useAuth } from '@/context/AuthContext'
import styles from './page.module.scss'

export default function LoginPage() {
  const router = useRouter()
  const { login, isAuthenticated } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard')
    }
  }, [isAuthenticated, router])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = mockLogin(email, password)

    if (!result.success) {
      setError(result.error)
      setLoading(false)
      return
    }

    login(result.user)
    router.push('/dashboard')
  }

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.logoWrap}>
          <Image src="/logo.svg" alt="lendsqr" width={174} height={36} priority />
        </div>
        <div className={styles.illustration}>
          <Image src="/pablo-sign-in.png" alt="Sign in" width={900} height={338} priority />
        </div>
      </div>
      <div className={styles.right}>
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <h1 className={styles.title}>Welcome!</h1>
          <p className={styles.subtitle}>Enter details to login.</p>
          <input
            className={`${styles.input} ${error ? styles.inputError : ''}`}
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => { setEmail(e.target.value); setError('') }}
            required
          />
          <div className={styles.passwordWrap}>
            <input
              className={`${styles.input} ${error ? styles.inputError : ''}`}
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError('') }}
              required
            />
            <button
              type="button"
              className={styles.toggle}
              onClick={() => setShowPassword(p => !p)}
            >
              {showPassword ? 'HIDE' : 'SHOW'}
            </button>
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <a href="#" className={styles.forgot} onClick={e => e.preventDefault()}>FORGOT PASSWORD?</a>
          <button type="submit" className={styles.submit} disabled={loading}>
            {loading ? 'LOGGING IN...' : 'LOG IN'}
          </button>
        </form>
      </div>
    </div>
  )
}
