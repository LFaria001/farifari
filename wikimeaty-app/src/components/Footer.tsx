import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{
      padding: '2rem 0',
      borderTop: '1px solid rgba(255, 179, 102, 0.1)',
      textAlign: 'center',
      color: '#999',
    }}>
      <div className="container">
        <p>&copy; 2026 Wiki Meaty. All rights reserved.</p>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
          marginTop: '1rem',
        }}>
          <Link href="https://farifari.com" target="_blank">farifari.com</Link>
          <Link href="https://farifari.com/wikimeaty/privacy.html">Privacy</Link>
          <Link href="https://farifari.com/wikimeaty/terms.html">Terms</Link>
        </div>
      </div>
    </footer>
  )
}
