# Migration Guide: Next.js Monolith to Hybrid Stack

This document outlines the migration from a Next.js monolith to a hybrid stack with Next.js frontend and Python FastAPI backend.

## What Changed

### Backend (New)
- **Location**: `backend/` folder at project root
- **Technology**: Python FastAPI
- **Data Storage**: JSON files in `data/` directory (same as before)
- **Port**: `http://localhost:8000`

### Frontend (Updated)
- **Location**: `src/` folder (unchanged)
- **Technology**: Next.js (unchanged)
- **API Client**: Updated to call `http://localhost:8000` instead of relative `/api/` routes
- **Old API Routes**: Removed `src/app/api/` folder

## Setup Instructions

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Run the FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Or use Python directly:
```bash
python main.py
```

The API will be available at `http://localhost:8000`

### 2. Frontend Setup

```bash
# Install dependencies (if not already done)
npm install

# Run Next.js development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

### 3. Environment Variables (Optional)

You can optionally set the backend URL via environment variable:

Create a `.env.local` file in the project root:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

If not set, it defaults to `http://localhost:8000`.

## API Endpoints

All endpoints maintain the same structure as before:

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{barcode}` - Get product by barcode
- `POST /api/products` - Create new product
- `PUT /api/products` - Update existing product
- `DELETE /api/products/{barcode}` - Delete product

### Sales
- `GET /api/sales?startDate=...&endDate=...` - Get all sales (with optional date filtering)
- `GET /api/sales/{id}` - Get sale by ID
- `POST /api/sales` - Create new sale (automatically updates product stock)

### Inventory
- `GET /api/inventory` - Get inventory statistics and product list
- `PUT /api/inventory` - Adjust product stock
- `GET /api/inventory/export` - Export inventory to CSV

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics

## Data Files

The backend reads/writes to the same JSON files:
- `data/products.json` - Product catalog
- `data/sales.json` - Sales transaction history

These files are automatically created if they don't exist.

## API Documentation

Once the backend is running, you can access:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## Testing the Migration

1. Start the backend server (port 8000)
2. Start the frontend server (port 3000)
3. Test all features:
   - View dashboard
   - Create/update/delete products
   - Process sales
   - Adjust inventory
   - Export inventory

## Troubleshooting

### CORS Errors
- Ensure the backend is running on port 8000
- Check that CORS is enabled in `backend/main.py` for `http://localhost:3000`

### API Connection Errors
- Verify backend is running: `curl http://localhost:8000/`
- Check browser console for API errors
- Verify `NEXT_PUBLIC_API_URL` environment variable if set

### Data Not Persisting
- Check that `data/` directory exists and is writable
- Verify JSON files are being created/updated
- Check backend logs for file operation errors

## Next Steps

- Consider adding authentication/authorization
- Add request validation and error handling improvements
- Set up database migration (PostgreSQL, etc.) if needed
- Add API rate limiting
- Set up production deployment configuration

