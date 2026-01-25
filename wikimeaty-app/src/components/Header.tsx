'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header style={{
      padding: '1rem 0',
      borderBottom: '1px solid rgba(255, 179, 102, 0.1)',
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Link href="/" style={{
          fontSize: '1.5rem',
          fontWeight: 800,
          color: '#ffb366',
          textDecoration: 'none',
        }}>
          🥩 Wiki Meaty
        </Link>

        <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link href="/cuts">Browse Cuts</Link>
          <Link href="/contribute">Contribute</Link>
          <Link href="/auth/login" className="btn btn-primary">
            Sign In
          </Link>
        </nav>
      </div>
    </header>
  )
}
