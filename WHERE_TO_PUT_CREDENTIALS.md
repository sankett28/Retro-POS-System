# Where to Put Supabase URLs and API Keys

## Quick Answer

**Put Supabase credentials in:** `frontend/.env.local`

## Step-by-Step Instructions

### 1. Navigate to Frontend Directory

```bash
cd frontend
```

### 2. Create `.env.local` File

**Windows:**
```powershell
copy env.local.example .env.local
```

**Mac/Linux:**
```bash
cp env.local.example .env.local
```

### 3. Edit `.env.local` and Add Your Credentials

Open `frontend/.env.local` and add:

```env
# Backend API URL (Required)
NEXT_PUBLIC_API_URL=http://localhost:8000

# Supabase Configuration (Add your credentials here)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project (or create a new one)
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → Use for `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → Use for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Important Notes

### Current Implementation

⚠️ **The current app uses FastAPI backend with JSON files, NOT Supabase.**

- The Supabase client code exists but is **optional**
- You don't need Supabase credentials to run the app
- The app will work fine without them

### If You Want to Use Supabase

If you plan to use Supabase:
1. Add credentials to `frontend/.env.local` (as shown above)
2. Set up your Supabase database using the migration files in `migrations/`
3. Update the backend to use Supabase instead of JSON files

## File Structure

```
frontend/
├── .env.local          # ← Create this file (your credentials go here)
├── env.local.example   # ← Template file (already created)
└── src/
    └── lib/
        └── supabase/
            └── client.ts  # ← Supabase client (optional)
```

## Security

- ✅ `.env.local` is in `.gitignore` (won't be committed)
- ✅ `env.local.example` is committed as a template
- ✅ Never commit actual credentials to git

## Example `.env.local` File

```env
# Backend API URL (Required for FastAPI backend)
NEXT_PUBLIC_API_URL=http://localhost:8000

# Supabase Configuration (Optional)
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.example
```

## Troubleshooting

### "Missing Supabase environment variables" Error

**If you see this error:**
- The error has been fixed - Supabase is now optional
- You can run the app without Supabase credentials
- Only add them if you plan to use Supabase

### Frontend Can't Connect to Backend

Make sure `NEXT_PUBLIC_API_URL` is set:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

And that your FastAPI backend is running on port 8000.

