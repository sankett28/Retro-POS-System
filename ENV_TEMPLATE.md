# Environment Variables Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
# Get these values from your Supabase project settings: https://app.supabase.com/project/_/settings/api
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## How to get your Supabase credentials:

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project (or create a new one)
3. Go to Settings → API
4. Copy the following:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Running Migrations:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run each migration file in order:
   - `migrations/001_create_products_table.sql`
   - `migrations/002_create_sales_table.sql`
   - `migrations/003_create_sale_items_table.sql`
   - `migrations/004_create_views_and_functions.sql`

