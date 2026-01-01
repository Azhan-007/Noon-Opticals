/**
 * =============================================
 * Cart Management Module
 * Handles shopping cart functionality
 * ============================================= 
 */

class CartManager {
    constructor() {
        this.cart = this.loadCart();
        this.cartKey = 'noonOpticals_cart';
    }

    loadCart() {
        try {
            const saved = localStorage.getItem(this.cartKey);
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading cart:', error);
            return [];
        }
    }

    saveCart() {
        try {
            localStorage.setItem(this.cartKey, JSON.stringify(this.cart));
            this.updateDisplay();
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }

    addItem(product) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.qty++;
        } else {
            this.cart.push({ ...product, qty: 1 });
        }
        
        this.saveCart();
        this.openCart();
    }

    removeItem(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
    }

    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.qty = Math.max(1, quantity);
            this.saveCart();
        }
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
    }

    getTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.qty), 0);
    }

    getItemCount() {
        return this.cart.reduce((count, item) => count + item.qty, 0);
    }

    updateDisplay() {
        const totalItems = this.getItemCount();
        const floatingBadge = document.getElementById('floatingCartCount');
        if (floatingBadge) {
            floatingBadge.textContent = totalItems;
        }

        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');

        if (!cartItems || !cartTotal) return;

        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div style="text-align:center; padding:40px 20px; color:rgba(255,255,255,0.6);">
                    <i class="fa-solid fa-shopping-bag" style="font-size:3rem; margin-bottom:15px; opacity:0.3;"></i>
                    <p>Your cart is empty.</p>
                </div>
            `;
            cartTotal.textContent = '₹0';
        } else {
            const total = this.getTotal();
            cartItems.innerHTML = this.cart.map(item => `
                <div class="c-item">
                    <img src="${item.img}" alt="${item.name}" loading="lazy" decoding="async">
                    <div class="c-info">
                        <h4>${item.name}</h4>
                        <p>₹${item.price.toLocaleString('en-IN')} x ${item.qty}</p>
                        <span class="remove-item" onclick="window.cartManager.removeItem(${item.id})">Remove</span>
                    </div>
                </div>
            `).join('');
            cartTotal.textContent = '₹' + total.toLocaleString('en-IN');
        }
    }

    openCart() {
        const sidebar = document.getElementById('cartSidebar');
        const overlay = document.getElementById('overlay');
        if (sidebar) sidebar.classList.add('open');
        if (overlay) overlay.classList.add('active');
    }

    closeCart() {
        const sidebar = document.getElementById('cartSidebar');
        const overlay = document.getElementById('overlay');
        if (sidebar) sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
    }

    toggleCart() {
        const sidebar = document.getElementById('cartSidebar');
        if (sidebar && sidebar.classList.contains('open')) {
            this.closeCart();
        } else {
            this.openCart();
        }
    }
}

// Create global instance
window.cartManager = new CartManager();

// Expose functions globally for inline onclick handlers
window.toggleCart = () => window.cartManager.toggleCart();
window.addToCart = (productId) => {
    const product = window.productsData?.find(p => p.id === productId);
    if (product && product.inStock) {
        window.cartManager.addItem(product);
    }
};
