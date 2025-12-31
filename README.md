# RetroPos - Modern Point of Sale System

This is a modern Point of Sale (POS) system application built with Next.js 16, React 18, and TypeScript. It provides a comprehensive solution for managing sales, products, inventory, and reports. The application features a single-server architecture with integrated frontend and backend, using JSON files for data persistence.

## Features

- **Admin Dashboard**: Real-time overview of key business metrics including revenue, profit, taxes, transactions, inventory value, and low stock alerts.
- **Point of Sale (POS)**: Efficiently process sales with barcode scanning, quick product selection, and multiple payment methods (Cash, Card, Digital).
- **Product Management**: Full CRUD operations for products with barcode, name, category, price, cost, and stock tracking.
- **Inventory Management**: Track stock levels, adjust inventory (add/remove/set), view inventory statistics, and export inventory data to CSV.
- **Sales Reports**: Generate comprehensive sales reports with date range filtering, transaction history, and detailed statistics.
- **Receipt Generation**: Print and view detailed receipts for completed transactions.
- **Keyboard Shortcuts**: Quick navigation using Alt+D (Dashboard), Alt+P (POS), Alt+I (Inventory), Alt+R (Reports).

## Getting Started

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd retro-pos-system
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

### Development

To run the application in development mode:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Building for Production

To build the application for production:

```bash
npm run build
# or
yarn build
```

Then, to start the production server:

```bash
npm run start
# or
yarn start
```

## Project Structure

```
retro-pos-system/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API routes (backend)
│   │   │   ├── products/       # Product endpoints
│   │   │   ├── sales/          # Sales endpoints
│   │   │   ├── inventory/      # Inventory endpoints
│   │   │   └── dashboard/      # Dashboard endpoints
│   │   ├── layout.tsx          # Root layout with AppProvider
│   │   ├── page.tsx            # Main page with view routing
│   │   └── globals.css         # Global styles
│   ├── components/             # React components
│   │   ├── dashboard/          # Dashboard components
│   │   ├── pos/                # POS components
│   │   ├── products/           # Product management components
│   │   ├── inventory/          # Inventory components
│   │   ├── reports/            # Reports components
│   │   ├── layout/             # Layout components (Header, Navigation)
│   │   ├── modals/             # Modal components
│   │   └── ui/                 # Reusable UI components
│   ├── context/                # React Context
│   │   └── AppContext.tsx      # Global state management
│   ├── hooks/                  # Custom React hooks
│   │   ├── useCart.ts          # Cart management hook
│   │   ├── useProducts.ts      # Products management hook
│   │   └── useSales.ts         # Sales management hook
│   ├── lib/
│   │   ├── api/                # API client layer
│   │   │   ├── client.ts       # Generic API fetch utility
│   │   │   ├── products.ts    # Product API calls
│   │   │   ├── sales.ts        # Sales API calls
│   │   │   └── inventory.ts   # Inventory API calls
│   │   └── utils/              # Utility functions
│   │       ├── formatters.ts  # Currency, date, time formatters
│   │       ├── validators.ts  # Input validation functions
│   │       └── calculations.ts # Business logic calculations
│   └── types/                  # TypeScript definitions
│       └── index.ts            # Type definitions
├── data/                        # Data persistence
│   ├── products.json           # Product data
│   └── sales.json             # Sales transaction data
├── package.json                 # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── next.config.js              # Next.js configuration
└── README.md                   # This file
```

## Technologies Used

- **Next.js 16.1.1**: App Router with API routes for full-stack functionality
- **React 18**: Modern React with hooks and context API
- **TypeScript**: Type-safe development
- **Lucide React**: Icon library for UI components
- **ESLint 9**: Code quality and linting
- **Node.js**: Runtime environment

## Implementation Status

✅ **Completed Features:**
- Full project structure with separation of concerns (frontend/backend)
- TypeScript type definitions for all data models
- API routes for products, sales, inventory, and dashboard
- React Context API for global state management
- Custom hooks for cart, products, and sales management
- Reusable UI components (Button, Modal, Badge, Input)
- Dashboard with real-time statistics
- POS system with cart management and payment processing
- Product CRUD operations with validation
- Inventory management with stock adjustments
- Sales reports with date filtering
- Receipt generation and printing
- Keyboard shortcuts for navigation
- Data persistence using JSON files
- Sample product data included

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/[barcode]` - Get product by barcode
- `POST /api/products` - Create new product
- `PUT /api/products` - Update existing product
- `DELETE /api/products/[barcode]` - Delete product

### Sales
- `GET /api/sales` - Get all sales (with optional date filtering)
- `GET /api/sales/[id]` - Get sale by ID
- `POST /api/sales` - Create new sale (automatically updates product stock)

### Inventory
- `GET /api/inventory` - Get inventory statistics and product list
- `PUT /api/inventory` - Adjust product stock
- `GET /api/inventory/export` - Export inventory to CSV

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics

## Contribution

Feel free to fork this repository and contribute! Please ensure your code adheres to the project's coding standards and includes appropriate tests.
