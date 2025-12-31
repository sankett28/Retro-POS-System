# RetroPos - Architecture Documentation

## Overview

RetroPos is a full-stack Point of Sale (POS) system built with Next.js 16, React 18, and TypeScript. The application follows a single-server architecture where both frontend and backend logic coexist within the same Next.js application, using the App Router pattern.

## Architecture Pattern

### Single-Server Architecture

The application uses Next.js's integrated approach where:
- **Frontend**: React components in `src/components/` and pages in `src/app/`
- **Backend**: API routes in `src/app/api/` that handle server-side logic
- **Data Layer**: JSON file-based persistence in `data/` directory

This architecture eliminates the need for separate frontend and backend servers, simplifying deployment and development.

## Technology Stack

### Core Technologies
- **Next.js 16.1.1**: Framework providing App Router, API routes, and server-side rendering
- **React 18**: UI library with hooks and context API
- **TypeScript 5.3**: Type-safe JavaScript
- **Node.js**: Runtime environment

### Key Libraries
- **Lucide React**: Icon library for consistent UI icons
- **ESLint 9**: Code quality and linting

## Project Structure

### Frontend Architecture

#### Component Hierarchy
```
App (page.tsx)
├── AppProvider (Context)
│   └── Header
│       └── Navigation Buttons
│   └── Main Content
│       ├── DashboardView
│       │   ├── StatCard (multiple)
│       │   └── RecentTransactions
│       ├── POSView
│       │   ├── CartPanel
│       │   │   ├── CartItem (multiple)
│       │   │   ├── CheckoutModal
│       │   │   └── ReceiptModal
│       │   └── ProductGrid
│       ├── ProductsView
│       │   ├── ProductTable
│       │   └── ProductModal
│       │       └── ProductForm
│       ├── InventoryView
│       │   ├── StatCard (multiple)
│       │   ├── InventoryTable
│       │   └── StockModal
│       └── ReportsView
│           ├── StatCard (multiple)
│           ├── Date Filters
│           ├── Transaction Table
│           └── ReceiptModal
```

#### State Management

**Global State (AppContext)**
- `products`: Array of all products
- `sales`: Array of all sales transactions
- `cart`: Current shopping cart items

**State Flow**
1. AppContext fetches initial data on mount
2. Components access state via `useApp()` hook
3. Actions trigger API calls which update both server data and context state
4. UI re-renders automatically when context state changes

**Custom Hooks**
- `useCart()`: Manages cart operations and calculations
- `useProducts()`: Handles product filtering and search
- `useSales()`: Manages sales data and report filtering

### Backend Architecture

#### API Routes Structure
```
/api/
├── products/
│   ├── route.ts              # GET (all), POST, PUT
│   └── [barcode]/
│       └── route.ts          # GET (single), DELETE
├── sales/
│   ├── route.ts              # GET (all with filters), POST
│   └── [id]/
│       └── route.ts         # GET (single)
├── inventory/
│   ├── route.ts              # GET (stats), PUT (adjust)
│   └── export/
│       └── route.ts          # GET (CSV export)
└── dashboard/
    └── route.ts              # GET (statistics)
```

#### Data Flow

1. **Client Request**: Component calls API client function
2. **API Client**: Makes HTTP request to Next.js API route
3. **API Route**: 
   - Reads/writes JSON files
   - Performs business logic
   - Returns JSON response
4. **Client Response**: Updates React Context state
5. **UI Update**: Components re-render with new data

#### Data Persistence

**Current Implementation**: JSON Files
- `data/products.json`: Product catalog
- `data/sales.json`: Sales transaction history

**File Operations**
- All file operations use Node.js `fs/promises` for async I/O
- Files are read/written atomically
- Error handling includes fallback to empty arrays

**Future Considerations**
- Database migration path (PostgreSQL, MongoDB, etc.)
- Data validation and schema enforcement
- Backup and recovery mechanisms

## Key Design Patterns

### 1. Separation of Concerns

**Frontend/Backend Separation**
- Frontend logic in `src/components/`, `src/hooks/`, `src/context/`
- Backend logic in `src/app/api/`
- Shared types in `src/types/`
- Utility functions in `src/lib/utils/`

### 2. Component Composition

**Reusable UI Components**
- `Button`: Multiple variants (primary, secondary, checkout, etc.)
- `Modal`: Generic modal wrapper with keyboard/backdrop dismissal
- `Badge`: Status indicators with variants
- `Input`: Form input with label support

**Feature Components**
- Organized by domain (dashboard, pos, products, inventory, reports)
- Each feature has its own view component and supporting components

### 3. Custom Hooks Pattern

**Business Logic Abstraction**
- `useCart`: Encapsulates cart operations and calculations
- `useProducts`: Handles product filtering and search logic
- `useSales`: Manages sales data and report generation

### 4. API Client Layer

