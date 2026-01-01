from pydantic import BaseModel, Field
from typing import Literal, List
from datetime import datetime


class Product(BaseModel):
    barcode: str
    name: str
    category: str
    price: float = Field(gt=0, description="Price must be greater than 0")
    cost: float = Field(ge=0, description="Cost must be non-negative")
    stock: int = Field(ge=0, description="Stock must be non-negative")


class CartItem(Product):
    quantity: int = Field(gt=0, description="Quantity must be greater than 0")


class Sale(BaseModel):
    id: str
    date: str  # ISO date string
    items: List[CartItem]
    subtotal: float
    tax: float
    total: float
    paymentMethod: Literal['cash', 'card', 'digital']


class DashboardStats(BaseModel):
    revenue: float
    profit: float
    taxes: float
    transactions: int
    products: int
    inventoryValue: float
    lowStock: int
    avgSale: float


class StockAdjustment(BaseModel):
    barcode: str
    type: Literal['add', 'remove', 'set']
    quantity: int = Field(ge=0, description="Quantity must be non-negative")


class InventoryResponse(BaseModel):
    totalProducts: int
    totalValue: float
    lowStock: int
    totalUnits: int
    products: List[Product]

