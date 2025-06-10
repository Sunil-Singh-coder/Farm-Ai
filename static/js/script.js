// GSAP Registration
gsap.registerPlugin(ScrollTrigger);

// Custom Cursor - Improved smooth tracking
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let followerX = 0;
let followerY = 0;

// Track mouse position
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Smooth cursor animation using requestAnimationFrame
function animateCursor() {
    // Smooth interpolation for main cursor
    cursorX += (mouseX - cursorX) * 0.9;
    cursorY += (mouseY - cursorY) * 0.9;
    
    // Smooth interpolation for follower (slower)
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    
    // Apply transforms
    if (cursor) {
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
    }
    
    if (cursorFollower) {
        cursorFollower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;
    }
    
    requestAnimationFrame(animateCursor);
}

// Start cursor animation
animateCursor();

// Hide cursor on mobile and touch devices
function handleCursorVisibility() {
    const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window;
    
    if (isMobile) {
        if (cursor) cursor.style.display = 'none';
        if (cursorFollower) cursorFollower.style.display = 'none';
        document.body.style.cursor = 'auto';
    } else {
        if (cursor) cursor.style.display = 'block';
        if (cursorFollower) cursorFollower.style.display = 'block';
        document.body.style.cursor = 'none';
    }
}

// Initial check and resize handler
handleCursorVisibility();
window.addEventListener('resize', handleCursorVisibility);

// Cursor hover effects
document.addEventListener('mouseenter', (e) => {
    if (e.target.matches('button, a, .nav-link, .btn, .feature-card, .testimonial-card, .premium-card')) {
        gsap.to(cursor, { scale: 1.5, duration: 0.3 });
        gsap.to(cursorFollower, { scale: 1.2, duration: 0.3 });
    }
}, true);

document.addEventListener('mouseleave', (e) => {
    if (e.target.matches('button, a, .nav-link, .btn, .feature-card, .testimonial-card, .premium-card')) {
        gsap.to(cursor, { scale: 1, duration: 0.3 });
        gsap.to(cursorFollower, { scale: 1, duration: 0.3 });
    }
}, true);

// Smooth scrolling function
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        gsap.to(window, {
            duration: 1,
            scrollTo: element,
            ease: "power2.inOut"
        });
    }
}

// Navigation active state
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Throttled scroll handler for better performance
let ticking = false;
function updateOnScroll() {
    updateActiveNavLink();
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateOnScroll);
        ticking = true;
    }
});

// Counter Animation
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }
    
    updateCounter();
}

// Scroll Animations with GSAP
function initScrollAnimations() {
    // Fade in animations
    gsap.utils.toArray('.fade-in').forEach(element => {
        gsap.fromTo(element, 
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                scrollTrigger: {
                    trigger: element,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    // Counter animations
    gsap.utils.toArray('[data-count]').forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        
        ScrollTrigger.create({
            trigger: counter,
            start: "top 80%",
            onEnter: () => animateCounter(counter, target),
            once: true
        });
    });

    // Feature cards stagger animation
    gsap.fromTo('.feature-card', 
        { opacity: 0, y: 50, rotationX: -15 },
        {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 0.8,
            stagger: 0.2,
            scrollTrigger: {
                trigger: '.features-grid',
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
            }
        }
    );

    // Premium cards stagger animation
    gsap.fromTo('.premium-card', 
        { opacity: 0, y: 50, rotationX: -15 },
        {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 0.8,
            stagger: 0.2,
            scrollTrigger: {
                trigger: '.premium-grid',
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
            }
        }
    );
}

// Navbar scroll effect
function initNavbarEffects() {
    gsap.to('.nav', {
        backgroundColor: 'rgba(10, 10, 10, 0.95)',
        backdropFilter: 'blur(20px)',
        scrollTrigger: {
            trigger: 'body',
            start: 'top -100',
            end: 'bottom bottom',
            toggleActions: 'play none none reverse'
        }
    });
}

// Parallax effects
function initParallaxEffects() {
    gsap.utils.toArray('.shape').forEach((shape, index) => {
        gsap.to(shape, {
            y: -100 * (index + 1),
            rotation: 360,
            scrollTrigger: {
                trigger: shape.closest('section'),
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });
    });
}

// Tilt effect for cards
function initTiltEffect() {
    const tiltElements = document.querySelectorAll('[data-tilt]');
    
    tiltElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            gsap.to(cursor, { scale: 1.5, duration: 0.3 });
            gsap.to(cursorFollower, { scale: 1.2, duration: 0.3 });
        });
        
        element.addEventListener('mouseleave', () => {
            gsap.to(cursor, { scale: 1, duration: 0.3 });
            gsap.to(cursorFollower, { scale: 1, duration: 0.3 });
            gsap.to(element, {
                duration: 0.3,
                rotationX: 0,
                rotationY: 0,
                ease: "power2.out"
            });
        });
        
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            gsap.to(element, {
                duration: 0.3,
                rotationX: rotateX,
                rotationY: rotateY,
                transformPerspective: 1000,
                ease: "power2.out"
            });
        });
    });
}

