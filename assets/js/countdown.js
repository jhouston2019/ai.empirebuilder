// Countdown Timer Implementation
// Creates a rolling 3-day countdown timer for pricing page

class CountdownTimer {
    constructor(containerId, days = 3) {
        this.container = document.getElementById(containerId);
        this.days = days;
        this.endTime = this.getEndTime();
        this.interval = null;
        this.init();
    }

    init() {
        if (!this.container) return;
        
        this.createCountdownHTML();
        this.startTimer();
    }

    getEndTime() {
        // Create a rolling 3-day countdown that resets every 3 days
        const now = new Date().getTime();
        const threeDays = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds
        
        // Calculate the next 3-day milestone
        const daysSinceEpoch = Math.floor(now / threeDays);
        return (daysSinceEpoch + 1) * threeDays;
    }

    createCountdownHTML() {
        this.container.innerHTML = `
            <div class="countdown">
                <div class="countdown-item">
                    <span class="countdown-number" id="days">00</span>
                    <span class="countdown-label">Days</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-number" id="hours">00</span>
                    <span class="countdown-label">Hours</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-number" id="minutes">00</span>
                    <span class="countdown-label">Minutes</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-number" id="seconds">00</span>
                    <span class="countdown-label">Seconds</span>
                </div>
            </div>
        `;
    }

    startTimer() {
        this.updateCountdown();
        this.interval = setInterval(() => {
            this.updateCountdown();
        }, 1000);
    }

    updateCountdown() {
        const now = new Date().getTime();
        const timeLeft = this.endTime - now;

        if (timeLeft <= 0) {
            // Reset countdown for next 3-day period
            this.endTime = this.getEndTime();
            this.updateCountdown();
            return;
        }

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        this.updateDisplay('days', days);
        this.updateDisplay('hours', hours);
        this.updateDisplay('minutes', minutes);
        this.updateDisplay('seconds', seconds);
    }

    updateDisplay(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value.toString().padStart(2, '0');
        }
    }

    destroy() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
}

// Initialize countdown timer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on pricing page
    if (window.location.pathname.includes('pricing')) {
        new CountdownTimer('countdown-timer');
    }
});
