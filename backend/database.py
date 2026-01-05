"""
Database operations layer.

This module provides business logic and data transformation between
API models and database operations. It uses backend/db/supabase.py
for actual database access.
"""
from typing import List, Optional, Dict, Any
from datetime import datetime
from models import Product, Sale, CartItem
from db.supabase import (
    get_products as db_get_products,
    get_product_by_barcode as db_get_product_by_barcode,
    create_product as db_create_product,
    update_product as db_update_product,
    delete_product as db_delete_product,
    update_product_stock as db_update_product_stock_direct,
    get_all_sales as db_get_all_sales,
    get_sale_by_id as db_get_sale_by_id,
    create_sale as db_create_sale,
    decrement_inventory as db_decrement_inventory,
    get_dashboard_stats as db_get_dashboard_stats,
)

# Helper to convert database rows to Pydantic models
def _row_to_product(row: Dict[str, Any]) -> Product:
    """Convert database row to Product model."""
    return Product(
        barcode=row["barcode"],
        name=row["name"],
        category=row["category"],
        price=float(row["price"]),
        cost=float(row.get("cost", 0)),
        stock=int(row.get("stock", 0))
    )

def _row_to_sale(row: Dict[str, Any]) -> Sale:
    """Convert database row to Sale model with items."""
    # Ensure items are converted to CartItem models
    items = []
    for item in row.get("items", []):
        items.append(CartItem(
            barcode=item["barcode"],
            name=item.get("name", ""),
            category=item.get("category", ""),
            price=float(item["price"]),
            cost=float(item.get("cost", 0)),
            stock=int(item.get("stock", 0)),  # Current stock, not historical
            quantity=int(item["quantity"])
        ))
    
    return Sale(
        id=row["id"],
        date=row["date"],
        items=items,
        subtotal=float(row["subtotal"]),
        tax=float(row["tax"]),
        total=float(row["total"]),
        paymentMethod=row["payment_method"]
    )

# ==================== PRODUCT OPERATIONS ====================

def get_all_products() -> List[Product]:
    """Get all products."""
    rows = db_get_products()
    return [_row_to_product(row) for row in rows]

def get_product_by_barcode(barcode: str) -> Optional[Product]:
    """Get a product by barcode."""
    row = db_get_product_by_barcode(barcode)
    if row:
        return _row_to_product(row)
    return None

def create_product(product: Product) -> Product:
    """Create a new product."""
    product_data = {
        "barcode": product.barcode,
        "name": product.name,
        "category": product.category,
        "price": product.price,
        "cost": product.cost,
        "stock": product.stock
    }
    row = db_create_product(product_data)
    return _row_to_product(row)

def update_product(updated_product: Product) -> Product:
    """Update an existing product."""
    product_data = {
        "name": updated_product.name,
        "category": updated_product.category,
        "price": updated_product.price,
        "cost": updated_product.cost,
        "stock": updated_product.stock
    }
    row = db_update_product(updated_product.barcode, product_data)
    return _row_to_product(row)

def delete_product(barcode: str) -> bool:
    """Delete a product by barcode."""
    return db_delete_product(barcode)

def update_product_stock(barcode: str, new_stock: int) -> Product:
    """Update product stock level (allows negative values)."""
    row = db_update_product_stock_direct(barcode, new_stock)
    return _row_to_product(row)

# ==================== SALE OPERATIONS ====================

def get_all_sales(start_date: Optional[str] = None, end_date: Optional[str] = None) -> List[Sale]:
    """Get all sales, optionally filtered by date range."""
    rows = db_get_all_sales(start_date=start_date, end_date=end_date)
    return [_row_to_sale(row) for row in rows]

def get_sale_by_id(sale_id: str) -> Optional[Sale]:
    """Get a sale by ID."""
    row = db_get_sale_by_id(sale_id)
    if row:
        return _row_to_sale(row)
    return None

def create_sale(sale: Sale) -> Sale:
    """
    Create a new sale and update product stock levels.
    Uses normalized schema: sales + sale_items tables.
    """
    # Prepare sale data (without items, as they go in sale_items table)
    sale_data = {
        "id": sale.id,
        "date": sale.date,
        "subtotal": sale.subtotal,
        "tax": sale.tax,
        "total": sale.total,
        "payment_method": sale.paymentMethod,
        "customer_id": None  # Will be added in Phase 2
    }
    
    # Prepare sale items data
    sale_items = []
    for item in sale.items:
        sale_items.append({
            "sale_id": sale.id,
            "barcode": item.barcode,
            "quantity": item.quantity,
            "price": item.price,
            "cost": item.cost
        })
    
    # Create sale and items in database
    row = db_create_sale(sale_data, sale_items)
    
    # Update product stock levels for each item
    for item in sale.items:
        try:
            # Decrement inventory (allows negative values)
            db_decrement_inventory(item.barcode, item.quantity)
        except Exception as e:
            print(f"Error updating stock for product {item.barcode}: {e}")
            # Continue with other products even if one fails
    
    return _row_to_sale(row)