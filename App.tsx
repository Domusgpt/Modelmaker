import React, { useState, useEffect } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { GeneratedImageViewer } from './components/GeneratedImageViewer';
import { generateFashionModelImage } from './services/geminiService';
import type { UploadedImage } from './types';

type Step = 1 | 2 | 3 | 4;

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [prompt, setPrompt] = useState<string>('A professional model in a modern studio setting, wearing the provided clothing in natural lighting with a clean white background.');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-advance to step 2 when images are uploaded
  useEffect(() => {
    if (uploadedImages.length > 0 && currentStep === 1) {
      setCurrentStep(2);
    } else if (uploadedImages.length === 0 && currentStep > 1 && !isLoading && !generatedImage) {
      setCurrentStep(1);
    }
  }, [uploadedImages.length, currentStep, isLoading, generatedImage]);

  const handleGenerate = async () => {
    if (uploadedImages.length === 0) {
      setError('Please upload at least one product image.');
      return;
    }
    if (!prompt.trim()) {
      setError('Please describe your desired scene.');
      return;
    }

    setCurrentStep(3);
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const b64Image = await generateFashionModelImage(prompt, uploadedImages);
      setGeneratedImage(`data:image/png;base64,${b64Image}`);
      setCurrentStep(4);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while generating your image.');
      console.error(err);
      setCurrentStep(2); // Return to editing step on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartOver = () => {
    setGeneratedImage(null);
    setError(null);
    setCurrentStep(uploadedImages.length > 0 ? 2 : 1);
  };

  const canGenerate = uploadedImages.length > 0 && prompt.trim().length > 0 && !isLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                AI Model Studio
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Professional product photography in seconds
              </p>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps - Hidden when viewing results */}
      {currentStep !== 4 && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-center gap-4">
              {/* Step 1 */}
              <div className="flex items-center">
                <div className={`step-indicator ${currentStep >= 1 ? 'completed' : ''}`}>
                  {currentStep > 1 ? '✓' : '1'}
                </div>
                <span className={`ml-2 text-sm font-medium ${currentStep >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>
                  Upload Products
                </span>
              </div>

              {/* Connector */}
              <div className={`h-0.5 w-12 ${currentStep >= 2 ? 'bg-green-500' : 'bg-gray-300'}`} />

              {/* Step 2 */}
              <div className="flex items-center">
                <div className={`step-indicator ${currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : ''}`}>
                  {currentStep > 2 ? '✓' : '2'}
                </div>
                <span className={`ml-2 text-sm font-medium ${currentStep >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>
                  Describe Scene
                </span>
              </div>

              {/* Connector */}
              <div className={`h-0.5 w-12 ${currentStep >= 3 ? 'bg-green-500' : 'bg-gray-300'}`} />

              {/* Step 3 */}
              <div className="flex items-center">
                <div className={`step-indicator ${currentStep === 3 ? 'active' : currentStep > 3 ? 'completed' : ''}`}>
                  {currentStep > 3 ? '✓' : '3'}
                </div>
                <span className={`ml-2 text-sm font-medium ${currentStep >= 3 ? 'text-gray-900' : 'text-gray-400'}`}>
                  Generate
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results View (Step 4) */}
        {currentStep === 4 && generatedImage && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Your Generated Image</h2>
              <button
                onClick={handleStartOver}
                className="btn-secondary"
              >
                ← Create Another
              </button>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <GeneratedImageViewer
                isLoading={false}
                imageUrl={generatedImage}
                error={null}
              />
            </div>
          </div>
        )}

        {/* Editor View (Steps 1-3) */}
        {currentStep !== 4 && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left Panel - Inputs */}
            <div className="lg:col-span-3 space-y-6">
              {/* Step 1: Upload Images */}
              <div
                className={`morph-card bg-white rounded-2xl shadow-lg overflow-hidden border-2 ${
                  currentStep === 1 ? 'border-indigo-500 active' : uploadedImages.length > 0 ? 'border-green-500' : 'border-gray-200'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`step-indicator ${uploadedImages.length > 0 ? 'completed' : currentStep === 1 ? 'active' : ''}`}>
                      {uploadedImages.length > 0 ? '✓' : '1'}
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Upload Product Images</h2>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">
                    Upload 1-5 high-quality images of your product. Works best with clean, well-lit photos.
                  </p>
                  <ImageUploader onImagesUploaded={setUploadedImages} />
                  {uploadedImages.length > 0 && (
                    <div className="mt-4 flex items-center gap-2 text-green-600 text-sm font-medium">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {uploadedImages.length} {uploadedImages.length === 1 ? 'image' : 'images'} uploaded
                    </div>
                  )}
                </div>
              </div>

              {/* Step 2: Describe Scene */}
              <div
                className={`morph-card bg-white rounded-2xl shadow-lg overflow-hidden border-2 transition-all duration-500 ${
                  currentStep === 2 ? 'border-indigo-500 active' : currentStep > 2 ? 'border-green-500' : 'border-gray-200 inactive'
                } ${uploadedImages.length === 0 ? 'opacity-50' : ''}`}
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`step-indicator ${currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : ''}`}>
                      {currentStep > 2 ? '✓' : '2'}
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Describe Your Scene</h2>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">
                    Describe how you want your product displayed. Be specific about setting, lighting, and style.
                  </p>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Example: A professional model in a modern studio with soft lighting and a white background..."
                    disabled={uploadedImages.length === 0}
                    className="w-full h-32 p-4 bg-gray-50 text-gray-900 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {prompt.trim().length > 0 && uploadedImages.length > 0 && (
                    <div className="mt-4 flex items-center gap-2 text-green-600 text-sm font-medium">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Scene description ready
                    </div>
                  )}
                </div>
              </div>

              {/* Generate Button */}
              {currentStep === 2 && (
                <div className="animate-fade-in">
                  <button
                    onClick={handleGenerate}
                    disabled={!canGenerate}
                    className={`w-full btn-primary text-lg py-4 ${!canGenerate ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <svg className="w-6 h-6 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generate Professional Image
                  </button>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
                  <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-red-900 mb-1">Error</h3>
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Panel - Preview */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Preview</h3>
                <div className="aspect-square bg-gray-50 rounded-xl flex items-center justify-center border-2 border-gray-200">
                  {currentStep === 3 && isLoading ? (
                    <div className="text-center">
                      <svg className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <p className="text-gray-600 font-medium">Generating your image...</p>
                      <p className="text-gray-400 text-sm mt-2">This usually takes 10-30 seconds</p>
                    </div>
                  ) : uploadedImages.length > 0 ? (
                    <div className="text-center p-6">
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {uploadedImages.slice(0, 4).map((img, idx) => (
                          <img
                            key={idx}
                            src={img.dataUrl}
                            alt={`Upload ${idx + 1}`}
                            className="w-full h-20 object-cover rounded-lg border border-gray-200"
                          />
                        ))}
                      </div>
                      <div className="text-sm text-gray-600">
                        <p className="font-medium mb-2">Your products are ready!</p>
                        <p className="text-xs text-gray-500">
                          {currentStep === 2 ? 'Complete the scene description and click Generate' : 'Awaiting scene description'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-400">
                      <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm">Upload your product images to get started</p>
                    </div>
                  )}
                </div>

                {/* Quick Tips */}
                <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                  <h4 className="text-sm font-semibold text-indigo-900 mb-2">💡 Pro Tips</h4>
                  <ul className="text-xs text-indigo-700 space-y-1">
                    <li>• Use high-resolution product images</li>
                    <li>• Be specific in your scene description</li>
                    <li>• Try different backgrounds and settings</li>
                    <li>• Perfect for social media & ads</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            Powered by AI • Perfect for Facebook ads, Instagram posts, and print-on-demand products
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
