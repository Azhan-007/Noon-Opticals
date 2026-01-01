/**
 * Performance Optimization - Skeleton Loading Handler
 * Manages skeleton UI visibility and smooth transitions
 */

(function() {
    'use strict';

    // Configuration
    const SKELETON_FADE_DURATION = 300; // ms

    /**
     * Hide skeleton with smooth fade transition
     */
    function hideSkeleton(skeletonElement) {
        if (!skeletonElement) return;

        // Add fade-out effect
        skeletonElement.style.transition = `opacity ${SKELETON_FADE_DURATION}ms ease-out`;
        skeletonElement.style.opacity = '0';

        // Remove from DOM after transition
        setTimeout(() => {
            skeletonElement.classList.add('skeleton-hidden');
            skeletonElement.remove();
        }, SKELETON_FADE_DURATION);
    }

    /**
     * Initialize hero section content visibility
     */
    function initHeroContent() {
        const heroContent = document.querySelector('.hero-content');
        const heroSkeleton = document.querySelector('.hero-skeleton');

        if (heroContent && heroSkeleton) {
            // Initially hide actual content
            heroContent.style.opacity = '0';

            // Wait for hero image to load
            const heroImage = document.querySelector('.hero-image img');
            
            if (heroImage) {
                if (heroImage.complete) {
                    // Image already loaded
                    showHeroContent();
                } else {
                    // Wait for image load
                    heroImage.addEventListener('load', showHeroContent);
                    heroImage.addEventListener('error', showHeroContent); // Show content even on error
                }
            } else {
                // No image found, show content immediately
                showHeroContent();
            }
        }

        function showHeroContent() {
            if (heroContent) {
                heroContent.style.transition = `opacity ${SKELETON_FADE_DURATION}ms ease-in`;
                heroContent.style.opacity = '1';
            }
            hideSkeleton(heroSkeleton);
        }
    }

    /**
     * Initialize product grid skeleton handling
     */
    function initProductSkeletons() {
        // Wait for products to be rendered
        const checkProductsInterval = setInterval(() => {
            const productGrid = document.getElementById('productGrid');
            const productSkeletons = document.querySelectorAll('.product-skeleton');
            
            if (productGrid && productGrid.children.length > 0) {
                // Products are loaded, hide skeletons
                productSkeletons.forEach(skeleton => {
                    hideSkeleton(skeleton);
                });
                clearInterval(checkProductsInterval);
            }
        }, 100);

        // Fallback: Remove skeletons after 3 seconds anyway
        setTimeout(() => {
            clearInterval(checkProductsInterval);
            const productSkeletons = document.querySelectorAll('.product-skeleton');
            productSkeletons.forEach(skeleton => {
                hideSkeleton(skeleton);
            });
        }, 3000);
    }

    /**
     * Handle lazy-loaded images
     * Add loaded class when images are visible
     */
    function initLazyImageHandling() {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.addEventListener('load', () => {
                            img.classList.add('loaded');
                        });
                        observer.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for browsers without IntersectionObserver
            lazyImages.forEach(img => {
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                });
            });
        }
    }

    /**
     * Optimize font loading
     * Use font-display: swap in CSS for better performance
     */
    function optimizeFontLoading() {
        // Check if fonts are already loaded
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(() => {
                document.body.classList.add('fonts-loaded');
            });
        }
    }

    /**
     * Initialize all performance optimizations
     */
    function init() {
        // Run immediately for critical content
        initHeroContent();
        initLazyImageHandling();
        optimizeFontLoading();

        // Wait for DOM to be fully loaded for non-critical content
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                initProductSkeletons();
            });
        } else {
            initProductSkeletons();
        }
    }

    // Start initialization
    init();

})();
