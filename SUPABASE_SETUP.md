# Supabase Integration Complete ✅

Your Retro POS System has been successfully configured to use Supabase as the backend database!

## What Was Done

### 1. ✅ Database Migrations Created
- Created `migrations/` folder with 4 SQL migration files:
  - `001_create_products_table.sql` - Products table with indexes and triggers
  - `002_create_sales_table.sql` - Sales/transactions table
  - `003_create_sale_items_table.sql` - Junction table for sale items
  - `004_create_views_and_functions.sql` - Views and helper functions

### 2. ✅ Supabase Client Setup
- Installed `@supabase/supabase-js` package
- Created `src/lib/supabase/client.ts` for database connection

### 3. ✅ API Routes Updated
All API routes have been migrated from file-based storage to Supabase:
- ✅ `/api/products` - Products CRUD operations
- ✅ `/api/products/[barcode]` - Get/Delete product by barcode
- ✅ `/api/sales` - Create and retrieve sales
- ✅ `/api/sales/[id]` - Get sale by ID
- ✅ `/api/inventory` - Inventory stats and stock adjustments
- ✅ `/api/inventory/export` - CSV export functionality
- ✅ `/api/dashboard` - Dashboard statistics

## Next Steps

### Step 1: Set Up Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project (or use existing)
3. Wait for the project to be fully provisioned

### Step 2: Run Database Migrations

1. In Supabase Dashboard, go to **SQL Editor**
2. Run each migration file **in order**:
   - Copy contents of `migrations/001_create_products_table.sql` → Run
   - Copy contents of `migrations/002_create_sales_table.sql` → Run
   - Copy contents of `migrations/003_create_sale_items_table.sql` → Run
   - Copy contents of `migrations/004_create_views_and_functions.sql` → Run

**Important:** Run them in this exact order!

### Step 3: Configure Environment Variables

1. Create a `.env.local` file in the project root
2. Get your Supabase credentials:
   - Go to **Settings** → **API** in your Supabase project
   - Copy **Project URL** and **anon/public key**
3. Add to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

### Step 4: Test the Connection

1. Start your development server:
   ```bash
   npm run dev
   ```
2. The app should now connect to Supabase instead of JSON files
3. Test creating a product, making a sale, etc.

## Database Schema

### Tables

**products**
- `barcode` (TEXT, PRIMARY KEY)
- `name` (TEXT)
- `category` (TEXT)
- `price` (DECIMAL)
- `cost` (DECIMAL)
- `stock` (INTEGER)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**sales**
- `id` (TEXT, PRIMARY KEY)
- `date` (TIMESTAMP)
- `subtotal` (DECIMAL)
- `tax` (DECIMAL)
- `total` (DECIMAL)
- `payment_method` (TEXT: 'cash' | 'card' | 'digital')
- `created_at` (TIMESTAMP)

**sale_items**
- `id` (SERIAL, PRIMARY KEY)
- `sale_id` (TEXT, FOREIGN KEY → sales.id)
- `barcode` (TEXT, FOREIGN KEY → products.barcode)
- `quantity` (INTEGER)
- `price` (DECIMAL)
- `cost` (DECIMAL)
- `created_at` (TIMESTAMP)

### Views & Functions

- `low_stock_products` - Products with stock < 20
- `sales_summary` - Sales with item counts
- `get_dashboard_stats()` - Function to calculate dashboard statistics

## Migration from JSON Files

If you have existing data in `data/products.json` and `data/sales.json`, you'll need to:

1. **Import Products:**
   - Use Supabase Dashboard → Table Editor → Import data
   - Or create a script to read JSON and insert into Supabase

2. **Import Sales:**
   - Sales will need to be inserted into both `sales` and `sale_items` tables
   - This is more complex and may require a migration script

## Troubleshooting

### "Missing Supabase environment variables"
- Make sure `.env.local` exists and has correct values
- Restart your dev server after adding env variables

### "Failed to fetch products"
- Check that migrations ran successfully
- Verify RLS policies allow access (migrations set them to allow all)

### "Product not found" errors
- Make sure you've run all migrations
- Check that products table exists in Supabase Dashboard

## Security Notes

⚠️ **Important:** The current RLS policies allow all operations. For production:
- Implement proper authentication
- Update RLS policies to restrict access based on user roles
- Consider using service role key for server-side operations

## Support

If you encounter issues:
1. Check Supabase Dashboard → Logs for database errors
2. Check browser console for client-side errors
3. Verify all migrations ran successfully
4. Ensure environment variables are set correctly

