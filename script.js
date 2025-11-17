// Hamburger Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menu when hamburger is clicked
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close menu when a nav link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.nav-container')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
});

// Network Animation Canvas
class NetworkAnimation {
    constructor() {
        this.canvas = document.getElementById('networkCanvas');
        this.ctx = this.canvas.getContext('2d', { alpha: true, antialias: false });
        this.nodes = [];
        this.connections = [];
        this.mousePos = { x: 0, y: 0 };
        this.isMobile = window.innerWidth <= 768;
        this.resizeTimeout = null;
        
        this.init();
        this.setupEventListeners();
        
        if (!this.isMobile) {
            // Desktop: run continuous animation
            this.lastFrameTime = 0;
            this.targetFPS = 60;
            this.frameInterval = 1000 / this.targetFPS;
            this.animate();
        } else {
            // Mobile: draw static frame only
            this.resizeCanvas();
            this.createNodes();
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.drawConnections();
            this.drawNodes();
        }
    }
    
    init() {
        this.resizeCanvas();
        this.createNodes();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createNodes() {
        const nodeCount = this.isMobile ? 15 : 50;
        this.nodes = [];
        
        for (let i = 0; i < nodeCount; i++) {
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                radius: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.4 + 0.15
            });
        }
    }
    
    updateNodes() {
        this.nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;
            
            // Wrap around screen edges
            if (node.x < 0) node.x = this.canvas.width;
            if (node.x > this.canvas.width) node.x = 0;
            if (node.y < 0) node.y = this.canvas.height;
            if (node.y > this.canvas.height) node.y = 0;
        });
    }
    
    drawNodes() {
        this.nodes.forEach(node => {
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            this.ctx.fillStyle =  `rgba(0, 255, 0, ${node.opacity})`;
            this.ctx.fill();
        });
    }
    
    drawConnections() {
        const maxDistance = 150;
        
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const dx = this.nodes[i].x - this.nodes[j].x;
                const dy = this.nodes[i].y - this.nodes[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    const opacity = (1 - distance / maxDistance) * 0.3;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.nodes[i].x, this.nodes[i].y);
                    this.ctx.lineTo(this.nodes[j].x, this.nodes[j].y);
                    this.ctx.strokeStyle = `rgba(0, 255, 0, ${opacity})`;
                    this.ctx.stroke();
                }
            }
        }
    }
    
    animate() {
        requestAnimationFrame((currentTime) => {
            const elapsed = currentTime - this.lastFrameTime;
            
            // Only update on desktop at 60 FPS
            if (elapsed >= this.frameInterval) {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.updateNodes();
                this.drawConnections();
                this.drawNodes();
                this.lastFrameTime = currentTime;
            }
            
            this.animate();
        });
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                if (!this.isMobile) {
                    this.resizeCanvas();
                }
            }, 250);
        });
        
        window.addEventListener('mousemove', (e) => {
            this.mousePos.x = e.clientX;
            this.mousePos.y = e.clientY;
        });
    }
}

// Smooth Scrolling for Navigation
class SmoothScrolling {
    constructor() {
        this.init();
    }
    
    init() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', this.handleClick.bind(this));
        });
        
        // Also handle hero buttons
        const heroButtons = document.querySelectorAll('.hero-buttons a');
        heroButtons.forEach(button => {
            button.addEventListener('click', this.handleClick.bind(this));
        });
    }
    
    handleClick(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const headerHeight = 80; // Fixed header height
            const targetPosition = targetSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
}

// Navigation Highlight on Scroll
class NavigationHighlight {
    constructor() {
        this.sections = document.querySelectorAll('section[id]');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => this.highlightNavigation());
        this.highlightNavigation(); // Initial call
    }
    
    highlightNavigation() {
        const scrollPosition = window.scrollY + 100;
        
        let currentSection = '';
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
}

// Skill Bar Animation
class SkillAnimation {
    constructor() {
        this.skillBars = document.querySelectorAll('.skill-progress');
        this.skillsSection = document.querySelector('.skills-section');
        this.animated = false;
        this.init();
    }
    
    init() {
        this.setupIntersectionObserver();
    }
    
    setupIntersectionObserver() {
        const options = {
            threshold: 0.5,
            rootMargin: '0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated) {
                    this.animateSkills();
                    this.animated = true;
                }
            });
        }, options);
        
        if (this.skillsSection) {
            observer.observe(this.skillsSection);
        }
    }
    
    animateSkills() {
        this.skillBars.forEach(bar => {
            const progress = bar.getAttribute('data-progress');
            bar.style.setProperty('--progress-width', `${progress}%`);
            
            // Add animation delay for staggered effect
            setTimeout(() => {
                bar.style.width = `${progress}%`;
            }, Math.random() * 500);
        });
    }
}

