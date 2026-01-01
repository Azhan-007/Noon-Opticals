/**
 * =============================================
 * NOON OPTICALS - Main Application
 * Professional Modular JavaScript Architecture
 * ============================================= 
 */

// Import product data
window.productsData = typeof productsData !== 'undefined' ? productsData : [];

/**
 * Application Initialization
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('%c🌟 NOON OPTICALS', 'color: #94A3B8; font-size: 24px; font-weight: bold;');
    console.log('%cProfessional Eyewear Solution', 'color: #CBD5E1; font-size: 14px;');
    console.log('%c─────────────────────────────', 'color: #94A3B8;');
    
    initializeApp();
});

/**
 * Initialize Application
 */
function initializeApp() {
    // Initialize product display
    if (window.productsData && window.productsData.length > 0) {
        const productManager = new ProductManager(window.productsData);
        productManager.init();
    }

    // Initialize cart
    if (window.cartManager) {
        window.cartManager.updateDisplay();
    }

    // Add scroll animations
    initScrollAnimations();
    
    // Initialize lazy loading for images
    initLazyLoading();
    
    // Initialize back to top button if not already initialized
    initBackToTopButton();
    
    // Log initialization complete
    console.log('%c✓ Application Initialized Successfully', 'color: #4CAF50; font-weight: bold;');
}

/**
 * Scroll Animations
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    const animatedElements = document.querySelectorAll('.luxury-product-card, .feature-card-new, .branch-card, .contact-card');
    animatedElements.forEach(el => observer.observe(el));
}

/**
 * Lazy Loading Images
 */
function initLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports lazy loading
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src || img.src;
        });
    } else {
        // Fallback for older browsers
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }
}

/**
 * Back to Top Button
 */
function initBackToTopButton() {
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (!backToTopBtn) {
        // Create button if it doesn't exist
        const btn = document.createElement('button');
        btn.id = 'backToTopBtn';
        btn.className = 'back-to-top';
        btn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
        btn.setAttribute('aria-label', 'Back to top');
        document.body.appendChild(btn);
        
        btn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/**
 * Error Handling
 */
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    // TODO: Send to error tracking service
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    // TODO: Send to error tracking service
});

/**
 * Performance Monitoring
 */
window.addEventListener('load', () => {
    if (window.performance && window.performance.timing) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`%cPage Load Time: ${pageLoadTime}ms`, 'color: #94A3B8;');
    }
});

/**
 * Mobile Menu Toggle (if needed)
 */
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
}

/**
 * Utility Functions
 */
window.utils = {
    // Format currency
    formatCurrency: (amount) => {
        return '₹' + amount.toLocaleString('en-IN');
    },
    
    // Debounce function
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function
    throttle: (func, limit) => {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Validate email
    validateEmail: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    // Validate phone (Indian format)
    validatePhone: (phone) => {
        const re = /^[6-9]\d{9}$/;
        return re.test(phone.replace(/\D/g, '').slice(-10));
    }
};
