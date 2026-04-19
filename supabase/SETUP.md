# Supabase setup

Five steps. Budget 10 minutes.

## 1. Create the project

1. Sign in at [supabase.com](https://supabase.com) and create a new project.
2. Pick a strong database password and save it somewhere.
3. Wait for provisioning to finish (~2 min).

## 2. Apply the schema

1. In the Supabase dashboard, open **SQL Editor** → **New query**.
2. Paste the contents of `supabase/schema.sql` and run it.
3. (Optional) Paste `supabase/seed.sql` and run it to pre-populate some sample content.

## 3. Create the photo storage bucket

1. Go to **Storage** → **New bucket**.
2. Name it exactly `party-photos` (lowercase, matches `PHOTO_BUCKET` in `lib/supabase-server.ts`).
3. Toggle **Public bucket** **on** — uploaded photos need public URLs.
4. Leave everything else default and create.

Writes to the bucket come from the Next.js API routes using the service role key, so you don't need any additional bucket policies.

## 4. Grab your keys

In **Project Settings** → **API**:

- `NEXT_PUBLIC_SUPABASE_URL` → the project URL at the top.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → the `anon` `public` key.
- `SUPABASE_SERVICE_ROLE_KEY` → the `service_role` `secret` key. **Never commit this or expose it to the browser.**

Copy `.env.local.example` to `.env.local` and fill those in, plus a `PARTY_PASSPHRASE` of your choosing (this is what guests will type to unlock posting).

## 5. Run the app

```bash
npm install
npm run dev
```

Open http://localhost:3000. On first load you'll see the scrapbook. Try to post something — the passphrase modal should appear. Enter your `PARTY_PASSPHRASE` and the post should save to Supabase and appear on the page.

## Deploying to Vercel

Set the same four env vars in Vercel project settings (Production + Preview). `vercel --prod` from the project root and you're live.
