# Retro POS System - Backend API

FastAPI backend for the Retro POS System.

## Quick Start

### Option 1: Using Setup Scripts (Recommended)

**Windows:**
```powershell
cd backend
.\start-backend.ps1
```

**Mac/Linux:**
```bash
cd backend
chmod +x start-backend.sh
./start-backend.sh
```

### Option 2: Manual Setup

1. **Create and activate virtual environment:**
   ```bash
   cd backend
   
   # Create virtual environment
   python -m venv venv  # Windows
   # or
   python3 -m venv venv  # Mac/Linux
   
   # Activate virtual environment
   .\venv\Scripts\Activate.ps1  # Windows PowerShell
   # or
   source venv/bin/activate  # Mac/Linux
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables (optional):**
   ```bash
   # Copy example file
   copy .env.example .env  # Windows
   # or
   cp .env.example .env  # Mac/Linux
   
   # Edit .env with your settings (optional - defaults work fine)
   ```

4. **Run the server:**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   # or
   python main.py
   ```

The API will be available at `http://localhost:8000`

**For detailed setup instructions, see [SETUP.md](./SETUP.md)**

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{barcode}` - Get product by barcode
- `POST /api/products` - Create new product
- `PUT /api/products` - Update existing product
- `DELETE /api/products/{barcode}` - Delete product

### Sales
- `GET /api/sales` - Get all sales (with optional `startDate` and `endDate` query parameters)
- `GET /api/sales/{id}` - Get sale by ID
- `POST /api/sales` - Create new sale (automatically updates product stock)

### Inventory
- `GET /api/inventory` - Get inventory statistics and product list
- `PUT /api/inventory` - Adjust product stock (body: `{barcode, type, quantity}`)
- `GET /api/inventory/export` - Export inventory to CSV

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics

## Data Storage

The backend uses JSON files for data persistence:
- `../data/products.json` - Product catalog
- `../data/sales.json` - Sales transaction history

The data directory is automatically created if it doesn't exist.

## CORS

CORS is enabled for `http://localhost:3000` to allow requests from the Next.js frontend.

