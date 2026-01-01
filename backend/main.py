from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from typing import Optional, List
import csv
from io import StringIO
from datetime import datetime
import os
from dotenv import load_dotenv

from models import (
    Product,
    Sale,
    DashboardStats,
    StockAdjustment,
    InventoryResponse,
    CartItem,
)
from database import (
    get_all_products,
    get_product_by_barcode,
    create_product,
    update_product,
    delete_product,
    get_all_sales,
    get_sale_by_id,
    create_sale,
    update_product_stock,
)

# Load environment variables
load_dotenv()

# Get configuration from environment variables
API_TITLE = os.getenv("API_TITLE", "Retro POS System API")
API_VERSION = os.getenv("API_VERSION", "1.0.0")
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8000"))

app = FastAPI(title=API_TITLE, version=API_VERSION)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Helper function to calculate dashboard stats
def calculate_dashboard_stats(products: List[Product], sales: List[Sale]) -> DashboardStats:
    """Calculate dashboard statistics."""
    from datetime import datetime as dt
    
    today = dt.now().date().isoformat()
    today_sales = [s for s in sales if s.date.split('T')[0] == today]
    
    # Calculate totals
    total_revenue = sum(sale.total for sale in sales)
    total_taxes = sum(sale.tax for sale in sales)
    total_transactions = len(today_sales)
    
    # Calculate profit
    total_profit = 0
    for sale in sales:
        revenue = sale.total
        cost = sum(
            item.cost * item.quantity
            for item in sale.items
        )
        total_profit += revenue - cost
    
    # Inventory stats
    total_products = len(products)
    inventory_value = sum(p.price * p.stock for p in products)
    low_stock_count = len([p for p in products if p.stock < 10])
    avg_sale = total_revenue / len(sales) if sales else 0
    
    return DashboardStats(
        revenue=total_revenue,
        profit=total_profit,
        taxes=total_taxes,
        transactions=total_transactions,
        products=total_products,
        inventoryValue=inventory_value,
        lowStock=low_stock_count,
        avgSale=avg_sale,
    )


# ==================== PRODUCT ENDPOINTS ====================

@app.get("/api/products", response_model=List[Product])
async def get_products():
    """Get all products."""
    try:
        products = get_all_products()
        # Sort by name
        products.sort(key=lambda p: p.name)
        return products
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch products: {str(e)}")


@app.get("/api/products/{barcode}", response_model=Product)
async def get_product(barcode: str):
    """Get a product by barcode."""
    try:
        product = get_product_by_barcode(barcode)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return product
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch product: {str(e)}")


@app.post("/api/products", response_model=Product, status_code=201)
async def create_product_endpoint(product: Product):
    """Create a new product."""
    try:
        return create_product(product)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create product: {str(e)}")


@app.put("/api/products", response_model=Product)
async def update_product_endpoint(product: Product):
    """Update an existing product."""
    try:
        return update_product(product)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update product: {str(e)}")


@app.delete("/api/products/{barcode}")
async def delete_product_endpoint(barcode: str):
    """Delete a product by barcode."""
    try:
        delete_product(barcode)
        return {"success": True}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete product: {str(e)}")


# ==================== SALES ENDPOINTS ====================

@app.get("/api/sales", response_model=List[Sale])
async def get_sales(
    startDate: Optional[str] = Query(None, alias="startDate"),
    endDate: Optional[str] = Query(None, alias="endDate"),
):
    """Get all sales, optionally filtered by date range."""
    try:
        sales = get_all_sales(start_date=startDate, end_date=endDate)
        # Sort by date descending
        sales.sort(key=lambda s: s.date, reverse=True)
        return sales
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch sales: {str(e)}")


@app.get("/api/sales/{sale_id}", response_model=Sale)
async def get_sale(sale_id: str):
    """Get a sale by ID."""
    try:
        sale = get_sale_by_id(sale_id)
        if not sale:
            raise HTTPException(status_code=404, detail="Sale not found")
        return sale
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch sale: {str(e)}")


@app.post("/api/sales", response_model=Sale, status_code=201)
async def create_sale_endpoint(sale: Sale):
    """Create a new sale (automatically updates product stock)."""
    try:
        return create_sale(sale)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create sale: {str(e)}")


# ==================== INVENTORY ENDPOINTS ====================

@app.get("/api/inventory", response_model=InventoryResponse)
async def get_inventory():
    """Get inventory statistics and product list."""
    try:
        products = get_all_products()
        products.sort(key=lambda p: p.name)
        
        total_products = len(products)
        total_value = sum(p.stock * p.cost for p in products)
        low_stock = len([p for p in products if p.stock < 20])
        total_units = sum(p.stock for p in products)
        
        return InventoryResponse(
            totalProducts=total_products,
            totalValue=total_value,
            lowStock=low_stock,
            totalUnits=total_units,
            products=products,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch inventory: {str(e)}")


@app.put("/api/inventory", response_model=Product)
async def adjust_stock(adjustment: StockAdjustment):
    """Adjust product stock (add, remove, or set)."""
    try:
        product = get_product_by_barcode(adjustment.barcode)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Calculate new stock
        if adjustment.type == 'add':
            new_stock = product.stock + adjustment.quantity
        elif adjustment.type == 'remove':
            new_stock = max(0, product.stock - adjustment.quantity)
        elif adjustment.type == 'set':
            new_stock = adjustment.quantity
        else:
            raise HTTPException(status_code=400, detail="Invalid adjustment type")
        
        return update_product_stock(adjustment.barcode, new_stock)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update stock: {str(e)}")


@app.get("/api/inventory/export")
async def export_inventory():
    """Export inventory to CSV."""
    try:
        products = get_all_products()
        products.sort(key=lambda p: p.name)
        
        # Create CSV content
        output = StringIO()
        writer = csv.writer(output)
        
        # Write header
        writer.writerow(['Barcode', 'Name', 'Category', 'Price', 'Cost', 'Stock', 'Value'])
        
        # Write rows
        for p in products:
            writer.writerow([
                p.barcode,
                p.name,
                p.category,
                f"{p.price:.2f}",
                f"{p.cost:.2f}",
                p.stock,
                f"{(p.price * p.stock):.2f}",
            ])
        
        csv_content = output.getvalue()
        output.close()
        
        # Generate filename with today's date
        today = datetime.now().date().isoformat()
        filename = f"inventory_{today}.csv"
        
        return Response(
            content=csv_content,
            media_type="text/csv",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'},
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to export inventory: {str(e)}")


# ==================== DASHBOARD ENDPOINTS ====================

@app.get("/api/dashboard", response_model=DashboardStats)
async def get_dashboard():
    """Get dashboard statistics."""
    try:
        products = get_all_products()
        sales = get_all_sales()
        
        stats = calculate_dashboard_stats(products, sales)
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch dashboard stats: {str(e)}")


# Health check endpoint
@app.get("/")
async def root():
    """Health check endpoint."""
    return {"message": "Retro POS System API", "status": "running"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=HOST, port=PORT)

