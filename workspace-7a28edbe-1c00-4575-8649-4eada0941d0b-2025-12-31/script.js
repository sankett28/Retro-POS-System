// ===================================
// MODERN POS - JAVASCRIPT APPLICATION
// ===================================

// === DATA STORAGE ===
let products = [];
let cart = [];
let sales = [];
let currentEditProduct = null;
let currentStockProduct = null;

// === INITIALIZE APP ===
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Load data from localStorage
    loadData();
    
    // Load sample products if none exist
    if (products.length === 0) {
        loadSampleProducts();
    }
    
    // Render initial views
    renderDashboard();
    renderProductGrid();
    renderProductsTable();
    renderInventory();
    renderReports();
    
    // Set default dates for reports
    const today = new Date().toISOString().split('T')[0];
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    document.getElementById('report-start-date').value = thirtyDaysAgo;
    document.getElementById('report-end-date').value = today;
});

// === DATA MANAGEMENT ===
function loadData() {
    const savedProducts = localStorage.getItem('pos_products');
    const savedSales = localStorage.getItem('pos_sales');
    
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    }
    
    if (savedSales) {
        sales = JSON.parse(savedSales);
    }
}

function saveData() {
    localStorage.setItem('pos_products', JSON.stringify(products));
    localStorage.setItem('pos_sales', JSON.stringify(sales));
}

function loadSampleProducts() {
    products = [
        { barcode: '1001', name: 'Organic Coffee Beans', category: 'Beverages', price: 12.99, cost: 7.50, stock: 45 },
        { barcode: '1002', name: 'Whole Wheat Bread', category: 'Food', price: 3.49, cost: 1.80, stock: 30 },
        { barcode: '1003', name: 'Fresh Orange Juice', category: 'Beverages', price: 5.99, cost: 3.20, stock: 25 },
        { barcode: '1004', name: 'Greek Yogurt', category: 'Food', price: 4.29, cost: 2.10, stock: 40 },
        { barcode: '1005', name: 'Organic Honey', category: 'Food', price: 8.99, cost: 5.00, stock: 20 },
        { barcode: '1006', name: 'Almond Milk', category: 'Beverages', price: 4.99, cost: 2.80, stock: 35 },
        { barcode: '1007', name: 'Dark Chocolate Bar', category: 'Food', price: 3.99, cost: 2.00, stock: 50 },
        { barcode: '1008', name: 'Green Tea', category: 'Beverages', price: 6.49, cost: 3.50, stock: 28 },
        { barcode: '1009', name: 'Granola Mix', category: 'Food', price: 7.99, cost: 4.20, stock: 22 },
        { barcode: '1010', name: 'Coconut Water', category: 'Beverages', price: 2.99, cost: 1.50, stock: 60 },
        { barcode: '1011', name: 'Protein Bar', category: 'Health', price: 2.49, cost: 1.20, stock: 75 },
        { barcode: '1012', name: 'Olive Oil', category: 'Food', price: 11.99, cost: 6.80, stock: 18 }
    ];
    saveData();
}

// === VIEW MANAGEMENT ===
function showView(viewName) {
    // Update active button
    document.querySelectorAll('.btn-icon').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.btn-icon').classList.add('active');
    
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    
    // Show selected view
    document.getElementById(viewName + '-view').classList.add('active');
    
    // Refresh view data
    if (viewName === 'dashboard') {
        renderDashboard();
    } else if (viewName === 'pos') {
        renderProductGrid();
        setTimeout(() => {
            document.getElementById('barcode-input').focus();
        }, 100);
    } else if (viewName === 'products') {
        renderProductsTable();
    } else if (viewName === 'inventory') {
        renderInventory();
    } else if (viewName === 'reports') {
        renderReports();
    }
}

