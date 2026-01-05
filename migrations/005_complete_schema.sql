-- ============================================
-- COMPLETE SCHEMA FOR MARKETING-FIRST POS
-- ============================================
-- This migration adds the missing tables and updates existing ones
-- for the marketing-first POS platform.
-- Run this after the existing migrations (001-004).

-- ==================== CUSTOMERS TABLE ====================
-- Customers are optional but enable marketing features
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT UNIQUE,
  name TEXT,
  consent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index on phone for fast lookups
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);

-- Index on consent for marketing queries
CREATE INDEX IF NOT EXISTS idx_customers_consent ON customers(consent);

-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Policy to allow all operations (adjust based on your auth needs)
CREATE POLICY "Allow all operations on customers" ON customers
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ==================== UPDATE SALES TABLE ====================
-- Add customer_id reference to sales (nullable for backward compatibility)
ALTER TABLE sales 
  ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES customers(id) ON DELETE SET NULL;

-- Index on customer_id for marketing queries
CREATE INDEX IF NOT EXISTS idx_sales_customer_id ON sales(customer_id);

-- ==================== INVENTORY TABLE ====================
-- Separate inventory tracking table (allows negative values for backorders)
-- Note: Current implementation uses stock in products table, but this provides
-- a separate audit trail if needed in the future
CREATE TABLE IF NOT EXISTS inventory (
  id SERIAL PRIMARY KEY,
  barcode TEXT NOT NULL REFERENCES products(barcode) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,  -- Can be negative
  adjustment_type TEXT NOT NULL CHECK (adjustment_type IN ('sale', 'purchase', 'adjustment', 'return')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index on barcode for product history
CREATE INDEX IF NOT EXISTS idx_inventory_barcode ON inventory(barcode);

-- Index on created_at for time-based queries
CREATE INDEX IF NOT EXISTS idx_inventory_created_at ON inventory(created_at);

-- Enable RLS
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- Policy to allow all operations
CREATE POLICY "Allow all operations on inventory" ON inventory
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ==================== CAMPAIGNS TABLE ====================
-- Marketing campaigns for products
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL REFERENCES products(barcode) ON DELETE CASCADE,
  discount DECIMAL(5, 2) NOT NULL CHECK (discount >= 0 AND discount <= 100),
  generated_text TEXT,
  headline TEXT,
  description TEXT,
  seo_text TEXT,
  audience_type TEXT NOT NULL CHECK (audience_type IN ('all', 'recent', 'product_buyers')),
  whatsapp_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index on product_id for product-based queries
CREATE INDEX IF NOT EXISTS idx_campaigns_product_id ON campaigns(product_id);

-- Index on created_at for recent campaigns
CREATE INDEX IF NOT EXISTS idx_campaigns_created_at ON campaigns(created_at);

-- Enable RLS
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

-- Policy to allow all operations
CREATE POLICY "Allow all operations on campaigns" ON campaigns
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ==================== UPDATE PRODUCTS TABLE ====================
-- Ensure products table allows negative stock (for backorders)
-- Remove the CHECK constraint on stock if it exists and add a new one that allows negatives
DO $$
BEGIN
  -- Drop existing stock constraint if it exists
  ALTER TABLE products DROP CONSTRAINT IF EXISTS products_stock_check;
  
  -- Add new constraint that allows negative values
  ALTER TABLE products ADD CONSTRAINT products_stock_check 
    CHECK (stock IS NOT NULL);
END $$;

-- ==================== TRIGGERS ====================
-- Update trigger for customers
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Update trigger for campaigns
CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

