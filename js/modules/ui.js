/**
 * =============================================
 * UI Utilities Module
 * Handles various UI interactions
 * ============================================= 
 */

class UIManager {
    constructor() {
        this.backToTopBtn = document.getElementById('backToTopBtn');
    }

    init() {
        this.initBackToTop();
        this.initCallCards();
        this.initLegalModal();
        this.initContactForm();
    }

    // Back to Top Button
    initBackToTop() {
        if (!this.backToTopBtn) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                this.backToTopBtn.classList.add('show');
            } else {
                this.backToTopBtn.classList.remove('show');
            }
        });

        this.backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Click-to-Call Cards
    initCallCards() {
        const callCards = document.querySelectorAll('.call-card[data-phone]');
        callCards.forEach(card => {
            const phone = card.getAttribute('data-phone');
            if (!phone) return;

            card.addEventListener('click', (event) => {
                // Let actual links handle their own navigation
                if (event.target.closest('a')) return;
                window.location.href = `tel:${phone}`;
            });
        });
    }

    // Legal Modal (Terms & Privacy)
    initLegalModal() {
        const modal = document.getElementById('legalModal');
        const links = document.querySelectorAll('.legal-link');
        const tabs = modal?.querySelectorAll('.legal-tab');
        const panes = modal?.querySelectorAll('.legal-pane');
        const closeEls = modal?.querySelectorAll('[data-close-legal]');

        if (!modal || !links.length) return;

        const openModal = (target) => {
            modal.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            setActivePane(target);
        };

        const closeModal = () => {
            modal.classList.remove('open');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };

        const setActivePane = (key) => {
            tabs?.forEach(tab => {
                const isActive = tab.getAttribute('data-legal-tab') === key;
                tab.classList.toggle('active', isActive);
            });
            panes?.forEach(pane => {
                const isActive = pane.getAttribute('data-legal-pane') === key;
                pane.classList.toggle('active', isActive);
            });
        };

        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const key = link.getAttribute('data-legal') || 'privacy';
                openModal(key);
            });
        });

        tabs?.forEach(tab => {
            tab.addEventListener('click', () => {
                const key = tab.getAttribute('data-legal-tab');
                setActivePane(key);
            });
        });

        closeEls?.forEach(btn => {
            btn.addEventListener('click', closeModal);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('open')) {
                closeModal();
            }
        });
    }

    // Contact Form Submission
    initContactForm() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Get form data
            const formData = {
                firstName: document.getElementById('firstName')?.value,
                lastName: document.getElementById('lastName')?.value,
                email: document.getElementById('email')?.value,
                phone: document.getElementById('phone')?.value,
                message: document.getElementById('message')?.value
            };

            // Get submit button
            const submitBtn = contactForm.querySelector('.submit-btn');
            if (!submitBtn) return;

            const originalHTML = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            try {
                // TODO: Send to backend API
                await this.simulateAPICall(formData);

                // Success state
                submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Message Sent!';
                submitBtn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';

                setTimeout(() => {
                    contactForm.reset();
                    submitBtn.innerHTML = originalHTML;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                    alert('Thank you for reaching out! We\'ll get back to you soon.');
                }, 2000);
            } catch (error) {
                // Error state
                submitBtn.innerHTML = '<i class="fa-solid fa-times"></i> Error';
                submitBtn.style.background = 'linear-gradient(135deg, #f44336, #d32f2f)';
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalHTML;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 2000);
                
                console.error('Form submission error:', error);
            }
        });
    }

    // Simulate API call (remove when backend is ready)
    simulateAPICall(data) {
        return new Promise((resolve) => {
            console.log('Form data to be sent to backend:', data);
            setTimeout(resolve, 1500);
        });
    }
}

// Initialize UI Manager
document.addEventListener('DOMContentLoaded', () => {
    const uiManager = new UIManager();
    uiManager.init();
});