// === ADMIN DASHBOARD ===
function renderDashboard() {
    // Calculate today's sales
    const today = new Date().toISOString().split('T')[0];
    const todaySales = sales.filter(sale => {
        const saleDate = new Date(sale.date).toISOString().split('T')[0];
        return saleDate === today;
    });
    
    // Calculate all-time metrics
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
    const totalCost = sales.reduce((sum, sale) => {
        return sum + sale.items.reduce((itemSum, item) => {
            const product = products.find(p => p.barcode === item.barcode);
            const cost = product ? (product.cost || 0) : 0;
            return itemSum + (cost * item.quantity);
        }, 0);
    }, 0);
    const totalProfit = totalRevenue - totalCost;
    const totalTaxes = sales.reduce((sum, sale) => sum + sale.tax, 0);
    const totalTransactions = todaySales.length;
    
    // Calculate inventory metrics
    const totalProducts = products.length;
    const inventoryValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const lowStockCount = products.filter(p => p.stock < 10).length;
    const avgSale = sales.length > 0 ? totalRevenue / sales.length : 0;
    
    // Update dashboard stats
    document.getElementById('dash-revenue').textContent = '$' + totalRevenue.toFixed(2);
    document.getElementById('dash-profit').textContent = '$' + totalProfit.toFixed(2);
    document.getElementById('dash-taxes').textContent = '$' + totalTaxes.toFixed(2);
    document.getElementById('dash-transactions').textContent = totalTransactions;
    document.getElementById('dash-products').textContent = totalProducts;
    document.getElementById('dash-inventory-value').textContent = '$' + inventoryValue.toFixed(0);
    document.getElementById('dash-low-stock').textContent = lowStockCount;
    document.getElementById('dash-avg-sale').textContent = '$' + avgSale.toFixed(2);
    
    // Calculate trends (compare with previous period)
    const profitMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0;
    document.getElementById('profit-trend').innerHTML = `
        <i data-lucide="trending-up"></i>
        <span>${profitMargin}% margin</span>
    `;
    
    // Render recent transactions
    const recentSales = sales.slice(-10).reverse();
    const recentTableBody = document.getElementById('dash-recent-sales');
    
    if (recentSales.length === 0) {
        recentTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No recent transactions</td></tr>';
    } else {
        recentTableBody.innerHTML = recentSales.map(sale => {
            const date = new Date(sale.date);
            return `
                <tr>
                    <td>${date.toLocaleTimeString()}</td>
                    <td>${sale.id}</td>
                    <td>${sale.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                    <td>$${sale.total.toFixed(2)}</td>
                    <td>${sale.paymentMethod.toUpperCase()}</td>
                </tr>
            `;
        }).join('');
    }
    
    lucide.createIcons();
}

function refreshDashboard() {
    renderDashboard();
}

// === BARCODE SCANNING ===
function handleBarcodeInput(event) {
    if (event.key === 'Enter') {
        scanBarcode();
    }
}

function scanBarcode() {
    const barcodeInput = document.getElementById('barcode-input');
    const barcode = barcodeInput.value.trim();
    
    if (!barcode) return;
    
    const product = products.find(p => p.barcode === barcode);
    
    if (product) {
        if (product.stock > 0) {
            addToCart(product);
            barcodeInput.value = '';
            barcodeInput.focus();
        } else {
            alert('Product is out of stock!');
        }
    } else {
        alert('Product not found!');
    }
}

