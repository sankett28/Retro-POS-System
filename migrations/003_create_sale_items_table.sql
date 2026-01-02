-- Create sale_items table (junction table for sales and products)
CREATE TABLE IF NOT EXISTS sale_items (
  id SERIAL PRIMARY KEY,
  sale_id TEXT NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
  barcode TEXT NOT NULL REFERENCES products(barcode) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  cost DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (cost >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on sale_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_sale_items_sale_id ON sale_items(sale_id);

-- Create index on barcode for product history queries
CREATE INDEX IF NOT EXISTS idx_sale_items_barcode ON sale_items(barcode);

-- Enable Row Level Security (RLS)
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust based on your auth needs)
CREATE POLICY "Allow all operations on sale_items" ON sale_items
  FOR ALL
  USING (true)
  WITH CHECK (true);

