
# Campus Tasker - Starter Repo

This is a starter Next.js (App Router) project wired for Supabase. It is intentionally empty of demo tasks so that only real users create tasks after deployment.

## Quick start (local)

1. Copy `.env.local.example` to `.env.local` and set your Supabase keys.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run dev server:
   ```bash
   npm run dev
   ```

## Deploy

- Push to GitHub and connect to Vercel. Add the environment variables in Vercel settings:
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY
  - SUPABASE_SERVICE_ROLE_KEY (server only)

## Supabase

Run `schema.sql` in the Supabase SQL editor to create tables and RLS policies.
Create a storage bucket named `upi_qr` (public).

