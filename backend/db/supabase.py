"""
Supabase database client and helper functions.

This module provides database access functions without business logic.
All business logic should remain in the API routes.
"""
from typing import List, Optional, Dict, Any
from supabase import create_client, Client
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Supabase URL and Key must be set in environment variables")

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


# ==================== PRODUCT OPERATIONS ====================

def get_products() -> List[Dict[str, Any]]:
    """Get all products from the database."""
    response = supabase.from_("products").select("*").execute()
    return response.data if response.data else []


def get_product_by_barcode(barcode: str) -> Optional[Dict[str, Any]]:
    """Get a product by barcode."""
    response = supabase.from_("products").select("*").eq("barcode", barcode).maybe_single().execute()
    return response.data if response.data else None


def create_product(product_data: Dict[str, Any]) -> Dict[str, Any]:
    """Create a new product."""
    response = supabase.from_("products").insert(product_data).execute()
    if response.data:
        return response.data[0]
    raise ValueError("Failed to create product")


def update_product(barcode: str, product_data: Dict[str, Any]) -> Dict[str, Any]:
    """Update an existing product."""
    response = supabase.from_("products").update(product_data).eq("barcode", barcode).execute()
    if response.data:
        return response.data[0]
    raise ValueError("Failed to update product or product not found")


def delete_product(barcode: str) -> bool:
    """Delete a product by barcode."""
    response = supabase.from_("products").delete().eq("barcode", barcode).execute()
    return len(response.data) > 0 if response.data else False


def decrement_inventory(barcode: str, quantity: int) -> Dict[str, Any]:
    """
    Decrement product stock by quantity.
    Allows negative values as per requirements.
    """
    # Get current product
    product = get_product_by_barcode(barcode)
    if not product:
        raise ValueError("Product not found")
    
    new_stock = product.get("stock", 0) - quantity
    
    # Update stock (allowing negative values)
    response = supabase.from_("products").update({"stock": new_stock}).eq("barcode", barcode).execute()
    if response.data:
        return response.data[0]
    raise ValueError("Failed to update inventory")


def update_product_stock(barcode: str, new_stock: int) -> Dict[str, Any]:
    """
    Directly set product stock to a specific value.
    Allows negative values as per requirements.
    """
    response = supabase.from_("products").update({"stock": new_stock}).eq("barcode", barcode).execute()
    if response.data:
        return response.data[0]
    raise ValueError("Failed to update stock or product not found")


# ==================== SALE OPERATIONS ====================

def create_sale(sale_data: Dict[str, Any], sale_items: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Create a sale and its items in a transaction-like manner.
    
    Args:
        sale_data: Sale record data (id, date, subtotal, tax, total, payment_method, customer_id)
        sale_items: List of sale item records (sale_id, barcode, quantity, price, cost)
    
    Returns:
        Created sale record with items
    """
    # Insert sale
    sale_response = supabase.from_("sales").insert(sale_data).execute()
    if not sale_response.data:
        raise ValueError("Failed to create sale")
    
    created_sale = sale_response.data[0]
    
    # Insert sale items
    if sale_items:
        items_response = supabase.from_("sale_items").insert(sale_items).execute()
        if not items_response.data:
            # Note: In a real transaction, we'd rollback the sale here
            # Supabase doesn't support transactions in the Python client,
            # so we rely on foreign key constraints
            raise ValueError("Failed to create sale items")
    
    # Fetch complete sale with items
    return get_sale_by_id(created_sale["id"])


def get_sale_by_id(sale_id: str) -> Optional[Dict[str, Any]]:
    """Get a sale by ID with its items."""
    # Fetch sale and its associated sale_items in a single query
    response = supabase.from_("sales").select("*, items:sale_items(*)").eq("id", sale_id).maybe_single().execute()
    if not response.data:
        return None
    
    sale = response.data
    
    # For each item, fetch product details to get name, category, and current stock
    for item_data in sale.get("items", []) :
        product = get_product_by_barcode(item_data["barcode"])
        if product:
            item_data["name"] = product.get("name", "")
            item_data["category"] = product.get("category", "")
            item_data["stock"] = product.get("stock", 0) # Current stock, not historical
        else:
            # Handle case where product might have been deleted
            item_data["name"] = "Unknown Product"
            item_data["category"] = "Unknown"
            item_data["stock"] = 0
    
    return sale


def get_all_sales(start_date: Optional[str] = None, end_date: Optional[str] = None) -> List[Dict[str, Any]]:
    """Get all sales, optionally filtered by date range."""
    # Fetch sales and their associated sale_items in a single query
    query = supabase.from_("sales").select("*, items:sale_items(*)").order("date", desc=True)
    
    if start_date:
        query = query.gte("date", start_date)
    if end_date:
        query = query.lte("date", end_date)
    
    response = query.execute()
    sales_data = response.data if response.data else []
    
    # For each sale, and for each item within that sale, fetch product details
    for sale in sales_data:
        for item_data in sale.get("items", []) :
            product = get_product_by_barcode(item_data["barcode"])
            if product:
                item_data["name"] = product.get("name", "")
                item_data["category"] = product.get("category", "")
                item_data["stock"] = product.get("stock", 0) # Current stock, not historical
            else:
                # Handle case where product might have been deleted
                item_data["name"] = "Unknown Product"
                item_data["category"] = "Unknown"
                item_data["stock"] = 0

    return sales_data


# ==================== DASHBOARD OPERATIONS ====================

def get_dashboard_stats() -> Dict[str, Any]:
    """
    Get dashboard statistics.
    Uses the database function if available, otherwise calculates manually.
    """
    try:
        # Try to use the database function
        response = supabase.rpc("get_dashboard_stats").execute()
        if response.data:
            stats = response.data[0] if isinstance(response.data, list) else response.data
            return {
                "revenue": float(stats.get("revenue", 0)),
                "profit": float(stats.get("profit", 0)),
                "taxes": float(stats.get("taxes", 0)),
                "transactions": int(stats.get("transactions", 0)),
                "products": int(stats.get("products", 0)),
                "inventoryValue": float(stats.get("inventory_value", 0)),
                "lowStock": int(stats.get("low_stock", 0)),
                "avgSale": float(stats.get("avg_sale", 0))
            }
    except Exception:
        # Fallback to manual calculation if function doesn't exist
        pass
    
    # Manual calculation fallback
    products = get_products()
    sales = get_all_sales()
    
    from datetime import datetime as dt
    today = dt.now().date().isoformat()
    today_sales = [s for s in sales if s.get("date", "").split("T")[0] == today]
    
    total_revenue = sum(float(s.get("total", 0)) for s in sales)
    total_taxes = sum(float(s.get("tax", 0)) for s in sales)
    total_transactions = len(today_sales)
    
    # Calculate profit
    total_profit = 0
    for sale in sales:
        revenue = float(sale.get("total", 0))
        items = sale.get("items", [])
        cost = sum(float(item.get("cost", 0)) * int(item.get("quantity", 0)) for item in items)
        total_profit += revenue - cost
    
    # Inventory stats
    total_products = len(products)
    inventory_value = sum(float(p.get("price", 0)) * int(p.get("stock", 0)) for p in products)
    low_stock_count = len([p for p in products if int(p.get("stock", 0)) < 10])
    avg_sale = total_revenue / len(sales) if sales else 0
    
    return {
        "revenue": total_revenue,
        "profit": total_profit,
        "taxes": total_taxes,
        "transactions": total_transactions,
        "products": total_products,
        "inventoryValue": inventory_value,
        "lowStock": low_stock_count,
        "avgSale": avg_sale
    }