**Abstraction Over HTTP**
- Generic `apiFetch` utility for all API calls
- Type-safe API functions in `src/lib/api/`
- Centralized error handling

## Data Models

### Product
```typescript
interface Product {
  barcode: string;      // Unique identifier
  name: string;         // Product name
  category: string;     // Product category
  price: number;        // Selling price
  cost: number;         // Cost price
  stock: number;        // Current stock level
}
```

### CartItem
```typescript
interface CartItem extends Product {
  quantity: number;     // Quantity in cart
}
```

### Sale
```typescript
interface Sale {
  id: string;           // Transaction ID
  date: string;         // ISO date string
  items: CartItem[];    // Items sold
  subtotal: number;     // Subtotal before tax
  tax: number;          // Tax amount
  total: number;        // Total amount
  paymentMethod: 'cash' | 'card' | 'digital';
}
```

### DashboardStats
```typescript
interface DashboardStats {
  revenue: number;       // Total revenue
  profit: number;       // Net profit
  taxes: number;        // Total taxes collected
  transactions: number;  // Number of transactions
  products: number;     // Total products
  inventoryValue: number; // Total inventory value
  lowStock: number;     // Low stock items count
  avgSale: number;      // Average sale amount
}
```

## Business Logic

### Calculations

**Tax Calculation**
- Tax rate: 8% (configurable in `calculations.ts`)
- Formula: `tax = subtotal * TAX_RATE`

**Profit Calculation**
- Formula: `profit = revenue - totalCost`
- Cost calculated from product cost and quantity sold

**Stock Management**
- Stock decreases automatically when sale is processed
- Stock can be adjusted manually (add/remove/set)
- Low stock threshold: 10 units

### Validation Rules

**Product Validation**
- Barcode: Minimum 4 alphanumeric characters
- Name: Required, non-empty
- Category: Required, non-empty
- Price: Must be greater than 0
- Stock: Must be non-negative

**Stock Adjustment Validation**
- Quantity: Must be non-negative
- Remove operation: Cannot remove more than available stock

## Security Considerations

### Current Implementation
- Client-side validation for user experience
- Server-side validation in API routes
- Input sanitization through TypeScript types

### Future Enhancements
- Authentication and authorization
- Rate limiting on API routes
- Input sanitization and XSS prevention
- CSRF protection
- Secure file operations

## Performance Optimizations

### Current Optimizations
- React Context for global state (avoids prop drilling)
- Custom hooks for memoized calculations
- Component-level state for UI-only data
- Lazy loading of modals

### Future Considerations
- Database indexing for faster queries
- Caching layer for frequently accessed data
- Pagination for large datasets
- Virtual scrolling for long lists
- Code splitting and lazy loading

## Error Handling

### Frontend
- Try-catch blocks in async operations
- User-friendly error messages via alerts
- Graceful degradation for API failures

### Backend
- Error responses with appropriate HTTP status codes
- Detailed error messages in development
- Fallback to empty arrays for missing data files

## Testing Strategy

### Current State
- Manual testing via browser automation tools
- API endpoint testing via HTTP requests
- Type safety through TypeScript

### Recommended Future Testing
- Unit tests for utility functions
- Integration tests for API routes
- Component tests with React Testing Library
- E2E tests with Playwright or Cypress

## Deployment Considerations

### Build Process
```bash
npm run build  # Creates optimized production build
npm run start  # Starts production server
```

### Environment Requirements
- Node.js 18+ recommended
- File system write permissions for `data/` directory
- Port 3000 (or configured port) available

### Production Checklist
- [ ] Set up environment variables
- [ ] Configure proper error logging
- [ ] Set up data backup strategy
- [ ] Configure CORS if needed
- [ ] Set up monitoring and alerts
- [ ] Consider database migration

## Future Enhancements

### Short-term
- User authentication and authorization
- Multi-user support with roles
- Enhanced error handling and user feedback
- Print receipt functionality improvements

### Medium-term
- Database migration (PostgreSQL/MongoDB)
- Real-time inventory updates
- Advanced reporting and analytics
- Barcode scanner hardware integration
- Multi-store support

### Long-term
- Mobile app (React Native)
- Cloud deployment and scaling
- Advanced inventory management (reorder points, suppliers)
- Customer management system
- Loyalty program integration
- Multi-currency support

## Development Guidelines

### Code Style
- TypeScript strict mode enabled
- ESLint for code quality
- Consistent naming conventions (camelCase for variables, PascalCase for components)
- Component files use `.tsx` extension
- Utility files use `.ts` extension

### Best Practices
- Always use TypeScript types
- Keep components small and focused
- Use custom hooks for reusable logic
- Separate business logic from UI components
- Use meaningful variable and function names
- Add comments for complex logic

## Conclusion

The RetroPos architecture provides a solid foundation for a modern POS system with clear separation of concerns, type safety, and scalability considerations. The single-server architecture simplifies development and deployment while maintaining the flexibility to migrate to more complex architectures as the application grows.

