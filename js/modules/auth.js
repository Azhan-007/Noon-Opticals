/**
 * =============================================
 * Authentication Modal Module
 * Handles login/signup modals
 * ============================================= 
 */

class AuthManager {
    constructor() {
        this.modal = document.getElementById('authModal');
        this.loginBtn = document.getElementById('loginBtn');
        this.closeBtn = document.getElementById('authClose');
        this.tabs = document.querySelectorAll('.auth-tab');
        this.forms = document.querySelectorAll('.auth-form-container');
        this.scrollPosition = 0;
    }

    init() {
        this.attachEventListeners();
    }

    attachEventListeners() {
        // Open modal
        if (this.loginBtn) {
            this.loginBtn.addEventListener('click', () => this.openModal());
        }

        // Close modal
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.closeModal());
        }

        // Close on outside click
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.closeModal();
                }
            });
        }

        // Tab switching
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.getAttribute('data-tab');
                this.switchTab(targetTab);
            });
        });

        // Handle form submissions
        document.querySelectorAll('.auth-form').forEach(form => {
            form.addEventListener('submit', (e) => this.handleSubmit(e, form));
        });
    }

    openModal() {
        if (this.modal) {
            this.modal.classList.add('active');

            // Use global lock function if available
            if (typeof lockBodyScroll === 'function') {
                lockBodyScroll();
            } else {
                // Fallback: robust mobile scroll lock using scroll-locked class
                this.scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
                document.documentElement.classList.add('scroll-locked');
                document.body.classList.add('scroll-locked');
                document.body.style.top = `-${this.scrollPosition}px`;
                document.body.style.position = 'fixed';
                document.body.style.width = '100%';
                document.body.style.overflow = 'hidden';
            }
        }
    }

    closeModal() {
        if (this.modal) {
            this.modal.classList.remove('active');

            // Use global unlock function if available
            if (typeof unlockBodyScroll === 'function') {
                unlockBodyScroll();
            } else {
                // Fallback: restore scroll
                document.documentElement.classList.remove('scroll-locked');
                document.body.classList.remove('scroll-locked');
                document.body.style.top = '';
                document.body.style.position = '';
                document.body.style.width = '';
                document.body.style.overflow = '';
                window.scrollTo(0, this.scrollPosition);
            }
        }
    }

    switchTab(targetTab) {
        // Update active tab
        this.tabs.forEach(t => t.classList.remove('active'));
        const activeTab = Array.from(this.tabs).find(t => t.getAttribute('data-tab') === targetTab);
        if (activeTab) activeTab.classList.add('active');

        // Show corresponding form
        this.forms.forEach(form => {
            form.classList.remove('active');
            if (form.id === targetTab + 'Form') {
                form.classList.add('active');
            }
        });
    }

    handleSubmit(e, form) {
        e.preventDefault();
        const isLogin = form.closest('#loginForm');

        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        if (isLogin) {
            this.handleLogin(data);
        } else {
            this.handleSignup(data);
        }
    }

    handleLogin(data) {
        console.log('Login attempt:', data);
        // TODO: Implement API call to backend
        alert('Login functionality will be implemented with backend integration.');
    }

    handleSignup(data) {
        console.log('Signup attempt:', data);
        // TODO: Implement API call to backend
        alert('Signup functionality will be implemented with backend integration.');
    }
}

// Initialize auth manager
document.addEventListener('DOMContentLoaded', () => {
    const authManager = new AuthManager();
    authManager.init();
});
