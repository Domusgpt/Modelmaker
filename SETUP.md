# AI Model Studio - Setup Guide

## Quick Start

This is a professional clothing model marketplace that helps businesses generate AI models wearing their products.

### 🎯 Business Model

- **1 FREE** model generation (no credit card)
- **$1** = 5 models (perfect for testing)
- **$9** = 100 models (most popular)
- **$29** = 400 models (serious businesses)

### 🚀 Features

✅ **Freemium monetization** - 1 free credit to hook users
✅ **Stripe integration** - Professional payment processing
✅ **Credits system** - Track usage with localStorage (backend-ready)
✅ **Generation history** - Save and view past generations
✅ **Style presets** - 6 quick styles (Studio, Lifestyle, Outdoor, Editorial, E-commerce, Custom)
✅ **Intuitive UX** - Big-tech level polish, works for anyone

### 📦 Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.local.example .env.local

# Add your API keys to .env.local
# - GEMINI_API_KEY (required)
# - VITE_STRIPE_PUBLISHABLE_KEY (for payments)
# - Stripe Price IDs (for each tier)

# Run development server
npm run dev

# Build for production
npm run build
```

### 🔑 Environment Variables

Get your keys:

1. **Gemini API**: https://aistudio.google.com/app/apikey
2. **Stripe Keys**: https://dashboard.stripe.com/apikeys
3. **Create Stripe Products**: https://dashboard.stripe.com/products

Create products with these prices:
- Starter: $1 (5 credits)
- Pro: $9 (100 credits)
- Business: $29 (400 credits)

Copy the price IDs (price_xxxx) to your .env.local file.

### 💳 Stripe Backend Setup

The app is currently in "demo mode" for Stripe. To enable real payments:

1. Create a backend endpoint at `/api/create-checkout-session`
2. Use Stripe Checkout Sessions API
3. Handle webhook for successful payments
4. Award credits to user account

Example backend (Node.js):

```javascript
// POST /api/create-checkout-session
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.post('/api/create-checkout-session', async (req, res) => {
  const { priceId, tierId } = req.body;

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${YOUR_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${YOUR_DOMAIN}/`,
    metadata: { tierId },
  });

  res.json({ sessionId: session.id });
});

// Webhook to handle successful payment
app.post('/webhook', async (req, res) => {
  const event = req.body;

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const tierId = session.metadata.tierId;

    // Award credits to user based on tierId
    await awardCredits(session.customer_email, tierId);
  }

  res.json({ received: true });
});
```

### 🎨 Customization

**Style Presets** (`/components/StylePresets.tsx`):
- Add new presets by adding to the STYLE_PRESETS array
- Each preset has: id, name, description, prompt, icon

**Pricing Tiers** (`/config/pricing.ts`):
- Modify prices, credits, features
- Add new tiers as needed
- Current markup: 3-5x cost

### 🏗 Architecture

**Frontend**:
- React + TypeScript + Vite
- Tailwind CSS (CDN)
- Google Gemini 2.5 Flash (image generation)
- Stripe.js (payments)
- localStorage (credits, history)

**Backend Ready**:
- Credits service abstracted for easy backend integration
- Replace localStorage calls with API calls
- All functions in `/services/creditsService.ts`

### 📈 What Makes This Special

1. **Big Tech UX**: Works for everyone - boomers, agents, low-attention users
2. **Freemium Hook**: 1 free generation gets them addicted
3. **Profitable**: 3-5x markup on all tiers
4. **Professional**: Not "too simple" - businesses take it seriously
5. **Quick Wins**: Style presets make it dead simple
6. **Growth Ready**: Easy to add backend, user accounts, API access

### 🎯 Target Market

- Print-on-demand businesses
- E-commerce clothing stores
- Social media marketers
- Fashion startups
- Anyone who needs models wearing clothes

### 💰 Revenue Targets

Based on $0.02 per generation cost:

- 100 users/month at $9 Pro = $900 revenue, ~$180 costs = **$720 profit**
- 1,000 users/month at $9 Pro = $9,000 revenue, ~$1,800 costs = **$7,200 profit**
- 10,000 users/month = **$72,000/month profit**

---

**Built with Claude Code** 🚀
