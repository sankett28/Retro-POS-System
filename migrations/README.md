# Database Migrations

This folder contains Supabase SQL migrations for the Retro POS System.

## Migration Files

1. **001_create_products_table.sql** - Creates the products table with indexes and triggers
2. **002_create_sales_table.sql** - Creates the sales/transactions table
3. **003_create_sale_items_table.sql** - Creates the sale_items junction table for sales and products
4. **004_create_views_and_functions.sql** - Creates useful views and functions for reporting

## How to Run Migrations

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **SQL Editor**
4. Run each migration file **in order** (001 → 002 → 003 → 004)
5. Copy and paste the contents of each SQL file into the editor
6. Click **Run** to execute

### Option 2: Using Supabase CLI

If you have Supabase CLI installed:

```bash
supabase db push
```

Or run migrations individually:

```bash
supabase migration up
```

## Migration Order

**IMPORTANT:** Run migrations in this exact order:

1. `001_create_products_table.sql` - Must run first (products table is referenced by sale_items)
2. `002_create_sales_table.sql` - Must run second (sales table is referenced by sale_items)
3. `003_create_sale_items_table.sql` - Must run third (depends on both products and sales)
4. `004_create_views_and_functions.sql` - Must run last (depends on all tables)

## Verification

After running all migrations, verify the setup:

1. Go to **Table Editor** in Supabase Dashboard
2. You should see three tables:
   - `products`
   - `sales`
   - `sale_items`
3. Go to **Database** → **Functions** to see the `get_dashboard_stats` function
4. Go to **Database** → **Views** to see `low_stock_products` and `sales_summary`

## Troubleshooting

If you encounter errors:

- **"relation already exists"** - The table/view already exists. You can either drop it first or skip that migration.
- **"permission denied"** - Make sure you're using the correct database user with proper permissions.
- **"foreign key constraint"** - Make sure you've run migrations in the correct order.

