// Navigation active state management
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Hamburger menu functionality
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navLinksContainer = document.querySelector('.nav-links');
    const body = document.body;
    
    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    body.appendChild(overlay);
    
    // Toggle hamburger menu
    function toggleHamburgerMenu() {
        hamburgerMenu.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
        overlay.classList.toggle('active');
        body.style.overflow = navLinksContainer.classList.contains('active') ? 'hidden' : '';
    }
    
    // Close hamburger menu
    function closeHamburgerMenu() {
        hamburgerMenu.classList.remove('active');
        navLinksContainer.classList.remove('active');
        overlay.classList.remove('active');
        body.style.overflow = '';
    }
    
    // Event listeners for hamburger menu
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', toggleHamburgerMenu);
    }
    
    // Close menu when clicking overlay
    overlay.addEventListener('click', closeHamburgerMenu);
    
    // Close menu when clicking on a nav link (mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 750) {
                closeHamburgerMenu();
            }
        });
    });
    
    // Close menu on window resize if screen becomes larger
    window.addEventListener('resize', function() {
        if (window.innerWidth > 750) {
            closeHamburgerMenu();
        }
    });
    
    // Function to update active nav link
    function updateActiveNavLink() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
        
        // If at the very top, activate home
        if (window.pageYOffset < 100) {
            navLinks.forEach(link => link.classList.remove('active'));
            const homeLink = document.querySelector('a[href="#home"]');
            if (homeLink) {
                homeLink.classList.add('active');
            }
        }
    }
    
    // Update active link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
    
    // Update active link on page load
    updateActiveNavLink();
    
    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);
    
    // Observe elements for animations
    const animatedElements = document.querySelectorAll('.research-card, .team-member, .resource-card');
    animatedElements.forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });
    
    // Add click animation to research cards
    const researchCards = document.querySelectorAll('.research-card');
    researchCards.forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'translateY(-8px) scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Add typing effect to events section
    const eventText = document.querySelector('.event-card p');
    if (eventText) {
        const originalText = eventText.textContent;
        eventText.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < originalText.length) {
                eventText.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };
        
        // Start typing when section is visible
        const eventObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(typeWriter, 500);
                    eventObserver.unobserve(entry.target);
                }
            });
        });
        
        eventObserver.observe(document.querySelector('.events'));
    }
    
    // Add pulse effect to CTA button periodically
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        setInterval(() => {
            ctaButton.style.animation = 'none';
            setTimeout(() => {
                ctaButton.style.animation = 'pulse 0.6s ease-in-out';
            }, 10);
        }, 5000);
    }
});

// Add pulse animation for CTA button
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);