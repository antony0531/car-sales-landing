/**
 * Premium Auto Sales - Main JavaScript
 * Handles all interactive functionality
 */

(function() {
    'use strict';

    // ==========================================
    // Mobile Navigation Toggle
    // ==========================================
    const initMobileNav = () => {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger) {
            hamburger.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                hamburger.classList.toggle('active');
            });
            
            // Close menu when clicking a link
            document.querySelectorAll('.nav-menu a').forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                });
            });
        }
    };

    // ==========================================
    // Smooth Scrolling
    // ==========================================
    const initSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    };

    // ==========================================
    // Form Validation and Submission
    // ==========================================
    const initFormValidation = () => {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                // Get all required fields
                const requiredFields = form.querySelectorAll('[required]');
                let isValid = true;
                
                requiredFields.forEach(field => {
                    if (!validateField(field)) {
                        isValid = false;
                        showFieldError(field);
                    } else {
                        clearFieldError(field);
                    }
                });
                
                if (isValid) {
                    // For Netlify forms, let them submit normally
                    if (form.hasAttribute('data-netlify')) {
                        // Netlify will handle the submission and redirect
                        // Don't show success message here as page will redirect
                        return true;
                    } else {
                        // For non-Netlify forms (demo mode)
                        e.preventDefault();
                        showFormSuccess(form);
                        setTimeout(() => {
                            form.reset();
                            hideFormSuccess(form);
                        }, 3000);
                    }
                } else {
                    e.preventDefault();
                }
            });
            
            // Real-time validation
            form.querySelectorAll('input, select, textarea').forEach(field => {
                field.addEventListener('blur', () => {
                    if (field.hasAttribute('required')) {
                        if (validateField(field)) {
                            clearFieldError(field);
                        } else {
                            showFieldError(field);
                        }
                    }
                });
                
                field.addEventListener('input', () => {
                    if (field.classList.contains('error')) {
                        if (validateField(field)) {
                            clearFieldError(field);
                        }
                    }
                });
            });
        });
    };
    
    const validateField = (field) => {
        const value = field.value.trim();
        
        if (!value) return false;
        
        // Email validation
        if (field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(value);
        }
        
        // Phone validation
        if (field.type === 'tel') {
            const phoneRegex = /^[\d\s\-\(\)\+]+$/;
            return phoneRegex.test(value) && value.replace(/\D/g, '').length >= 10;
        }
        
        return true;
    };
    
    const showFieldError = (field) => {
        field.classList.add('error');
        let errorMsg = field.parentElement.querySelector('.error-message');
        
        if (!errorMsg) {
            errorMsg = document.createElement('span');
            errorMsg.className = 'error-message';
            field.parentElement.appendChild(errorMsg);
        }
        
        if (field.type === 'email') {
            errorMsg.textContent = 'Please enter a valid email address';
        } else if (field.type === 'tel') {
            errorMsg.textContent = 'Please enter a valid phone number';
        } else {
            errorMsg.textContent = 'This field is required';
        }
    };
    
    const clearFieldError = (field) => {
        field.classList.remove('error');
        const errorMsg = field.parentElement.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.remove();
        }
    };
    
    const showFormSuccess = (form) => {
        let successMsg = form.querySelector('.success-message');
        
        if (!successMsg) {
            successMsg = document.createElement('div');
            successMsg.className = 'success-message';
            successMsg.innerHTML = '<i class="fas fa-check-circle"></i> Thank you! We\'ll contact you shortly.';
            form.appendChild(successMsg);
        }
        
        successMsg.style.display = 'block';
    };
    
    const hideFormSuccess = (form) => {
        const successMsg = form.querySelector('.success-message');
        if (successMsg) {
            successMsg.style.display = 'none';
        }
    };

    // ==========================================
    // Payment Calculator
    // ==========================================
    const initPaymentCalculator = () => {
        const calculator = document.querySelector('.calculator-form');
        
        if (!calculator) return;
        
        const priceInput = document.getElementById('price');
        const downpaymentInput = document.getElementById('downpayment');
        const termSelect = document.getElementById('term');
        const rateInput = document.getElementById('rate');
        const paymentDisplay = document.getElementById('monthly-payment');
        
        const calculatePayment = () => {
            const price = parseFloat(priceInput.value) || 0;
            const downpayment = parseFloat(downpaymentInput.value) || 0;
            const principal = price - downpayment;
            const term = parseInt(termSelect.value) || 60;
            const rate = parseFloat(rateInput.value) || 0;
            
            if (principal <= 0) {
                paymentDisplay.textContent = '$0';
                return;
            }
            
            let monthlyPayment;
            
            if (rate === 0) {
                monthlyPayment = principal / term;
            } else {
                const monthlyRate = rate / 100 / 12;
                monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, term)) / 
                                (Math.pow(1 + monthlyRate, term) - 1);
            }
            
            paymentDisplay.textContent = '$' + Math.round(monthlyPayment).toLocaleString();
        };
        
        // Add event listeners
        [priceInput, downpaymentInput, termSelect, rateInput].forEach(input => {
            if (input) {
                input.addEventListener('input', calculatePayment);
                input.addEventListener('change', calculatePayment);
            }
        });
        
        // Initial calculation
        calculatePayment();
    };

    // ==========================================
    // Exit Intent Popup
    // ==========================================
    const initExitIntentPopup = () => {
        const popup = document.getElementById('exit-popup');
        const closeBtn = popup?.querySelector('.popup-close');
        let popupShown = false;
        
        if (!popup) return;
        
        // Show popup on exit intent
        document.addEventListener('mouseout', (e) => {
            if (!popupShown && e.clientY <= 0 && e.relatedTarget == null) {
                showPopup();
            }
        });
        
        // Also show on mobile after scrolling 50% and trying to go back
        let scrolled50 = false;
        window.addEventListener('scroll', () => {
            if (!scrolled50 && window.scrollY > document.body.scrollHeight * 0.5) {
                scrolled50 = true;
                
                // On mobile, show after a delay
                if (window.innerWidth < 768) {
                    setTimeout(() => {
                        if (!popupShown) {
                            showPopup();
                        }
                    }, 30000); // Show after 30 seconds
                }
            }
        });
        
        const showPopup = () => {
            popup.classList.add('active');
            popupShown = true;
            document.body.style.overflow = 'hidden';
            
            // Store in sessionStorage to not show again in this session
            sessionStorage.setItem('exitPopupShown', 'true');
        };
        
        const hidePopup = () => {
            popup.classList.remove('active');
            document.body.style.overflow = '';
        };
        
        // Close popup
        closeBtn?.addEventListener('click', hidePopup);
        
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                hidePopup();
            }
        });
        
        // Check if popup was already shown
        if (sessionStorage.getItem('exitPopupShown')) {
            popupShown = true;
        }
        
        // Handle popup form submission
        const popupForm = popup.querySelector('.popup-form');
        if (popupForm) {
            popupForm.addEventListener('submit', (e) => {
                // In production, let Netlify handle the form
                if (!popupForm.hasAttribute('data-netlify')) {
                    e.preventDefault();
                    hidePopup();
                    alert('Thank you! Check your email for your $500 discount code.');
                }
            });
        }
    };

    // ==========================================
    // Countdown Timer
    // ==========================================
    const initCountdownTimer = () => {
        const countdownElement = document.getElementById('countdown');
        
        if (!countdownElement) return;
        
        // Set end time to midnight
        const getEndTime = () => {
            const now = new Date();
            const endTime = new Date(now);
            endTime.setHours(23, 59, 59, 999);
            return endTime;
        };
        
        const updateCountdown = () => {
            const now = new Date().getTime();
            const endTime = getEndTime().getTime();
            const distance = endTime - now;
            
            if (distance < 0) {
                countdownElement.textContent = 'EXPIRED';
                return;
            }
            
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            countdownElement.textContent = 
                String(hours).padStart(2, '0') + ':' +
                String(minutes).padStart(2, '0') + ':' +
                String(seconds).padStart(2, '0');
        };
        
        // Update every second
        updateCountdown();
        setInterval(updateCountdown, 1000);
    };

    // ==========================================
    // Scroll Animations
    // ==========================================
    const initScrollAnimations = () => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe all sections and cards
        const elements = document.querySelectorAll(
            '.vehicle-card, .benefit-card, .testimonial-card, .section-header'
        );
        
        elements.forEach(element => {
            observer.observe(element);
        });
    };

    // ==========================================
    // Sticky Navigation
    // ==========================================
    const initStickyNav = () => {
        const navbar = document.querySelector('.navbar');
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scrolling down
                navbar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
        });
    };

    // ==========================================
    // Vehicle Card Interactions
    // ==========================================
    const initVehicleCards = () => {
        const vehicleCards = document.querySelectorAll('.vehicle-card');
        
        vehicleCards.forEach(card => {
            const button = card.querySelector('button');
            
            button?.addEventListener('click', () => {
                // Scroll to contact form
                const heroForm = document.querySelector('#hero');
                if (heroForm) {
                    heroForm.scrollIntoView({ behavior: 'smooth' });
                    
                    // Pre-fill interest field if possible
                    setTimeout(() => {
                        const interestField = document.querySelector('select[name="interest"]');
                        if (interestField) {
                            interestField.value = 'used';
                            interestField.focus();
                        }
                    }, 1000);
                }
            });
        });
    };

    // ==========================================
    // Add CSS for dynamic elements
    // ==========================================
    const addDynamicStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            .error-message {
                color: var(--danger-color);
                font-size: 0.875rem;
                margin-top: 0.25rem;
                display: block;
            }
            
            input.error, select.error, textarea.error {
                border-color: var(--danger-color) !important;
            }
            
            .success-message {
                background: var(--secondary-color);
                color: white;
                padding: 1rem;
                border-radius: 0.5rem;
                margin-top: 1rem;
                display: none;
                text-align: center;
                animation: slideUp 0.3s ease;
            }
            
            .nav-menu.active {
                display: flex !important;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                flex-direction: column;
                padding: 1rem;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            
            .hamburger.active span:nth-child(1) {
                transform: rotate(45deg) translate(5px, 5px);
            }
            
            .hamburger.active span:nth-child(2) {
                opacity: 0;
            }
            
            .hamburger.active span:nth-child(3) {
                transform: rotate(-45deg) translate(7px, -6px);
            }
            
            .navbar {
                transition: transform 0.3s ease;
            }
            
            @media (max-width: 767px) {
                .nav-menu {
                    display: none;
                }
            }
        `;
        document.head.appendChild(style);
    };

    // ==========================================
    // Initialize Everything
    // ==========================================
    const init = () => {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }
        
        // Add dynamic styles
        addDynamicStyles();
        
        // Initialize all features
        initMobileNav();
        initSmoothScroll();
        initFormValidation();
        initPaymentCalculator();
        initExitIntentPopup();
        initCountdownTimer();
        initScrollAnimations();
        initStickyNav();
        initVehicleCards();
        
        // Log successful initialization
        console.log('Premium Auto Sales - All systems initialized');
    };
    
    // Start the app
    init();
    
})();