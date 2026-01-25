'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      window.location.href = '/'
    }
  }

  return (
    <div className="container" style={{
      padding: '4rem 2rem',
      maxWidth: '400px',
      margin: '0 auto',
    }}>
      <h1 style={{
        fontSize: '2rem',
        fontWeight: 800,
        marginBottom: '0.5rem',
        color: '#ffb366',
        textAlign: 'center',
      }}>
        Welcome Back
      </h1>
      <p style={{ color: '#aaa', textAlign: 'center', marginBottom: '2rem' }}>
        Sign in to contribute to Wiki Meaty
      </p>

      <form onSubmit={handleLogin} style={{ display: 'grid', gap: '1rem' }}>
        {error && (
          <div style={{
            background: 'rgba(255, 0, 0, 0.1)',
            border: '1px solid rgba(255, 0, 0, 0.3)',
            padding: '0.75rem',
            borderRadius: '8px',
            color: '#ff6b6b',
            fontSize: '0.9rem',
          }}>
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{ justifyContent: 'center', width: '100%' }}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#999' }}>
        Don't have an account?{' '}
        <Link href="/auth/signup" style={{ color: '#ffb366' }}>
          Sign up
        </Link>
      </p>
    </div>
  )
}
