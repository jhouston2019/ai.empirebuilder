// AI Empire Builder - Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.closest('.faq-item');
            const answer = this.nextElementSibling;
            const isActive = faqItem.classList.contains('active');
            
            // Close all other FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });

    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.card, .module-card, .testimonial, .section-title').forEach(el => {
        observer.observe(el);
    });

    // Sticky footer for pricing page
    const stickyFooter = document.querySelector('.sticky-footer');
    if (stickyFooter) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            
            if (scrollTop + windowHeight >= documentHeight - 100) {
                stickyFooter.classList.add('show');
            } else {
                stickyFooter.classList.remove('show');
            }
        });
    }

    // Form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = form.querySelector('input[type="email"]');
            if (email && !isValidEmail(email.value)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Handle form submission
            showNotification('Thank you! Check your email for next steps.', 'success');
            form.reset();
        });
    });

    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 1rem 2rem;
            border-radius: 6px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Add CSS for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});

// Confetti animation for thank you page
function createConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti';
    document.body.appendChild(confettiContainer);

    const colors = ['#d4af37', '#f1c44f', '#ffffff', '#0a0a0a'];
    
    for (let i = 0; i < 50; i++) {
        const confettiPiece = document.createElement('div');
        confettiPiece.className = 'confetti-piece';
        confettiPiece.style.left = Math.random() * 100 + '%';
        confettiPiece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confettiPiece.style.animationDelay = Math.random() * 3 + 's';
        confettiPiece.style.animationDuration = (Math.random() * 3 + 2) + 's';
        
        confettiContainer.appendChild(confettiPiece);
    }

    setTimeout(() => {
        document.body.removeChild(confettiContainer);
    }, 5000);
}

// Exit intent popup
function initExitIntent() {
    let exitIntentShown = false;
    
    document.addEventListener('mouseleave', function(e) {
        if (e.clientY <= 0 && !exitIntentShown) {
            showExitIntentPopup();
            exitIntentShown = true;
        }
    });

    // Also show after 20 seconds
    setTimeout(() => {
        if (!exitIntentShown) {
            showExitIntentPopup();
            exitIntentShown = true;
        }
    }, 20000);
}

function showExitIntentPopup() {
    const popup = document.createElement('div');
    popup.className = 'exit-intent-popup';
    popup.innerHTML = `
        <div class="popup-content">
            <button class="popup-close">&times;</button>
            <h3>Wait! Don't Miss Out</h3>
            <p>Get our FREE "AI Business Idea Vault" with 100+ validated tool concepts</p>
            <form class="popup-form">
                <input type="email" placeholder="Enter your email" required>
                <button type="submit" class="btn btn-primary">Get Free Vault</button>
            </form>
        </div>
    `;
    
    popup.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    const content = popup.querySelector('.popup-content');
    content.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 12px;
        text-align: center;
        max-width: 400px;
        position: relative;
        color: #0a0a0a;
    `;
    
    document.body.appendChild(popup);
    
    // Close popup
    popup.querySelector('.popup-close').addEventListener('click', () => {
        document.body.removeChild(popup);
    });
    
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            document.body.removeChild(popup);
        }
    });
    
    // Handle form submission
    popup.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = popup.querySelector('input[type="email"]').value;
        if (email) {
            showNotification('Thank you! Check your email for the AI Business Idea Vault.', 'success');
            document.body.removeChild(popup);
        }
    });
}

// Exit intent disabled site-wide per product decision
// Previously initialized here, but intentionally not invoking to avoid popups
