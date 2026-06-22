/**
 * AURELIA FINE DINING - INTERACTIVE LOGIC
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollHeader();
    initMobileNav();
    initScrollReveal();
    initActiveNavLinks();
    initMenuFilter();
    initReservationForm();
});

/**
 * 1. Fixed Header Background Transition on Scroll
 */
function initScrollHeader() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/**
 * 2. Mobile Drawer Navigation Toggle
 */
function initMobileNav() {
    const header = document.querySelector('.header');
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelectorAll('.nav-link');
    
    menuBtn.addEventListener('click', () => {
        header.classList.toggle('nav-open');
    });
    
    // Close mobile nav when clicking any nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            header.classList.remove('nav-open');
        });
    });
}

/**
 * 3. Scroll Reveal Animations (Intersection Observer)
 */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Reveal once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });
    
    reveals.forEach(el => revealObserver.observe(el));
}

/**
 * 4. Active Navigation State Highlight on Scroll
 */
function initActiveNavLinks() {
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '-80px 0px -40% 0px'
    });
    
    sections.forEach(sec => navObserver.observe(sec));
}

/**
 * 5. Menu Dish Category Filter
 */
function initMenuFilter() {
    const tabBtns = document.querySelectorAll('.menu-tab-btn');
    const menuCards = document.querySelectorAll('.menu-card');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all tabs
            tabBtns.forEach(b => b.classList.remove('active'));
            // Add active to clicked tab
            btn.classList.add('active');
            
            const category = btn.getAttribute('data-filter');
            
            menuCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                // Card transitions
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95) translateY(10px)';
                
                setTimeout(() => {
                    if (category === 'all' || cardCategory === category) {
                        card.style.display = 'flex';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1) translateY(0)';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                }, 300);
            });
        });
    });
}

/**
 * 6. Reservation Form Handler & Validation
 */
function initReservationForm() {
    const form = document.getElementById('bookingForm');
    const modal = document.getElementById('successModal');
    const modalClose = document.getElementById('closeModalBtn');
    
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        
        // Input Validations
        const nameInput = document.getElementById('resName');
        const emailInput = document.getElementById('resEmail');
        const phoneInput = document.getElementById('resPhone');
        const dateInput = document.getElementById('resDate');
        const timeInput = document.getElementById('resTime');
        const guestsInput = document.getElementById('resGuests');
        
        // Clean previous errors
        clearErrors([nameInput, emailInput, phoneInput, dateInput, timeInput, guestsInput]);
        
        // Name check
        if (nameInput.value.trim() === '') {
            setError(nameInput, 'Name is required');
            isValid = false;
        }
        
        // Email check
        if (emailInput.value.trim() === '') {
            setError(emailInput, 'Email is required');
            isValid = false;
        } else if (!validateEmail(emailInput.value.trim())) {
            setError(emailInput, 'Please enter a valid email address');
            isValid = false;
        }
        
        // Phone check
        if (phoneInput.value.trim() === '') {
            setError(phoneInput, 'Phone number is required');
            isValid = false;
        } else if (!validatePhone(phoneInput.value.trim())) {
            setError(phoneInput, 'Enter a valid 10-digit phone number');
            isValid = false;
        }
        
        // Date check
        if (dateInput.value === '') {
            setError(dateInput, 'Please pick a date');
            isValid = false;
        }
        
        // Time check
        if (timeInput.value === '') {
            setError(timeInput, 'Please pick a time');
            isValid = false;
        }
        
        // Guests check
        if (guestsInput.value === '') {
            setError(guestsInput, 'Please select number of guests');
            isValid = false;
        }
        
        if (isValid) {
            // Form is valid - display reservation confirmation summary inside modal
            const summaryText = `Your reservation for ${guestsInput.value} guests on ${formatDate(dateInput.value)} at ${timeInput.value} is confirmed. A verification email has been sent to ${emailInput.value}.`;
            document.getElementById('modalSummaryText').innerText = summaryText;
            
            // Trigger Modal Opening
            modal.classList.add('active');
            
            // Reset fields
            form.reset();
        }
    });
    
    // Close Modal Button
    modalClose.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    // Close Modal on clicking backdrop overlay
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('remove');
        }
    });
}

function setError(inputElement, errorMessage) {
    inputElement.classList.add('error');
    
    const errorSpan = document.createElement('span');
    errorSpan.className = 'form-error-msg';
    errorSpan.innerText = errorMessage;
    
    inputElement.parentElement.appendChild(errorSpan);
}

function clearErrors(inputElements) {
    inputElements.forEach(input => {
        input.classList.remove('error');
        const errorSpan = input.parentElement.querySelector('.form-error-msg');
        if (errorSpan) {
            errorSpan.remove();
        }
    });
}

function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^\+?[0-9\s-]{7,15}$/;
    return re.test(phone);
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}
