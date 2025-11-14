import React from 'react';
import { PRICING_TIERS } from '../config/pricing';
import { loadStripe } from '@stripe/stripe-js';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCredits: number;
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, currentCredits }) => {
  const [loading, setLoading] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handlePurchase = async (tierId: string, stripePriceId?: string) => {
    if (tierId === 'free') {
      // Free tier - just close modal
      onClose();
      return;
    }

    if (!stripePriceId) {
      alert('Payment configuration not set up yet. Please contact support.');
      return;
    }

    setLoading(tierId);

    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      // Call your backend to create checkout session
      // For now, we'll show a placeholder
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: stripePriceId,
          tierId,
        }),
      });

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({ sessionId });

      if (result.error) {
        alert(result.error.message);
      }
    } catch (error) {
      console.error('Checkout error:', error);

      // For demo purposes - simulate adding credits
      if (confirm('Demo mode: This would normally redirect to Stripe. Simulate purchase?')) {
        const tier = PRICING_TIERS.find(t => t.id === tierId);
        if (tier) {
          // Import and use credits service
          const { addCredits } = await import('../services/creditsService');
          addCredits(tier.credits);
          alert(`✓ Demo: Added ${tier.credits} credits to your account!`);
          window.location.reload(); // Refresh to show new credits
        }
      }
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Choose Your Plan</h2>
              <p className="text-indigo-100 mt-1">Professional model photos at unbeatable prices</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Current Credits Display */}
          <div className="mt-4 bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Current Balance: {currentCredits} {currentCredits === 1 ? 'credit' : 'credits'}</span>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.id}
                className={`relative rounded-xl border-2 p-6 transition-all hover:shadow-xl ${
                  tier.popular
                    ? 'border-indigo-500 bg-indigo-50 scale-105'
                    : 'border-gray-200 bg-white hover:border-indigo-300'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1 rounded-full text-xs font-bold">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-gray-900">${tier.price}</span>
                    {tier.price > 0 && <span className="text-gray-500 text-sm">one-time</span>}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {tier.credits} {tier.credits === 1 ? 'generation' : 'generations'}
                  </p>
                  {tier.price > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      ${tier.pricePerCredit.toFixed(2)} per image
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePurchase(tier.id, tier.stripePriceId)}
                  disabled={loading !== null || (tier.id === 'free' && currentCredits > 0)}
                  className={`w-full py-3 px-4 rounded-xl font-semibold transition-all ${
                    tier.popular
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg disabled:opacity-50'
                      : 'bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50'
                  }`}
                >
                  {loading === tier.id ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : tier.id === 'free' ? (
                    currentCredits > 0 ? 'Already claimed' : 'Start Free'
                  ) : (
                    `Get ${tier.credits} Credits`
                  )}
                </button>

                {tier.id === 'starter' && (
                  <p className="text-center text-xs text-gray-500 mt-3">
                    Perfect for trying it out!
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Value Props */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-center text-xl font-bold text-gray-900 mb-6">
              Why businesses choose AI Model Studio
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">10x Faster</h4>
                <p className="text-sm text-gray-600">Generate in seconds, not hours of photoshoot</p>
              </div>
              <div>
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">100x Cheaper</h4>
                <p className="text-sm text-gray-600">Professional photos at fraction of photoshoot cost</p>
              </div>
              <div>
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Commercial Rights</h4>
                <p className="text-sm text-gray-600">Use anywhere - ads, social media, print-on-demand</p>
              </div>
            </div>
          </div>

          {/* Trust Signals */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Secure payment by Stripe • Instant credit delivery • 100% commercial usage rights
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
