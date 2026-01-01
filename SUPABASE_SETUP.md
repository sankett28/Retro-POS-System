# Supabase Configuration Guide

## Current Status

**Note:** The current implementation uses **FastAPI backend with JSON files** for data storage. Supabase is **not required** for the current setup.

However, if you want to use Supabase (either for future migration or if you're keeping the Supabase client code), follow the instructions below.

## Where to Put Supabase Credentials

### Frontend (Next.js)

Create a `.env.local` file in the `frontend/` directory:

```bash
cd frontend
```

Create `.env.local` with:

```env
# Backend API URL (FastAPI - Required)
NEXT_PUBLIC_API_URL=http://localhost:8000

# Supabase Configuration (Optional - only if using Supabase)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Quick Setup

1. **Copy the example file:**
   ```bash
   cd frontend
   copy .env.local.example .env.local  # Windows
   # or
   cp .env.local.example .env.local     # Mac/Linux
   ```

2. **Edit `.env.local` and add your Supabase credentials:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## How to Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project (or create a new one)
3. Go to **Settings** → **API**
4. Copy the following:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Important Notes

### Current Implementation (FastAPI + JSON)

- ✅ **Backend uses JSON files** (`data/products.json`, `data/sales.json`)
- ✅ **No Supabase required** for current functionality
- ✅ The Supabase client code exists but is **not actively used** by the API routes

### If You Want to Use Supabase

If you plan to migrate back to Supabase or use it alongside the FastAPI backend:

1. **Set up Supabase database:**
   - Run the migration files in `migrations/` folder
   - See `migrations/README.md` for instructions

2. **Add credentials to `.env.local`:**
   - Follow the steps above

3. **Update backend to use Supabase:**
   - You would need to modify `backend/database.py` to use Supabase instead of JSON files
   - Or create a hybrid approach

## File Locations

```
frontend/
├── .env.local          # ← Create this file (not committed to git)
├── .env.local.example  # ← Template file (committed to git)
└── src/
    └── lib/
        └── supabase/
            └── client.ts  # ← Supabase client (currently not used)
```

## Environment Variable Priority

Next.js loads environment variables in this order:
1. `.env.local` (highest priority, not committed to git)
2. `.env.development` or `.env.production`
3. `.env`

**Always use `.env.local` for sensitive credentials like Supabase keys.**

## Security Best Practices

- ✅ **Never commit `.env.local`** to git (it's in `.gitignore`)
- ✅ **Use `.env.local.example`** as a template (this is committed)
- ✅ **Use the anon/public key** for client-side code (not the service role key)
- ✅ **Restrict Supabase RLS policies** if using Supabase

## Troubleshooting

### "Missing Supabase environment variables" Error

If you see this error but **don't want to use Supabase**:
- The error comes from `frontend/src/lib/supabase/client.ts`
- You can either:
  1. Add dummy values to `.env.local` (not recommended)
  2. Make the Supabase client optional (recommended - update the code)
  3. Remove the Supabase client if not needed

### Frontend Can't Connect to Backend

Make sure `NEXT_PUBLIC_API_URL` is set correctly:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

And that your FastAPI backend is running on port 8000.
