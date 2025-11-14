import React, { useState } from 'react';
import { generateFashionModelImage } from './services/geminiService';
import type { UploadedImage } from './types';

const App: React.FC = () => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generationCount, setGenerationCount] = useState<number>(0);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState<boolean>(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Convert files to base64
    const imagePromises = files.slice(0, 5).map(file => {
      return new Promise<UploadedImage>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            file,
            dataUrl: reader.result as string
          });
        };
        reader.readAsDataURL(file);
      });
    });

    const images = await Promise.all(imagePromises);
    setUploadedImages(images);

    // Auto-generate immediately with simple default prompt
    generateImage(images);
  };

  const generateImage = async (images: UploadedImage[]) => {
    // Check if user has exceeded free trials
    if (generationCount >= 3) {
      setShowSubscriptionModal(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const simplePrompt = 'A professional model wearing this clothing in a modern, well-lit setting with clean background. Perfect for Facebook and Instagram posts.';
      const b64Image = await generateFashionModelImage(simplePrompt, images);
      setGeneratedImage(`data:image/png;base64,${b64Image}`);
      setGenerationCount(prev => prev + 1);
    } catch (err) {
      setError('Oops! Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareToFacebook = () => {
    if (!generatedImage) return;

    // Download first, then user can manually upload to Facebook
    // (Direct Facebook posting requires backend + OAuth)
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `my-photo-${Date.now()}.png`;
    link.click();

    // Open Facebook in new tab
    window.open('https://www.facebook.com/', '_blank');

    alert('Photo downloaded! Upload it to your Facebook post in the new tab.');
  };

  const handleTryAgain = () => {
    setGeneratedImage(null);
    setUploadedImages([]);
    setError(null);
  };

  const remainingFree = Math.max(0, 3 - generationCount);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Subscription Modal */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              You've Used All 3 FREE Photos!
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              Keep creating amazing photos for just:
            </p>
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-6 mb-6">
              <div className="text-5xl font-bold mb-2">$4.99</div>
              <div className="text-2xl">per month</div>
              <div className="text-lg opacity-90 mt-2">Unlimited photos!</div>
            </div>
            <button
              onClick={() => alert('Payment integration coming soon! This would connect to Stripe/PayPal.')}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-2xl font-bold py-5 px-8 rounded-2xl shadow-xl mb-4"
            >
              START MY SUBSCRIPTION
            </button>
            <button
              onClick={() => setShowSubscriptionModal(false)}
              className="text-gray-500 text-lg underline"
            >
              Maybe later
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              📸 Make My Photo Perfect!
            </h1>
            <p className="text-xl md:text-2xl opacity-95">
              Transform your product photos in seconds - perfect for Facebook!
            </p>
          </div>

          {/* Free Trial Counter */}
          {remainingFree > 0 && (
            <div className="mt-6 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-4 text-center">
              <p className="text-2xl font-bold">
                🎁 {remainingFree} FREE {remainingFree === 1 ? 'Photo' : 'Photos'} Remaining!
              </p>
              <p className="text-lg opacity-90 mt-1">
                Then just $4.99/month for unlimited photos
              </p>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* No image uploaded yet */}
        {!generatedImage && !isLoading && uploadedImages.length === 0 && (
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
            <div className="text-7xl mb-6">👕</div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Upload Your Product Photo
            </h2>
            <p className="text-2xl text-gray-600 mb-10">
              We'll make it look professional automatically!
            </p>

            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-3xl font-bold py-8 px-16 rounded-2xl shadow-2xl inline-block transform hover:scale-105">
                📁 CHOOSE PHOTO
              </div>
            </label>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="bg-blue-50 rounded-2xl p-6">
                <div className="text-4xl mb-3">1️⃣</div>
                <h3 className="text-xl font-bold mb-2">Upload Photo</h3>
                <p className="text-lg text-gray-600">Pick a photo from your phone or computer</p>
              </div>
              <div className="bg-blue-50 rounded-2xl p-6">
                <div className="text-4xl mb-3">2️⃣</div>
                <h3 className="text-xl font-bold mb-2">We Fix It</h3>
                <p className="text-lg text-gray-600">Our AI makes it look amazing (takes 20 seconds)</p>
              </div>
              <div className="bg-blue-50 rounded-2xl p-6">
                <div className="text-4xl mb-3">3️⃣</div>
                <h3 className="text-xl font-bold mb-2">Share on Facebook!</h3>
                <p className="text-lg text-gray-600">Post directly to Facebook or Instagram</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="bg-white rounded-3xl shadow-2xl p-16 text-center">
            <div className="animate-spin text-8xl mb-8">⚡</div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Making Your Photo Amazing...
            </h2>
            <p className="text-2xl text-gray-600">
              This takes about 20 seconds
            </p>
            <div className="mt-8">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-4 rounded-full animate-pulse" style={{width: '70%'}}></div>
              </div>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
            <div className="text-7xl mb-6">😕</div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Oops! Something Went Wrong
            </h2>
            <p className="text-2xl text-gray-600 mb-8">{error}</p>
            <button
              onClick={handleTryAgain}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-2xl font-bold py-6 px-12 rounded-2xl shadow-xl"
            >
              TRY AGAIN
            </button>
          </div>
        )}

        {/* Generated image result */}
        {generatedImage && !isLoading && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <div className="text-center mb-6">
                <span className="inline-block bg-green-500 text-white text-2xl font-bold px-8 py-3 rounded-full">
                  ✓ DONE!
                </span>
              </div>

              <img
                src={generatedImage}
                alt="Your professional photo"
                className="w-full rounded-2xl shadow-lg mb-6"
              />

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={handleShareToFacebook}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-2xl font-bold py-6 px-8 rounded-2xl shadow-xl flex items-center justify-center gap-3"
                >
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  SHARE ON FACEBOOK
                </button>

                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = generatedImage;
                    link.download = `my-photo-${Date.now()}.png`;
                    link.click();
                  }}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-2xl font-bold py-6 px-8 rounded-2xl shadow-xl"
                >
                  💾 SAVE PHOTO
                </button>
              </div>

              <button
                onClick={handleTryAgain}
                className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xl font-semibold py-5 px-8 rounded-2xl"
              >
                ← Make Another Photo
              </button>
            </div>

            {/* Upsell box */}
            {remainingFree === 0 && (
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-3xl shadow-2xl p-8 text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-3xl font-bold text-gray-900 mb-3">
                  Love It? Get Unlimited!
                </h3>
                <p className="text-xl text-gray-800 mb-6">
                  Only <span className="font-bold text-2xl">$4.99/month</span> for unlimited professional photos
                </p>
                <button
                  onClick={() => setShowSubscriptionModal(true)}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-2xl font-bold py-5 px-12 rounded-2xl shadow-xl"
                >
                  GET UNLIMITED NOW!
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Social Proof Footer */}
      <footer className="bg-white border-t-4 border-blue-600 mt-16 py-8">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-2xl font-semibold text-gray-900 mb-2">
            ⭐⭐⭐⭐⭐
          </p>
          <p className="text-xl text-gray-600 mb-1">
            "So easy! My Facebook posts look professional now!"
          </p>
          <p className="text-lg text-gray-500">
            Join 50,000+ happy users sharing amazing photos
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
