/**
 * =============================================
 * Product Display Module
 * Handles product grid rendering and filtering
 * ============================================= 
 */

class ProductManager {
    constructor(products) {
        this.products = products;
        this.initialVisibleCount = this.getResponsiveCount();
        this.allProductsVisible = false;
        this.currentFilter = 'all';
    }

    getResponsiveCount() {
        return window.innerWidth <= 1024 ? 4 : 6;
    }

    updateResponsiveCount() {
        const newCount = this.getResponsiveCount();
        if (this.initialVisibleCount !== newCount) {
            this.initialVisibleCount = newCount;
            // Only re-apply if we haven't already shown all
            if (!this.allProductsVisible) {
                this.applyFilter(this.currentFilter);
            }
        }
    }

    init() {
        this.renderProducts();
        this.attachFilterListeners();
        this.initLoadMore();
        
        // Handle responsive count on resize
        window.addEventListener('resize', () => {
            this.updateResponsiveCount();
        });
    }

    renderProducts() {
        const grid = document.getElementById('productGrid');
        if (!grid) return;

        grid.innerHTML = this.products.map(p => this.createProductCard(p)).join('');
        this.applyFilter(this.currentFilter);
    }

    createProductCard(product) {
        const { id, name, category, price, oldPrice, img, discount, tags, inStock, rating, reviewCount } = product;
        
        return `
            <div class="luxury-product-card" data-category="${category.toLowerCase().replace(/\s+/g, '-')}">
                <div class="card-image-container">
                    <img src="${img}" alt="${name}" class="card-image" loading="lazy">
                    <button class="wishlist-btn" onclick="toggleWishlist(event, ${id})" title="Add to Wishlist" aria-label="Add to wishlist">
                        <i class="fa-regular fa-heart"></i>
                    </button>
                    ${discount ? `<div class="discount-badge">${discount}% OFF</div>` : ''}
                    ${!inStock ? 
                        `<div class="stock-badge out-of-stock">Out of Stock</div>` : 
                        `<div class="stock-badge in-stock">In Stock</div>`
                    }
                </div>
                
                <div class="card-content">
                    <div class="card-category">${category}</div>
                    <h3 class="card-title">${name}</h3>
                    
                    <div class="card-rating">
                        <div class="stars">
                            ${this.generateStars(rating)}
                        </div>
                        <span class="rating-count">(${reviewCount})</span>
                    </div>
                    
                    <div class="card-tags">
                        ${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    
                    <div class="card-pricing">
                        <div class="price-container">
                            <span class="current-price">₹${price.toLocaleString('en-IN')}</span>
                            ${oldPrice ? `<span class="old-price">₹${oldPrice.toLocaleString('en-IN')}</span>` : ''}
                        </div>
                    </div>
                    
                    <div class="card-badges">
                        <span class="free-shipping"><i class="fa-solid fa-truck"></i> Free Delivery</span>
                    </div>
                    
                    <button class="add-to-cart-btn ${!inStock ? 'disabled' : ''}" 
                            onclick="addToCart(${id})" 
                            ${!inStock ? 'disabled' : ''}
                            aria-label="Add ${name} to cart">
                        <i class="fa-solid fa-shopping-bag"></i>
                        ${!inStock ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        `;
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let stars = '';
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fa-solid fa-star"></i>';
        }
        
        if (hasHalfStar) {
            stars += '<i class="fa-solid fa-star-half-stroke"></i>';
        }
        
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="fa-regular fa-star"></i>';
        }
        
        return stars;
    }

    attachFilterListeners() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.getAttribute('data-filter');
                this.applyFilter(this.currentFilter);
            });
        });
    }

    applyFilter(filter) {
        const cards = document.querySelectorAll('.luxury-product-card');
        let visibleCount = 0;

        cards.forEach(card => {
            const category = card.getAttribute('data-category');
            const matches = filter === 'all' || category === filter;

            if (matches) {
                if (this.allProductsVisible || visibleCount < this.initialVisibleCount) {
                    card.style.display = 'block';
                    card.classList.add('show');
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                    card.classList.remove('show');
                }
            } else {
                card.style.display = 'none';
                card.classList.remove('show');
            }
        });

        this.updateLoadMoreButton(filter);
    }

    initLoadMore() {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (!loadMoreBtn) return;

        loadMoreBtn.addEventListener('click', () => {
            this.allProductsVisible = true;
            this.applyFilter(this.currentFilter);
            loadMoreBtn.style.display = 'none';
        });
    }

    updateLoadMoreButton(filter) {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (!loadMoreBtn) return;

        const cards = Array.from(document.querySelectorAll('.luxury-product-card'));
        const matchingCards = cards.filter(card => 
            filter === 'all' || card.getAttribute('data-category') === filter
        );

        if (this.allProductsVisible || matchingCards.length <= this.initialVisibleCount) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'inline-flex';
        }
    }
}

// Wishlist functionality
window.toggleWishlist = function(event, productId) {
    event.preventDefault();
    event.stopPropagation();
    
    const btn = event.currentTarget;
    btn.classList.toggle('active');
    
    const icon = btn.querySelector('i');
    if (btn.classList.contains('active')) {
        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid');
        // TODO: Add to wishlist in backend
        console.log('Added product', productId, 'to wishlist');
    } else {
        icon.classList.remove('fa-solid');
        icon.classList.add('fa-regular');
        // TODO: Remove from wishlist in backend
        console.log('Removed product', productId, 'from wishlist');
    }
};
