-- Create view for low stock products (threshold: 20)
CREATE OR REPLACE VIEW low_stock_products AS
SELECT 
  barcode,
  name,
  category,
  stock,
  price,
  cost
FROM products
WHERE stock < 20;

-- Create view for sales with item counts
CREATE OR REPLACE VIEW sales_summary AS
SELECT 
  s.id,
  s.date,
  s.subtotal,
  s.tax,
  s.total,
  s.payment_method,
  COUNT(si.id) as item_count,
  SUM(si.quantity) as total_items
FROM sales s
LEFT JOIN sale_items si ON s.id = si.sale_id
GROUP BY s.id, s.date, s.subtotal, s.tax, s.total, s.payment_method;

-- Create function to get dashboard stats
CREATE OR REPLACE FUNCTION get_dashboard_stats(
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS TABLE (
  revenue DECIMAL,
  profit DECIMAL,
  taxes DECIMAL,
  transactions BIGINT,
  products BIGINT,
  inventory_value DECIMAL,
  low_stock BIGINT,
  avg_sale DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(s.total), 0)::DECIMAL as revenue,
    COALESCE(SUM(s.total - (SELECT SUM(si.quantity * si.cost) FROM sale_items si WHERE si.sale_id = s.id)), 0)::DECIMAL as profit,
    COALESCE(SUM(s.tax), 0)::DECIMAL as taxes,
    COUNT(s.id)::BIGINT as transactions,
    COUNT(DISTINCT p.barcode)::BIGINT as products,
    COALESCE(SUM(p.stock * p.cost), 0)::DECIMAL as inventory_value,
    COUNT(DISTINCT CASE WHEN p.stock < 20 THEN p.barcode END)::BIGINT as low_stock,
    COALESCE(AVG(s.total), 0)::DECIMAL as avg_sale
  FROM sales s
  CROSS JOIN products p
  WHERE (start_date IS NULL OR s.date >= start_date)
    AND (end_date IS NULL OR s.date <= end_date);
END;
$$ LANGUAGE plpgsql;