// Form interactions
function initFormEffects() {
    const formInputs = document.querySelectorAll('.form-input');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            const line = this.nextElementSibling;
            if (line && line.classList.contains('form-line')) {
                gsap.to(line, { width: '100%', duration: 0.3 });
            }
        });
        
        input.addEventListener('blur', function() {
            const line = this.nextElementSibling;
            if (line && line.classList.contains('form-line')) {
                gsap.to(line, { width: '0%', duration: 0.3 });
            }
        });
    });
}

// Button hover effects
function initButtonEffects() {
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('mouseenter', function() {
            gsap.to(this, { 
                scale: 1.05, 
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        button.addEventListener('mouseleave', function() {
            gsap.to(this, { 
                scale: 1, 
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
}

// Mobile navigation toggle
function initMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
}

// Premium CTA button handlers
function initPremiumButtons() {
    // Premium trial button
    document.querySelectorAll('.btn-premium').forEach(button => {
        button.addEventListener('click', function() {
            // Animate button click
            gsap.to(this, {
                scale: 0.95,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                ease: "power2.inOut"
            });
            
            // Show premium trial message
            setTimeout(() => {
                alert('Premium trial signup would be implemented here! You would be redirected to the payment gateway.');
            }, 200);
        });
    });

    // Demo button
    document.querySelectorAll('.btn-demo').forEach(button => {
        button.addEventListener('click', function() {
            // Animate button click
            gsap.to(this, {
                scale: 0.95,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                ease: "power2.inOut"
            });
            
            // Show demo scheduling message
            setTimeout(() => {
                alert('Demo scheduling would be implemented here! You would be redirected to a calendar booking system.');
            }, 200);
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all effects
    initScrollAnimations();
    initNavbarEffects();
    initParallaxEffects();
    initTiltEffect();
    initFormEffects();
    initButtonEffects();
    initMobileNav();
    initPremiumButtons();

    // Add loading animation
    gsap.fromTo('body', 
        { opacity: 0 },
        { opacity: 1, duration: 1 }
    );

    // Hero text animation timeline
    const heroTl = gsap.timeline();
    
    heroTl.fromTo('.title-line', 
        { opacity: 0, y: 50 },
        { 
            opacity: 1, 
            y: 0, 
            duration: 0.8, 
            stagger: 0.2,
            ease: "power2.out"
        }
    )
    .fromTo('.hero-description', 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.4"
    )
    .fromTo('.hero-buttons', 
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.6 },
        "-=0.2"
    )
    .fromTo('.hero-visual', 
        { opacity: 0, scale: 0.8, rotationY: -45 },
        { opacity: 1, scale: 1, rotationY: 0, duration: 1 },
        "-=0.8"
    );

    // Scroll indicator animation
    gsap.to('.scroll-indicator', {
        y: 10,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
    });
});

// Smooth scroll for navigation links
// Smooth scroll and page transition for navigation links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        
        // Handle anchor links (e.g., #section-id)
        if (targetId.startsWith('#')) {
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: targetElement,
                    ease: "power2.inOut"
                });
            }
        } else {
            // Handle routes (e.g., /about, /contact)
            e.preventDefault();
            gsap.to('body', {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    window.location.href = targetId; // Navigate to the route after animation
                }
            });
        }
    });
});

// Form submission
document.querySelector('.form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Animate form submission
    gsap.to(this, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
    });
    
    // Show success message (you can replace this with actual form submission)
    setTimeout(() => {
        alert('Thank you for your interest! We will contact you soon to start your Farm AI journey.');
        this.reset();
    }, 200);
});

// Intersection Observer for scroll animations (fallback for older browsers)
if (!window.gsap) {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.fade-in, .slide-left, .slide-right').forEach(el => {
        observer.observe(el);
    });
}

console.log('Farm AI - Empowering farmers with AI technology 🌾🤖');


// Add to existing static/js/script.js
document.addEventListener('DOMContentLoaded', function() {
    // Login form validation
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            if (!email || !password) {
                e.preventDefault();
                alert('Please fill in all fields.');
            } else if (!/\S+@\S+\.\S+/.test(email)) {
                e.preventDefault();
                alert('Please enter a valid email address.');
            }
        });
    }

    // Signup form validation
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (!username || !email || !password || !confirmPassword) {
                e.preventDefault();
                alert('Please fill in all fields.');
            } else if (!/\S+@\S+\.\S+/.test(email)) {
                e.preventDefault();
                alert('Please enter a valid email address.');
            } else if (password !== confirmPassword) {
                e.preventDefault();
                alert('Passwords do not match.');
            } else if (password.length < 6) {
                e.preventDefault();
                alert('Password must be at least 6 characters long.');
            }
        });
    }
});

document.querySelector('.chat-submit')?.addEventListener('click', function () {
    const message = document.querySelector('.chat-area textarea').value;
    if (message.trim()) {
        alert('Message sent: ' + message); // Replace with AI chat logic
    } else {
        alert('Please enter a message');
    }
});

document.getElementById('login-form')?.addEventListener('submit', function (e) {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    if (!email.includes('@') || password.length < 6) {
        e.preventDefault();
        alert('Please enter a valid email and a password with at least 6 characters.');
    }
});

document.getElementById('signup-form')?.addEventListener('submit', function (e) {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    if (!username || !email.includes('@') || password.length < 6 || password !== confirmPassword) {
        e.preventDefault();
        alert('Please ensure all fields are filled, email is valid, password is at least 6 characters, and passwords match.');
    }
});

