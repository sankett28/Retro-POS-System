# RetroPos - Modern Point of Sale System

This is a modern Point of Sale (POS) system application built with a **hybrid stack**: Next.js frontend and Python FastAPI backend. It provides a comprehensive solution for managing sales, products, inventory, and reports.

## 🏗️ Project Structure

This project follows a **monorepo-style** layout with clear separation between frontend and backend:

```
Retro-POS-System/
├── backend/                 # 🐍 Python FastAPI Backend
│   ├── main.py             # FastAPI application
│   ├── models.py           # Pydantic models
│   ├── database.py         # JSON file operations
│   ├── requirements.txt    # Python dependencies
│   └── README.md           # Backend documentation
│
├── frontend/                # ⚛️ Next.js Frontend
│   ├── src/                # Source code
│   ├── package.json        # Node dependencies
│   ├── next.config.js      # Next.js configuration
│   └── tsconfig.json       # TypeScript configuration
│
├── data/                    # 💾 Shared Data Storage
│   ├── products.json       # Product catalog
│   └── sales.json          # Sales transaction history
│
└── README.md               # This file
```

## ✨ Features

- **Admin Dashboard**: Real-time overview of key business metrics including revenue, profit, taxes, transactions, inventory value, and low stock alerts.
- **Point of Sale (POS)**: Efficiently process sales with barcode scanning, quick product selection, and multiple payment methods (Cash, Card, Digital).
- **Product Management**: Full CRUD operations for products with barcode, name, category, price, cost, and stock tracking.
- **Inventory Management**: Track stock levels, adjust inventory (add/remove/set), view inventory statistics, and export inventory data to CSV.
- **Sales Reports**: Generate comprehensive sales reports with date range filtering, transaction history, and detailed statistics.
- **Receipt Generation**: Print and view detailed receipts for completed transactions.
- **Keyboard Shortcuts**: Quick navigation using Alt+D (Dashboard), Alt+P (POS), Alt+I (Inventory), Alt+R (Reports).

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher) and npm
- **Python** (v3.8 or higher) and pip

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Retro-POS-System
   ```

2. **Setup Backend:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Setup Frontend:**
   ```bash
   cd ../frontend
   npm install
   ```

### Development

You need to run **both** the backend and frontend servers:

1. **Start the Backend Server** (Terminal 1):
   ```bash
   cd backend
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
   
   The API will be available at `http://localhost:8000`
   - API Documentation: `http://localhost:8000/docs`

2. **Start the Frontend Server** (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```
   
   The application will be available at `http://localhost:3000`

### Building for Production

**Backend:**
```bash
cd backend
# Production deployment instructions in backend/README.md
```

**Frontend:**
```bash
cd frontend
npm run build
npm run start
```

## 📡 API Endpoints

The FastAPI backend provides the following endpoints:

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

## 🛠️ Technologies Used

### Frontend
- **Next.js 16.1.1**: React framework with App Router
- **React 18**: Modern React with hooks and context API
- **TypeScript**: Type-safe development
- **Lucide React**: Icon library for UI components

### Backend
- **FastAPI**: Modern Python web framework
- **Pydantic**: Data validation using Python type annotations
- **Uvicorn**: ASGI server for FastAPI

## 📁 Data Storage

The application uses JSON files for data persistence:
- `data/products.json` - Product catalog
- `data/sales.json` - Sales transaction history

The backend automatically creates these files if they don't exist.

## 🔧 Configuration

### Environment Variables (Optional)

Create a `.env.local` file in the `frontend/` directory to customize the API URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

If not set, it defaults to `http://localhost:8000`.

## 📚 Additional Documentation

- **Backend Documentation**: See `backend/README.md`
- **Migration Guide**: See `MIGRATION_GUIDE.md` (if migrating from monolith)
- **Architecture**: See `ARCHITECTURE.md` (legacy documentation)

## 🤝 Contribution

Feel free to fork this repository and contribute! Please ensure your code adheres to the project's coding standards and includes appropriate tests.

## 📝 License

[Add your license information here]
