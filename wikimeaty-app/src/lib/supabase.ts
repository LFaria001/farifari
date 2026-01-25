import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Database types (update these as you build your schema)
export type MeatCut = {
  id: string
  name: string
  animal: 'beef' | 'pork' | 'lamb' | 'chicken' | 'other'
  description: string
  cooking_methods: string[]
  image_url?: string
  contributed_by: string
  approved: boolean
  created_at: string
}

export type Contribution = {
  id: string
  user_id: string
  cut_name: string
  animal: string
  description: string
  cooking_methods: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}
