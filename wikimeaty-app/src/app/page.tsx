import Link from 'next/link'

export default function Home() {
  return (
    <div className="container" style={{ padding: '4rem 2rem' }}>
      {/* Hero */}
      <section style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 6vw, 4rem)',
          fontWeight: 900,
          background: 'linear-gradient(135deg, #ffb366, #ff6b35)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1.5rem',
        }}>
          The World's Meat Encyclopedia
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#ccc', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
          Explore meat cuts, cooking methods, and recipes from around the world. Built by chefs, butchers, and meat lovers.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link href="/cuts" className="btn btn-primary">
            Browse Cuts
          </Link>
          <Link href="/contribute" className="btn btn-secondary">
            Contribute
          </Link>
        </div>
      </section>

      {/* Featured Categories */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
          Explore by Animal
        </h2>
        <div className="grid grid-cols-3">
          {[
            { name: 'Beef', emoji: '🐄', count: 45 },
            { name: 'Pork', emoji: '🐷', count: 32 },
            { name: 'Lamb', emoji: '🐑', count: 18 },
            { name: 'Chicken', emoji: '🐔', count: 12 },
            { name: 'Game', emoji: '🦌', count: 8 },
            { name: 'Other', emoji: '🍖', count: 15 },
          ].map((animal) => (
            <Link
              key={animal.name}
              href={`/cuts?animal=${animal.name.toLowerCase()}`}
              className="card"
              style={{ textAlign: 'center', textDecoration: 'none' }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{animal.emoji}</div>
              <h3 style={{ color: '#ffb366', marginBottom: '0.25rem' }}>{animal.name}</h3>
              <p style={{ color: '#999', fontSize: '0.9rem' }}>{animal.count} cuts</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Contributions */}
      <section>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
          Recently Added
        </h2>
        <div className="grid grid-cols-2">
          {[
            { name: 'Picanha', animal: 'Beef', contributor: 'Chef Marco' },
            { name: 'Secreto Ibérico', animal: 'Pork', contributor: 'Ana G.' },
            { name: 'Lamb Neck', animal: 'Lamb', contributor: 'Butcher Joe' },
            { name: 'Bavette', animal: 'Beef', contributor: 'MeatLover99' },
          ].map((cut) => (
            <div key={cut.name} className="card">
              <h3 style={{ color: '#ffb366', marginBottom: '0.5rem' }}>{cut.name}</h3>
              <p style={{ color: '#999', fontSize: '0.9rem' }}>
                {cut.animal} • Added by {cut.contributor}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
