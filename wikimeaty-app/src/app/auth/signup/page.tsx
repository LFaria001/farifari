'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="container" style={{
        padding: '4rem 2rem',
        maxWidth: '400px',
        margin: '0 auto',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📧</div>
        <h1 style={{ color: '#ffb366', marginBottom: '1rem' }}>Check Your Email</h1>
        <p style={{ color: '#aaa' }}>
          We've sent you a confirmation link. Click it to activate your account.
        </p>
      </div>
    )
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
        Join Wiki Meaty
      </h1>
      <p style={{ color: '#aaa', textAlign: 'center', marginBottom: '2rem' }}>
        Create an account to contribute
      </p>

      <form onSubmit={handleSignup} style={{ display: 'grid', gap: '1rem' }}>
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
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{ justifyContent: 'center', width: '100%' }}
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#999' }}>
        Already have an account?{' '}
        <Link href="/auth/login" style={{ color: '#ffb366' }}>
          Sign in
        </Link>
      </p>
    </div>
  )
}
