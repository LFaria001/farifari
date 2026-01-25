'use client'

import { useState } from 'react'

export default function ContributePage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Will submit to Supabase
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
        <h1 style={{ color: '#ffb366', marginBottom: '1rem' }}>Thank You!</h1>
        <p style={{ color: '#aaa', marginBottom: '2rem' }}>
          Your contribution has been submitted for review.
        </p>
        <button onClick={() => setSubmitted(false)} className="btn btn-primary">
          Submit Another
        </button>
      </div>
    )
  }

  return (
    <div className="container" style={{ padding: '2rem', maxWidth: '700px' }}>
      <h1 style={{
        fontSize: '2.5rem',
        fontWeight: 800,
        marginBottom: '0.5rem',
        background: 'linear-gradient(135deg, #ffb366, #ff6b35)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        Contribute a Cut
      </h1>
      <p style={{ color: '#aaa', marginBottom: '2rem' }}>
        Share your knowledge about meat cuts with the community.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>
            Cut Name *
          </label>
          <input type="text" name="name" required placeholder="e.g., Picanha" />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>
            Animal *
          </label>
          <select name="animal" required defaultValue="">
            <option value="" disabled>Select animal</option>
            <option value="beef">Beef</option>
            <option value="pork">Pork</option>
            <option value="lamb">Lamb</option>
            <option value="chicken">Chicken</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>
            Description *
          </label>
          <textarea
            name="description"
            required
            rows={4}
            placeholder="Describe where this cut comes from, its characteristics, and what makes it special..."
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>
            Recommended Cooking Methods
          </label>
          <input
            type="text"
            name="cooking_methods"
            placeholder="e.g., Grill, Pan-sear, Braise (comma separated)"
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>
            Pro Tips (optional)
          </label>
          <textarea
            name="tips"
            rows={3}
            placeholder="Any tips for preparing or cooking this cut..."
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>
            Your Name (for attribution)
          </label>
          <input type="text" name="contributor_name" placeholder="How should we credit you?" />
        </div>

        <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center' }}>
          Submit Contribution
        </button>

        <p style={{ color: '#666', fontSize: '0.85rem', textAlign: 'center' }}>
          Submissions are reviewed before being published.
        </p>
      </form>
    </div>
  )
}
