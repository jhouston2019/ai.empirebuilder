# AI Empire Builder Website

A high-conversion, production-ready multi-page website for selling the "MicroSaaS Empire Blueprint" course.

## 🎯 Overview

This website is designed to sell and deliver the "MicroSaaS Empire Blueprint" course ($297 one-time payment) with a professional black/gold/white theme and premium user experience.

## 📁 Site Structure

```
/public/
├── index.html                    → Landing / Sales page
├── course-overview.html          → Full TOC with course content
├── pricing.html                  → Pricing + Checkout (Stripe)
├── thankyou.html                 → Post-purchase success page
├── /modules/                     → 6 individual module pages
│   ├── module1-foundation.html
│   ├── module2-planning.html
│   ├── module3-building.html
│   ├── module4-monetization.html
│   ├── module5-traffic.html
│   └── module6-scaling.html
├── /legal/                       → Legal pages
│   ├── privacy.html
│   ├── terms.html
│   └── refund.html
└── /assets/                      → Static assets
    ├── style.css                 → Main stylesheet
    ├── script.js                 → Main JavaScript
    ├── /js/                      → Additional JS files
    │   ├── smooth-scroll.js
    │   ├── countdown.js
    │   └── exit-intent.js
    └── /images/                  → Images and icons
        ├── favicon.png
        ├── hero-bg.jpg
        ├── logo.png
        ├── og-image.jpg
        └── /module-icons/
            ├── m1.png ... m6.png
```

## 🎨 Design System

- **Colors**: Black (#0a0a0a), Gold (#d4af37), White (#ffffff)
- **Typography**: Inter for headings, Georgia for body text
- **Responsive**: Mobile-first design with breakpoints
- **Theme**: Premium, conversion-focused aesthetic

## ⚡ Features

### Core Functionality
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Smooth scrolling navigation
- ✅ Mobile menu toggle
- ✅ FAQ accordion
- ✅ Form validation
- ✅ Scroll animations
- ✅ Exit-intent popup
- ✅ Countdown timer (pricing page)
- ✅ Confetti animation (thank you page)

### SEO & Performance
- ✅ Meta tags for all pages
- ✅ Open Graph tags
- ✅ Canonical URLs
- ✅ Semantic HTML structure
- ✅ Optimized CSS/JS
- ✅ Fast loading times

### Conversion Features
- ✅ Multiple CTAs throughout site
- ✅ Social proof and testimonials
- ✅ Pricing psychology
- ✅ Urgency (countdown timer)
- ✅ Risk reversal (30-day guarantee)
- ✅ Clear value proposition

## 🚀 Getting Started

1. **Local Development**: Open `index.html` in a web browser
2. **Production**: Upload all files to your web server
3. **Stripe Integration**: Replace placeholder Stripe URL with your actual checkout link
4. **Images**: Replace placeholder images with actual assets
5. **Content**: Update any placeholder content as needed

## 📱 Pages Overview

### Landing Page (`index.html`)
- Hero section with gradient background
- "Why This Works" features section
- Module preview grid
- Testimonials and social proof
- Bonuses section
- Pricing snapshot with CTA

### Course Overview (`course-overview.html`)
- Complete table of contents
- 6 modules with detailed lesson breakdowns
- Workbook exercises
- Course progression path
- Success metrics

### Pricing Page (`pricing.html`)
- $297 one-time pricing
- Stripe checkout integration
- Countdown timer
- FAQ section
- Sticky footer CTA

### Module Pages (6 total)
- Consistent template design
- Lesson content and videos
- Workbook downloads
- Progress tracking
- Navigation between modules

### Thank You Page (`thankyou.html`)
- Purchase confirmation
- Next steps guidance
- Bonus resource downloads
- Community access
- Confetti animation

### Legal Pages
- Privacy Policy
- Terms of Service
- Refund Policy (30-day guarantee)

## 🔧 Customization

### Colors
Update CSS variables in `style.css`:
```css
:root {
    --primary-bg: #0a0a0a;
    --accent-gold: #d4af37;
    --accent-gold-hover: #f1c44f;
}
```

### Content
- Update course content in module pages
- Modify testimonials and social proof
- Adjust pricing and offers
- Update contact information

### Images
Replace placeholder images:
- `hero-bg.jpg` - Hero section background
- `logo.png` - Site logo
- `favicon.png` - Browser favicon
- `og-image.jpg` - Social media sharing
- Module icons in `/module-icons/`

## 📊 Analytics & Tracking

The site is ready for:
- Google Analytics
- Facebook Pixel
- Conversion tracking
- A/B testing

## 🛡️ Security & Performance

- No external dependencies (except Google Fonts)
- Optimized CSS/JS
- Semantic HTML
- Accessible design
- Fast loading times
- Mobile-optimized

## 📞 Support

For technical support or questions:
- Email: support@aiempirebuilder.pro
- Documentation: This README file

## 📄 License

© 2024 AI Empire Builder. All rights reserved.

---

**Ready to launch your AI empire!** 🚀
