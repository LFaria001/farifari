# Wiki Meaty App

The crowdsourced meat encyclopedia - built with Next.js and Supabase.

## Getting Started

### 1. Install dependencies

```bash
cd wikimeaty-app
npm install
```

### 2. Set up Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **Settings > API** and copy your:
   - Project URL
   - Anon/Public key

4. Create `.env.local` from the example:
```bash
cp .env.local.example .env.local
```

5. Add your Supabase credentials to `.env.local`

### 3. Set up the database

1. Go to your Supabase dashboard
2. Open the **SQL Editor**
3. Copy and run the contents of `supabase-schema.sql`

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
wikimeaty-app/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── page.tsx         # Home page
│   │   ├── cuts/            # Browse & view cuts
│   │   ├── contribute/      # Submit new cuts
│   │   └── auth/            # Login & signup
│   ├── components/          # Reusable components
│   └── lib/                 # Utilities (Supabase client)
├── supabase-schema.sql      # Database schema
└── package.json
```

## Next Steps

- [ ] Connect contribution form to Supabase
- [ ] Add image uploads (Supabase Storage)
- [ ] Build admin dashboard for approving contributions
- [ ] Add search functionality
- [ ] Implement user profiles
- [ ] Add recipes linked to cuts

## Deployment

Deploy to Vercel:

```bash
npm run build
```

Or connect your GitHub repo to [Vercel](https://vercel.com) for automatic deploys.