// === CART MANAGEMENT ===
function addToCart(product) {
    const existingItem = cart.find(item => item.barcode === product.barcode);
    
    if (existingItem) {
        if (existingItem.quantity < product.stock) {
            existingItem.quantity++;
        } else {
            alert('Not enough stock available!');
            return;
        }
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    renderCart();
}

function updateQuantity(barcode, change) {
    const item = cart.find(item => item.barcode === barcode);
    const product = products.find(p => p.barcode === barcode);
    
    if (item) {
        const newQuantity = item.quantity + change;
        
        if (newQuantity <= 0) {
            removeFromCart(barcode);
        } else if (newQuantity <= product.stock) {
            item.quantity = newQuantity;
            renderCart();
        } else {
            alert('Not enough stock available!');
        }
    }
}

function removeFromCart(barcode) {
    cart = cart.filter(item => item.barcode !== barcode);
    renderCart();
}

function clearCart() {
    if (cart.length > 0) {
        if (confirm('Are you sure you want to clear the cart?')) {
            cart = [];
            renderCart();
        }
    }
}

function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i data-lucide="shopping-cart"></i>
                <p>Cart is empty</p>
                <small>Scan items to begin</small>
            </div>
        `;
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)} each</p>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-control">
                        <button onclick="updateQuantity('${item.barcode}', -1)">
                            <i data-lucide="minus"></i>
                        </button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity('${item.barcode}', 1)">
                            <i data-lucide="plus"></i>
                        </button>
                    </div>
                    <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                    <button class="remove-item" onclick="removeFromCart('${item.barcode}')">
                        <i data-lucide="x"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    // Update summary
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;
    
    document.getElementById('subtotal').textContent = '$' + subtotal.toFixed(2);
    document.getElementById('tax').textContent = '$' + tax.toFixed(2);
    document.getElementById('total').textContent = '$' + total.toFixed(2);
    
    // Reinitialize icons
    lucide.createIcons();
}

// === CHECKOUT ===
function processCheckout() {
    if (cart.length === 0) {
        alert('Cart is empty!');
        return;
    }
    
    const total = parseFloat(document.getElementById('total').textContent.replace('$', ''));
    document.getElementById('checkout-total').textContent = '$' + total.toFixed(2);
    
    document.getElementById('checkout-modal').classList.add('active');
}

function closeCheckoutModal() {
    document.getElementById('checkout-modal').classList.remove('active');
}

function completePayment(method) {
    // Create sale record
    const sale = {
        id: 'TXN' + Date.now(),
        date: new Date().toISOString(),
        items: [...cart],
        subtotal: parseFloat(document.getElementById('subtotal').textContent.replace('$', '')),
        tax: parseFloat(document.getElementById('tax').textContent.replace('$', '')),
        total: parseFloat(document.getElementById('total').textContent.replace('$', '')),
        paymentMethod: method
    };
    
    // Update inventory
    cart.forEach(item => {
        const product = products.find(p => p.barcode === item.barcode);
        if (product) {
            product.stock -= item.quantity;
        }
    });
    
    // Save sale
    sales.push(sale);
    saveData();
    
    // Close checkout modal
    closeCheckoutModal();
    
    // Show receipt
    showReceipt(sale);
    
    // Clear cart
    cart = [];
    renderCart();
    
    // Update views
    renderDashboard();
    renderProductGrid();
    renderProductsTable();
}

// === RECEIPT ===
function showReceipt(sale) {
    const receiptContainer = document.getElementById('receipt');
    const date = new Date(sale.date);
    
    receiptContainer.innerHTML = `
        <div class="receipt-header">
            <h2>RetroPos</h2>
            <p>Thank you for your purchase!</p>
        </div>
        <div class="receipt-info">
            <div>Transaction: ${sale.id}</div>
            <div>Date: ${date.toLocaleDateString()}</div>
            <div>Time: ${date.toLocaleTimeString()}</div>
            <div>Payment: ${sale.paymentMethod.toUpperCase()}</div>
        </div>
        <div class="receipt-items">
            ${sale.items.map(item => `
                <div class="receipt-item">
                    <div>
                        <div>${item.name}</div>
                        <div style="font-size: 0.875rem; color: #666;">
                            ${item.quantity} x $${item.price.toFixed(2)}
                        </div>
                    </div>
                    <div>$${(item.price * item.quantity).toFixed(2)}</div>
                </div>
            `).join('')}
        </div>
        <div class="receipt-totals">
            <div class="receipt-total-row">
                <span>Subtotal:</span>
                <span>$${sale.subtotal.toFixed(2)}</span>
            </div>
            <div class="receipt-total-row">
                <span>Tax (8%):</span>
                <span>$${sale.tax.toFixed(2)}</span>
            </div>
            <div class="receipt-total-row final">
                <span>TOTAL:</span>
                <span>$${sale.total.toFixed(2)}</span>
            </div>
        </div>
        <div class="receipt-footer">
            <p>Visit us again soon!</p>
            <p>RetroPos - Your Modern Shopping Experience</p>
        </div>
    `;
    
    document.getElementById('receipt-modal').classList.add('active');
}

function closeReceiptModal() {
    document.getElementById('receipt-modal').classList.remove('active');
}

function printReceipt() {
    window.print();
}

// === PRODUCT GRID ===
function renderProductGrid() {
    const gridContainer = document.getElementById('product-grid');
    
    if (products.length === 0) {
        gridContainer.innerHTML = '<p style="text-align: center; color: var(--text-light);">No products available</p>';
        return;
    }
    
    gridContainer.innerHTML = products.map(product => `
        <div class="product-card" onclick="addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})">
            <i data-lucide="package"></i>
            <h4>${product.name}</h4>
            <div class="price">$${product.price.toFixed(2)}</div>
            <div class="stock">Stock: ${product.stock}</div>
        </div>
    `).join('');
    
    lucide.createIcons();
}

function filterProducts(searchTerm) {
    const gridContainer = document.getElementById('product-grid');
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.barcode.includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (filtered.length === 0) {
        gridContainer.innerHTML = '<p style="text-align: center; color: var(--text-light);">No products found</p>';
        return;
    }
    
    gridContainer.innerHTML = filtered.map(product => `
        <div class="product-card" onclick="addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})">
            <i data-lucide="package"></i>
            <h4>${product.name}</h4>
            <div class="price">$${product.price.toFixed(2)}</div>
            <div class="stock">Stock: ${product.stock}</div>
        </div>
    `).join('');
    
    lucide.createIcons();
}

// === PRODUCT MANAGEMENT ===
function renderProductsTable() {
    const tableBody = document.getElementById('products-table-body');
    
    if (products.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No products available</td></tr>';
        return;
    }
    
    tableBody.innerHTML = products.map(product => `
        <tr>
            <td>${product.barcode}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${product.stock}</td>
            <td>
                <div class="table-actions">
                    <button class="btn-edit" onclick="editProduct('${product.barcode}')">
                        <i data-lucide="edit"></i> Edit
                    </button>
                    <button class="btn-delete" onclick="deleteProduct('${product.barcode}')">
                        <i data-lucide="trash-2"></i> Delete
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    lucide.createIcons();
}

