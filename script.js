// --- Data ---
const products = [
    { id: 1, name: "Neon Vision", category: "Sport", price: 120, img: "https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=2070&auto=format&fit=crop" },
    { id: 2, name: "Crystal Clear", category: "Reading", price: 85, img: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=2080&auto=format&fit=crop" },
    { id: 3, name: "Golden Hour", category: "Sun", price: 150, img: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?q=80&w=2070&auto=format&fit=crop" },
    { id: 4, name: "Urban Tech", category: "Blue Light", price: 95, img: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?q=80&w=2070&auto=format&fit=crop" },
    { id: 5, name: "Classic Aviator", category: "Sun", price: 135, img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=2080&auto=format&fit=crop" },
    { id: 6, name: "Retro Round", category: "Fashion", price: 110, img: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=2070&auto=format&fit=crop" },
    { id: 7, name: "Smart Vision", category: "Blue Light", price: 99, img: "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=2084&auto=format&fit=crop" },
    { id: 8, name: "Elite Pro", category: "Sport", price: 145, img: "https://images.unsplash.com/photo-1509695507497-903c140c43b0?q=80&w=2073&auto=format&fit=crop" },
];

let cart = JSON.parse(localStorage.getItem('prismCart')) || [];

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    updateCartDisplay();
});

// --- Functions ---
function loadProducts() {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = products.map(p => `
        <div class="product-card glass-card">
            <img src="${p.img}" alt="${p.name}">
            <div>
                <div class="p-cat">${p.category}</div>
                <div class="p-title">${p.name}</div>
                <div class="p-price">$${p.price}</div>
                <button class="add-cart-btn" onclick="addToCart(${p.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    const item = cart.find(i => i.id === id);
    if(item) {
        item.qty++;
    } else {
        cart.push({...product, qty: 1});
    }
    saveCart();
    toggleCart(true);
}

function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
}

function saveCart() {
    localStorage.setItem('prismCart', JSON.stringify(cart));
    updateCartDisplay();
}

function updateCartDisplay() {
    document.getElementById('cartCount').innerText = cart.reduce((a, b) => a + b.qty, 0);
    const cartItems = document.getElementById('cartItems');
    
    if(cart.length === 0) {
        cartItems.innerHTML = "<p style='text-align:center; padding:20px; color:#666;'>Your cart is empty.</p>";
        document.getElementById('cartTotal').innerText = "$0.00";
    } else {
        let total = 0;
        cartItems.innerHTML = cart.map(item => {
            total += item.price * item.qty;
            return `
                <div class="c-item">
                    <img src="${item.img}" alt="">
                    <div class="c-info">
                        <h4>${item.name}</h4>
                        <p>$${item.price} x ${item.qty}</p>
                        <span class="remove-item" onclick="removeFromCart(${item.id})">Remove</span>
                    </div>
                </div>
            `;
        }).join('');
        document.getElementById('cartTotal').innerText = "$" + total.toFixed(2);
    }
}

// --- UI Toggles ---
function toggleCart(forceOpen = false) {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');
    if(forceOpen) {
        sidebar.classList.add('open');
        overlay.classList.add('active');
    } else {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('active');
    }
}

// --- Contact Form ---
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            // Simulate form submission
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                // Show success message
                submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Message Sent!';
                submitBtn.style.background = '#4CAF50';
                
                // Log form data (in production, send to server)
                console.log('Form submitted:', formData);
                
                // Reset form after 2 seconds
                setTimeout(() => {
                    contactForm.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                    
                    // Optional: Show a notification
                    alert('Thank you for reaching out! We\'ll get back to you soon.');
                }, 2000);
            }, 1500);
        });
    }
});