# Steph's Grad Party

A mini scrapbook-style site for Stephanie's RMT graduation party — countdown, photo wall, guest book, memory prompts, song requests. Built for guests to scan a QR code at the venue and contribute.

Implemented from a Claude Design handoff bundle; design spec lives in `/tmp/design-extract/steph-grad-party-site/project/scrapbook.jsx` (or wherever the handoff was extracted).

## Stack

- Next.js 14 App Router + TypeScript
- Supabase (Postgres + Storage) for shared state
- Deploys on Vercel

## Run locally

1. Follow [`supabase/SETUP.md`](supabase/SETUP.md) to provision a Supabase project and bucket.
2. Copy `.env.local.example` → `.env.local` and fill in the four variables.
3. Install and start (Node ≥18.17 required; `.nvmrc` pins Node 22):

   ```bash
   nvm use       # picks up .nvmrc
   npm install
   npm run dev
   ```

4. Open <http://localhost:3000>.

## Personalize

All the copy that'll change per-event lives in [`lib/event.ts`](lib/event.ts):

- `EVENT_NAME`, `EVENT_TAGLINE_L1`, `EVENT_TAGLINE_L2`
- `EVENT_DATE_ISO` (drives the countdown)
- `EVENT_DATE_LABEL` (shown on the ticket stub)
- `VENUE`
- `ABOUT_FACTS` (the dossier card)
- `MEMORY_PROMPTS`

The palette is locked to sage + honey from the design. If you want to swap it, edit [`lib/palette.ts`](lib/palette.ts).

## Deploying to Vercel

1. Push this repo to GitHub and import it in Vercel.
2. Set these env vars (Production + Preview):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `PARTY_PASSPHRASE`
3. Deploy. That's it.

## Access & rate limiting

Anyone with the link can read the site. To *post* anything, visitors must enter `PARTY_PASSPHRASE` once — it sets a 30-day cookie. Rate limits per IP per minute:

| Kind     | Limit   |
| -------- | ------- |
| photos   | 3/min   |
| guestbook| 5/min   |
| memories | 5/min   |
| songs    | 10/min  |

## Notes

- Photos are resized client-side to 800px max width before upload to keep storage lean.
- First-load fallback content (Jen/Marcus/Mom sample entries) is rendered only when the real tables are empty — post anything and it disappears.
