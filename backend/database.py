from typing import List, Optional, Dict, Any
from datetime import datetime
from supabase import create_client, Client
from dotenv import load_dotenv
import os
from models import Product, Sale, CartItem

# Load environment variables
load_dotenv()

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Supabase URL and Key must be set in environment variables")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Helper to convert Supabase rows to Pydantic models
def _row_to_product(row: Dict[str, Any]) -> Product:
    return Product(**row)

def _row_to_sale(row: Dict[str, Any]) -> Sale:
    # Ensure items are converted to CartItem models
    row['items'] = [CartItem(**item) for item in row['items']]
    return Sale(**row)

# Product operations
def get_all_products() -> List[Product]:
    """Get all products from Supabase."""
    response = supabase.from_("products").select("*").execute()
    if response.data:
        return [_row_to_product(row) for row in response.data]
    return []

def get_product_by_barcode(barcode: str) -> Optional[Product]:
    """Get a product by barcode from Supabase."""
    response = supabase.from_("products").select("*").eq("barcode", barcode).single().execute()
    if response.data:
        return _row_to_product(response.data)
    return None

def create_product(product: Product) -> Product:
    """Create a new product in Supabase."""
    response = supabase.from_("products").insert(product.model_dump()).execute()
    if response.data:
        return _row_to_product(response.data[0])
    raise ValueError("Failed to create product")

def update_product(updated_product: Product) -> Product:
    """Update an existing product in Supabase."""
    response = supabase.from_("products").update(updated_product.model_dump()).eq("barcode", updated_product.barcode).execute()
    if response.data:
        return _row_to_product(response.data[0])
    raise ValueError("Failed to update product or product not found")

def delete_product(barcode: str) -> bool:
    """Delete a product by barcode from Supabase."""
    response = supabase.from_("products").delete().eq("barcode", barcode).execute()
    if response.data:
        return True
    raise ValueError("Failed to delete product or product not found")

def update_product_stock(barcode: str, new_stock: int) -> Product:
    """Update product stock level in Supabase."""
    response = supabase.from_("products").update({"stock": max(0, new_stock)}).eq("barcode", barcode).execute()
    if response.data:
        return _row_to_product(response.data[0])
    raise ValueError("Failed to update stock or product not found")

# Sale operations
def get_all_sales(start_date: Optional[str] = None, end_date: Optional[str] = None) -> List[Sale]:
    """Get all sales from Supabase, optionally filtered by date range."""
    query = supabase.from_("sales").select("*")
    if start_date:
        query = query.gte("date", start_date)
    if end_date:
        query = query.lte("date", end_date)
    response = query.execute()
    if response.data:
        return [_row_to_sale(row) for row in response.data]
    return []

def get_sale_by_id(sale_id: str) -> Optional[Sale]:
    """Get a sale by ID from Supabase."""
    response = supabase.from_("sales").select("*").eq("id", sale_id).single().execute()
    if response.data:
        return _row_to_sale(response.data)
    return None

def create_sale(sale: Sale) -> Sale:
    """Create a new sale in Supabase and update product stock levels."""
    # First, create the sale
    response = supabase.from_("sales").insert(sale.model_dump()).execute()
    if not response.data:
        raise ValueError("Failed to create sale")
    
    new_sale = _row_to_sale(response.data[0])

    # Then, update product stock levels for each item in the sale
    for item in sale.items:
        try:
            # Fetch the current product to get its stock
            product = get_product_by_barcode(item.barcode)
            if product:
                new_stock = max(0, product.stock - item.quantity)
                update_product_stock(item.barcode, new_stock)
        except Exception as e:
            print(f"Error updating stock for product {item.barcode}: {e}")
            # Continue with other products even if one fails
    
    return new_sale