function showAddProductModal() {
    currentEditProduct = null;
    document.getElementById('modal-title').textContent = 'Add Product';
    document.getElementById('product-form').reset();
    document.getElementById('product-modal').classList.add('active');
}

function editProduct(barcode) {
    const product = products.find(p => p.barcode === barcode);
    if (!product) return;
    
    currentEditProduct = barcode;
    document.getElementById('modal-title').textContent = 'Edit Product';
    document.getElementById('product-barcode').value = product.barcode;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-cost').value = product.cost || 0;
    document.getElementById('product-stock').value = product.stock;
    
    document.getElementById('product-modal').classList.add('active');
}

function deleteProduct(barcode) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.barcode !== barcode);
        saveData();
        renderProductsTable();
        renderProductGrid();
        renderInventory();
        renderDashboard();
    }
}

function closeProductModal() {
    document.getElementById('product-modal').classList.remove('active');
    currentEditProduct = null;
}

function saveProduct(event) {
    event.preventDefault();
    
    const barcode = document.getElementById('product-barcode').value;
    const name = document.getElementById('product-name').value;
    const category = document.getElementById('product-category').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const cost = parseFloat(document.getElementById('product-cost').value) || 0;
    const stock = parseInt(document.getElementById('product-stock').value);
    
    if (currentEditProduct) {
        // Edit existing product
        const product = products.find(p => p.barcode === currentEditProduct);
        if (product) {
            product.barcode = barcode;
            product.name = name;
            product.category = category;
            product.price = price;
            product.cost = cost;
            product.stock = stock;
        }
    } else {
        // Add new product
        if (products.find(p => p.barcode === barcode)) {
            alert('Product with this barcode already exists!');
            return;
        }
        
        products.push({ barcode, name, category, price, cost, stock });
    }
    
    saveData();
    closeProductModal();
    renderProductsTable();
    renderProductGrid();
    renderInventory();
    renderDashboard();
}

