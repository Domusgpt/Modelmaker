// Pricing tiers for AI Model Studio
// Cost per generation: ~$0.02, targeting 3-5x markup

export interface PricingTier {
  id: string;
  name: string;
  price: number; // in dollars
  credits: number;
  pricePerCredit: number;
  popular?: boolean;
  stripePriceId?: string; // Add your Stripe price IDs here
  features: string[];
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'free',
    name: 'Try It Free',
    price: 0,
    credits: 1,
    pricePerCredit: 0,
    stripePriceId: undefined, // No Stripe for free tier
    features: [
      '1 free model generation',
      'HD image download',
      'No credit card required',
      'See if it works for you',
    ],
  },
  {
    id: 'starter',
    name: 'Starter Pack',
    price: 1,
    credits: 5,
    pricePerCredit: 0.20,
    stripePriceId: process.env.VITE_STRIPE_PRICE_STARTER, // $1 for 5 credits
    features: [
      '5 model generations',
      'HD downloads',
      'Perfect for testing',
      'Commercial usage rights',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9,
    credits: 100,
    pricePerCredit: 0.09,
    popular: true,
    stripePriceId: process.env.VITE_STRIPE_PRICE_PRO, // $9 for 100 credits
    features: [
      '100 model generations',
      'HD downloads',
      'Priority generation',
      'Commercial usage rights',
      'Email support',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    price: 29,
    credits: 400,
    pricePerCredit: 0.07,
    stripePriceId: process.env.VITE_STRIPE_PRICE_BUSINESS, // $29 for 400 credits
    features: [
      '400 model generations',
      'HD downloads',
      'Priority generation',
      'Commercial usage rights',
      'Email support',
      'Bulk processing',
    ],
  },
];

export const FREE_CREDITS = 1; // One free generation to hook users
export const MIN_CREDITS_TO_GENERATE = 1;
