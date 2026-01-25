'use client'

import { useState } from 'react'
import Link from 'next/link'

// Sample data - will come from Supabase
const sampleCuts = [
  { id: '1', name: 'Ribeye', animal: 'beef', description: 'Well-marbled, flavorful steak cut from the rib section.', cooking_methods: ['Grill', 'Pan-sear', 'Reverse sear'] },
  { id: '2', name: 'Picanha', animal: 'beef', description: 'Brazilian favorite, cut from the top sirloin cap.', cooking_methods: ['Grill', 'Rotisserie'] },
  { id: '3', name: 'Pork Belly', animal: 'pork', description: 'Rich, fatty cut perfect for slow cooking or crisping.', cooking_methods: ['Braise', 'Roast', 'Smoke'] },
  { id: '4', name: 'Lamb Shank', animal: 'lamb', description: 'Flavorful cut from the leg, ideal for braising.', cooking_methods: ['Braise', 'Slow cook'] },
  { id: '5', name: 'Brisket', animal: 'beef', description: 'Large cut from the breast, famous for BBQ.', cooking_methods: ['Smoke', 'Braise'] },
  { id: '6', name: 'Secreto Ibérico', animal: 'pork', description: 'Hidden cut from Iberian pigs, incredibly marbled.', cooking_methods: ['Grill', 'Pan-sear'] },
]

const animals = ['all', 'beef', 'pork', 'lamb', 'chicken', 'other']

export default function CutsPage() {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filteredCuts = sampleCuts.filter(cut => {
    const matchesAnimal = filter === 'all' || cut.animal === filter
    const matchesSearch = cut.name.toLowerCase().includes(search.toLowerCase())
    return matchesAnimal && matchesSearch
  })

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <h1 style={{
        fontSize: '2.5rem',
        fontWeight: 800,
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, #ffb366, #ff6b35)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        Browse Meat Cuts
      </h1>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search cuts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: '300px' }}
        />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {animals.map(animal => (
            <button
              key={animal}
              onClick={() => setFilter(animal)}
              className={`btn ${filter === animal ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.5rem 1rem', textTransform: 'capitalize' }}
            >
              {animal}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-2">
        {filteredCuts.map(cut => (
          <Link
            key={cut.id}
            href={`/cuts/${cut.id}`}
            className="card"
            style={{ textDecoration: 'none' }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '0.75rem',
            }}>
              <h3 style={{ color: '#ffb366', fontSize: '1.25rem' }}>{cut.name}</h3>
              <span style={{
                background: 'rgba(255, 179, 102, 0.2)',
                padding: '0.25rem 0.75rem',
                borderRadius: '20px',
                fontSize: '0.8rem',
                textTransform: 'capitalize',
              }}>
                {cut.animal}
              </span>
            </div>
            <p style={{ color: '#aaa', marginBottom: '1rem', fontSize: '0.95rem' }}>
              {cut.description}
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {cut.cooking_methods.map(method => (
                <span key={method} style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  color: '#999',
                }}>
                  {method}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      {filteredCuts.length === 0 && (
        <p style={{ textAlign: 'center', color: '#999', padding: '3rem' }}>
          No cuts found. Try a different search or filter.
        </p>
      )}
    </div>
  )
}