// === INVENTORY MANAGEMENT ===
function renderInventory() {
    // Update stats
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const lowStock = products.filter(p => p.stock < 10).length;
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    
    document.getElementById('total-products').textContent = totalProducts;
    document.getElementById('total-value').textContent = '$' + totalValue.toFixed(0);
    document.getElementById('low-stock').textContent = lowStock;
    document.getElementById('total-stock').textContent = totalStock;
    
    // Update table
    const tableBody = document.getElementById('inventory-table-body');
    
    if (products.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No products in inventory</td></tr>';
        return;
    }
    
    tableBody.innerHTML = products.map(product => {
        let statusBadge = '';
        if (product.stock === 0) {
            statusBadge = '<span class="badge badge-danger">Out of Stock</span>';
        } else if (product.stock < 10) {
            statusBadge = '<span class="badge badge-warning">Low Stock</span>';
        } else {
            statusBadge = '<span class="badge badge-success">In Stock</span>';
        }
        
        return `
            <tr>
                <td>${product.name}</td>
                <td>${product.barcode}</td>
                <td>${product.stock}</td>
                <td>${statusBadge}</td>
                <td>$${(product.price * product.stock).toFixed(2)}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn-stock" onclick="showStockModal('${product.barcode}')">
                            <i data-lucide="package-plus"></i> Adjust
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    lucide.createIcons();
}

function showStockModal(barcode) {
    const product = products.find(p => p.barcode === barcode);
    if (!product) return;
    
    currentStockProduct = barcode;
    document.getElementById('stock-product-name').textContent = product.name;
    document.getElementById('stock-current').textContent = product.stock;
    document.getElementById('stock-quantity').value = '';
    document.getElementById('stock-adjustment-type').value = 'add';
    updateStockLabel();
    
    document.getElementById('stock-modal').classList.add('active');
}

function closeStockModal() {
    document.getElementById('stock-modal').classList.remove('active');
    currentStockProduct = null;
}

function updateStockLabel() {
    const type = document.getElementById('stock-adjustment-type').value;
    const label = document.getElementById('stock-quantity-label');
    
    if (type === 'add') {
        label.textContent = 'Quantity to Add';
    } else if (type === 'remove') {
        label.textContent = 'Quantity to Remove';
    } else {
        label.textContent = 'New Stock Level';
    }
}

function adjustStock(event) {
    event.preventDefault();
    
    const product = products.find(p => p.barcode === currentStockProduct);
    if (!product) return;
    
    const type = document.getElementById('stock-adjustment-type').value;
    const quantity = parseInt(document.getElementById('stock-quantity').value);
    
    if (type === 'add') {
        product.stock += quantity;
    } else if (type === 'remove') {
        product.stock = Math.max(0, product.stock - quantity);
    } else {
        product.stock = quantity;
    }
    
    saveData();
    closeStockModal();
    renderInventory();
    renderProductsTable();
    renderProductGrid();
    renderDashboard();
}

function exportInventory() {
    const csv = [
        ['Barcode', 'Name', 'Category', 'Price', 'Cost', 'Stock', 'Value'],
        ...products.map(p => [
            p.barcode,
            p.name,
            p.category,
            p.price.toFixed(2),
            (p.cost || 0).toFixed(2),
            p.stock,
            (p.price * p.stock).toFixed(2)
        ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory_' + new Date().toISOString().split('T')[0] + '.csv';
    a.click();
}

// === REPORTS ===
function renderReports() {
    const startDate = document.getElementById('report-start-date').value;
    const endDate = document.getElementById('report-end-date').value;
    
    let filteredSales = sales;
    
    if (startDate && endDate) {
        filteredSales = sales.filter(sale => {
            const saleDate = new Date(sale.date).toISOString().split('T')[0];
            return saleDate >= startDate && saleDate <= endDate;
        });
    }
    
    // Update stats
    const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
    const totalTransactions = filteredSales.length;
    const avgTransaction = totalTransactions > 0 ? totalSales / totalTransactions : 0;
    const itemsSold = filteredSales.reduce((sum, sale) => 
        sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );
    
    document.getElementById('total-sales').textContent = '$' + totalSales.toFixed(2);
    document.getElementById('total-transactions').textContent = totalTransactions;
    document.getElementById('avg-transaction').textContent = '$' + avgTransaction.toFixed(2);
    document.getElementById('items-sold').textContent = itemsSold;
    
    // Update table
    const tableBody = document.getElementById('sales-table-body');
    
    if (filteredSales.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No sales in this period</td></tr>';
        return;
    }
    
    tableBody.innerHTML = filteredSales.slice().reverse().map(sale => {
        const date = new Date(sale.date);
        return `
            <tr>
                <td>${date.toLocaleDateString()} ${date.toLocaleTimeString()}</td>
                <td>${sale.id}</td>
                <td>${sale.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                <td>$${sale.total.toFixed(2)}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn-edit" onclick="viewSaleDetails('${sale.id}')">
                            <i data-lucide="eye"></i> View
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    lucide.createIcons();
}

function generateReport() {
    renderReports();
}

function viewSaleDetails(saleId) {
    const sale = sales.find(s => s.id === saleId);
    if (!sale) return;
    
    showReceipt(sale);
}

// === KEYBOARD SHORTCUTS ===
document.addEventListener('keydown', function(event) {
    // Alt + D: Dashboard View
    if (event.altKey && event.key === 'd') {
        event.preventDefault();
        showView('dashboard');
    }
    
    // Alt + P: POS View
    if (event.altKey && event.key === 'p') {
        event.preventDefault();
        showView('pos');
    }
    
    // Alt + I: Inventory View
    if (event.altKey && event.key === 'i') {
        event.preventDefault();
        showView('inventory');
    }
    
    // Alt + R: Reports View
    if (event.altKey && event.key === 'r') {
        event.preventDefault();
        showView('reports');
    }
    
    // Escape: Close modals
    if (event.key === 'Escape') {
        closeProductModal();
        closeCheckoutModal();
        closeReceiptModal();
        closeStockModal();
    }
});