-- Create sales table
CREATE TABLE IF NOT EXISTS sales (
  id TEXT PRIMARY KEY,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
  tax DECIMAL(10, 2) NOT NULL CHECK (tax >= 0),
  total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'card', 'digital')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on date for faster date range queries
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(date);

-- Create index on payment_method for filtering
CREATE INDEX IF NOT EXISTS idx_sales_payment_method ON sales(payment_method);

-- Enable Row Level Security (RLS)
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust based on your auth needs)
CREATE POLICY "Allow all operations on sales" ON sales
  FOR ALL
  USING (true)
  WITH CHECK (true);

