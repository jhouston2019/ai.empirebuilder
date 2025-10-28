// Exit Intent Popup Implementation
// Shows popup when user attempts to leave the page

class ExitIntentPopup {
    constructor() {
        this.popupShown = false;
        this.delay = 20000; // 20 seconds
        this.init();
    }

    init() {
        // Don't show on pricing or thank you pages
        if (this.shouldSkipPage()) return;

        this.setupMouseLeaveDetection();
        this.setupTimeDelay();
    }

    shouldSkipPage() {
        const skipPages = ['pricing', 'thankyou', 'checkout'];
        return skipPages.some(page => window.location.pathname.includes(page));
    }

    setupMouseLeaveDetection() {
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY <= 0 && !this.popupShown) {
                this.showPopup();
            }
        });
    }

    setupTimeDelay() {
        setTimeout(() => {
            if (!this.popupShown) {
                this.showPopup();
            }
        }, this.delay);
    }

    showPopup() {
        if (this.popupShown) return;
        this.popupShown = true;

        const popup = this.createPopup();
        document.body.appendChild(popup);
        this.animateIn(popup);
    }

    createPopup() {
        const popup = document.createElement('div');
        popup.className = 'exit-intent-popup';
        popup.innerHTML = `
            <div class="popup-overlay">
                <div class="popup-content">
                    <button class="popup-close" aria-label="Close popup">&times;</button>
                    <div class="popup-header">
                        <h3>Wait! Don't Miss Out</h3>
                        <p>Get our FREE "AI Business Idea Vault" with 100+ validated tool concepts</p>
                    </div>
                    <div class="popup-body">
                        <form class="popup-form">
                            <div class="form-group">
                                <input type="email" placeholder="Enter your email address" required>
                                <button type="submit" class="btn btn-primary">Get Free Vault</button>
                            </div>
                            <p class="popup-disclaimer">No spam. Unsubscribe anytime.</p>
                        </form>
                    </div>
                </div>
            </div>
        `;

        this.addPopupStyles();
        this.bindPopupEvents(popup);
        return popup;
    }

    addPopupStyles() {
        if (document.getElementById('exit-intent-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'exit-intent-styles';
        styles.textContent = `
            .exit-intent-popup {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            }

            .popup-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 2rem;
            }

            .popup-content {
                background: white;
                border-radius: 12px;
                padding: 2rem;
                max-width: 500px;
                width: 100%;
                position: relative;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: slideInUp 0.3s ease;
            }

            .popup-close {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #666;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.3s ease;
            }

            .popup-close:hover {
                background: #f0f0f0;
                color: #333;
            }

            .popup-header {
                text-align: center;
                margin-bottom: 2rem;
            }

            .popup-header h3 {
                color: #0a0a0a;
                margin-bottom: 1rem;
                font-size: 1.5rem;
            }

            .popup-header p {
                color: #666;
                font-size: 1rem;
                line-height: 1.5;
            }

            .form-group {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }

            .form-group input {
                padding: 12px 16px;
                border: 2px solid #e0e0e0;
                border-radius: 6px;
                font-size: 1rem;
                transition: border-color 0.3s ease;
            }

            .form-group input:focus {
                outline: none;
                border-color: #d4af37;
            }

            .popup-disclaimer {
                text-align: center;
                font-size: 0.8rem;
                color: #999;
                margin-top: 1rem;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes slideInUp {
                from { 
                    opacity: 0;
                    transform: translateY(30px);
                }
                to { 
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @media (max-width: 480px) {
                .popup-content {
                    padding: 1.5rem;
                    margin: 1rem;
                }
                
                .form-group {
                    flex-direction: column;
                }
            }
        `;
        document.head.appendChild(styles);
    }

    bindPopupEvents(popup) {
        const closeBtn = popup.querySelector('.popup-close');
        const form = popup.querySelector('.popup-form');
        const overlay = popup.querySelector('.popup-overlay');

        // Close button
        closeBtn.addEventListener('click', () => {
            this.closePopup(popup);
        });

        // Click outside to close
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.closePopup(popup);
            }
        }

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = form.querySelector('input[type="email"]').value;
            
            if (this.isValidEmail(email)) {
                this.handleFormSubmission(email);
                this.closePopup(popup);
            } else {
                this.showError('Please enter a valid email address');
            }
        });

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closePopup(popup);
            }
        });
    }

    closePopup(popup) {
        popup.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            if (popup.parentNode) {
                popup.parentNode.removeChild(popup);
            }
        }, 300);
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    handleFormSubmission(email) {
        // Here you would typically send the email to your backend
        console.log('Email submitted:', email);
        
        // Show success message
        this.showSuccess('Thank you! Check your email for the AI Business Idea Vault.');
        
        // Track conversion (if analytics is available)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'conversion', {
                'event_category': 'exit_intent',
                'event_label': 'ai_business_idea_vault'
            });
        }
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            padding: 1rem 2rem;
            border-radius: 6px;
            z-index: 10001;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize exit intent popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ExitIntentPopup();
});