// Contact Form Handler
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }
    
    init() {
        if (this.form) {
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
        }
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            mobile: formData.get('mobile'),
            message: formData.get('message')
        };
        
        // Show loading state
        const submitButton = this.form.querySelector('.form-submit');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;
        
        try {
            // Create email content
            const emailContent = `
New Contact Form Submission:

Name: ${data.name}
Email: ${data.email}
Mobile: ${data.mobile}

Message:
${data.message}

---
Sent from Takudzwa Mutepfa's Portfolio Website
            `.trim();
            
            // Create mailto link
            const mailtoLink = `mailto:mutepfat586@gmail.com?subject=Portfolio Contact: ${data.name}&body=${encodeURIComponent(emailContent)}`;
            
            // Open email client
            window.location.href = mailtoLink;
            
            // Show success message
            this.showMessage('Thank you! Your message has been prepared in your email client.', 'success');
            this.form.reset();
            
        } catch (error) {
            console.error('Error:', error);
            this.showMessage('Sorry, there was an error. Please try again or email directly.', 'error');
        } finally {
            // Restore button
            setTimeout(() => {
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }, 2000);
        }
    }
    
    showMessage(text, type) {
        // Remove existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message
        const message = document.createElement('div');
        message.className = `form-message ${type}`;
        message.textContent = text;
        
        // Style the message
        message.style.cssText = `
            padding: 1rem;
            margin-top: 1rem;
            border-radius: 8px;
            text-align: center;
            font-weight: 500;
            background: ${type === 'success' ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 68, 68, 0.1)'};
            border: 1px solid ${type === 'success' ? 'var(--accent-color)' : 'var(--secondary-color)'};
            color: ${type === 'success' ? 'var(--accent-color)' : 'var(--secondary-color)'};
        `;
        
        // Add to form
        this.form.appendChild(message);
        
        // Remove after 5 seconds
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 5000);
    }
}

// Scroll Animations
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }
    
    init() {
        this.setupIntersectionObserver();
    }
    
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, this.observerOptions);
        
        // Observe elements for animation
        const animatedElements = document.querySelectorAll(`
            .about-content > *,
            .skill-category,
            .project-card,
            .contact-content > *
        `);
        
        animatedElements.forEach((el, index) => {
            el.style.animationDelay = `${index * 0.1}s`;
            observer.observe(el);
        });
    }
}

// Header Background on Scroll
class HeaderScroll {
    constructor() {
        this.header = document.querySelector('.header');
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY > 50;
            
            if (scrolled) {
                this.header.style.background = 'rgba(10, 10, 15, 0.98)';
                this.header.style.backdropFilter = 'blur(30px)';
            } else {
                this.header.style.background = 'rgba(10, 10, 15, 0.95)';
                this.header.style.backdropFilter = 'blur(20px)';
            }
        });
    }
}

// Mobile Navigation (if needed for smaller screens)
class MobileNavigation {
    constructor() {
        this.init();
    }
    
    init() {
        // Add mobile menu functionality if needed
        this.handleMobileResize();
        window.addEventListener('resize', () => this.handleMobileResize());
    }
    
    handleMobileResize() {
        const isMobile = window.innerWidth <= 768;
        const navMenu = document.querySelector('.nav-menu');
        
        if (isMobile) {
            // Mobile-specific adjustments
            navMenu.style.flexWrap = 'wrap';
            navMenu.style.justifyContent = 'center';
        } else {
            navMenu.style.flexWrap = 'nowrap';
            navMenu.style.justifyContent = 'flex-start';
        }
    }
}

// Typing Animation for Hero Section
class TypingAnimation {
    constructor() {
        this.subtitleElement = document.querySelector('.hero-subtitle');
        this.titles = [
            'Telecommunication Engineer',
            'Electrical Technician',
            'Web Developer',
            'Project Management'
        ];
        this.currentIndex = 0;
        this.currentText = '';
        this.isDeleting = false;
        this.typeSpeed = 100;
        this.deleteSpeed = 50;
        this.pauseTime = 2000;
        
        this.init();
    }
    
    init() {
        if (this.subtitleElement) {
            setTimeout(() => this.type(), 1000);
        }
    }
    
    type() {
        const fullText = this.titles[this.currentIndex];
        
        if (this.isDeleting) {
            this.currentText = fullText.substring(0, this.currentText.length - 1);
        } else {
            this.currentText = fullText.substring(0, this.currentText.length + 1);
        }
        
        this.subtitleElement.textContent = this.currentText;
        
        let typeTimeout = this.isDeleting ? this.deleteSpeed : this.typeSpeed;
        
        if (!this.isDeleting && this.currentText === fullText) {
            typeTimeout = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentText === '') {
            this.isDeleting = false;
            this.currentIndex = (this.currentIndex + 1) % this.titles.length;
        }
        
        setTimeout(() => this.type(), typeTimeout);
    }
}

// Performance Optimization
class PerformanceOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        // Lazy load images
        this.setupLazyLoading();
        
        // Debounce scroll events
        this.debounceScrollEvents();
    }
    
    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    debounceScrollEvents() {
        let ticking = false;
        
        function updateScrollElements() {
            // Scroll-dependent updates here
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateScrollElements);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick, { passive: true });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new NetworkAnimation();
    new SmoothScrolling();
    new NavigationHighlight();
    new SkillAnimation();
    new ContactForm();
    new ScrollAnimations();
    new HeaderScroll();
    new MobileNavigation();
    new TypingAnimation();
    new PerformanceOptimizer();
    
    // Add loading animation end
    document.body.classList.add('loaded');
    
    console.log('🚀 Takudzwa Mutepfa Portfolio - All systems working perfectly!');
});

// Add CSS for active navigation state
const additionalStyles = `
.nav-link.active {
    color: var(--secondary-color) !important;
    background: rgba(255, 68, 68, 0.1);
}

.nav-link.active::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 1rem;
    right: 1rem;
    height: 2px;
    background: var(--secondary-color);
}

body.loaded {
    opacity: 1;
}

body {
    opacity: 0;
    transition: opacity 0.3s ease;
}
`;

// Add the styles to the document
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
