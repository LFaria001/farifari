import Link from 'next/link'

// This will be dynamic with Supabase
const sampleCut = {
  id: '1',
  name: 'Ribeye',
  animal: 'beef',
  description: 'The ribeye is a well-marbled, flavorful steak cut from the rib section of beef. Known for its rich taste and tender texture, it\'s one of the most popular steaks worldwide.',
  cooking_methods: ['Grill', 'Pan-sear', 'Reverse sear', 'Sous vide'],
  contributed_by: 'Chef Marco',
  tips: [
    'Let the steak come to room temperature before cooking',
    'Season generously with salt and pepper',
    'Use high heat for a good crust',
    'Rest for 5-10 minutes before slicing',
  ],
  similar_cuts: ['New York Strip', 'Tomahawk', 'Prime Rib'],
}

export default function CutPage({ params }: { params: { id: string } }) {
  const cut = sampleCut // Will fetch from Supabase by params.id

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <Link href="/cuts" style={{ color: '#999', marginBottom: '1rem', display: 'inline-block' }}>
        ← Back to all cuts
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginTop: '1rem' }}>
        {/* Image placeholder */}
        <div style={{
          background: 'linear-gradient(135deg, #8b4513, #5c2e0f)',
          borderRadius: '16px',
          aspectRatio: '4/3',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '4rem',
        }}>
          🥩
        </div>

        {/* Details */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              color: '#ffb366',
            }}>
              {cut.name}
            </h1>
            <span style={{
              background: 'rgba(255, 179, 102, 0.2)',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              textTransform: 'capitalize',
            }}>
              {cut.animal}
            </span>
          </div>

          <p style={{ color: '#ccc', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            {cut.description}
          </p>

          <h3 style={{ color: '#ffb366', marginBottom: '0.75rem' }}>Cooking Methods</h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {cut.cooking_methods.map(method => (
              <span key={method} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
                {method}
              </span>
            ))}
          </div>

          <h3 style={{ color: '#ffb366', marginBottom: '0.75rem' }}>Pro Tips</h3>
          <ul style={{ color: '#aaa', paddingLeft: '1.5rem', marginBottom: '2rem' }}>
            {cut.tips.map((tip, i) => (
              <li key={i} style={{ marginBottom: '0.5rem' }}>{tip}</li>
            ))}
          </ul>

          <p style={{ color: '#666', fontSize: '0.9rem' }}>
            Contributed by <strong style={{ color: '#ffb366' }}>{cut.contributed_by}</strong>
          </p>
        </div>
      </div>

      {/* Similar cuts */}
      <section style={{ marginTop: '4rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Similar Cuts</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {cut.similar_cuts.map(name => (
            <div key={name} className="card" style={{ padding: '1rem 1.5rem' }}>
              {name}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
