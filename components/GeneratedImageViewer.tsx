import React, { useState } from 'react';

interface GeneratedImageViewerProps {
  isLoading: boolean;
  imageUrl: string | null;
  error: string | null;
}

const LoadingState: React.FC = () => (
  <div className="flex flex-col items-center justify-center text-center py-12">
    <div className="relative">
      <div className="w-20 h-20 border-4 border-gray-200 rounded-full"></div>
      <div className="w-20 h-20 border-4 border-indigo-600 rounded-full animate-spin border-t-transparent absolute top-0 left-0"></div>
    </div>
    <p className="mt-6 text-lg font-semibold text-gray-900">Creating your image...</p>
    <p className="text-sm text-gray-500 mt-2">This usually takes 10-30 seconds</p>
  </div>
);

const InitialState: React.FC = () => (
  <div className="flex flex-col items-center justify-center text-center py-12 text-gray-400">
    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-gray-700">Your generated image will appear here</h3>
    <p className="mt-2 max-w-sm text-sm text-gray-500">
      Upload your products and describe the scene to get started
    </p>
  </div>
);

const ErrorState: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center text-center bg-red-50 p-8 rounded-xl border-2 border-red-200">
    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
      <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <h3 className="text-xl font-bold text-red-900 mb-2">Generation Failed</h3>
    <p className="text-red-700 max-w-md text-sm">{message}</p>
    <p className="text-red-600 text-xs mt-3">Try adjusting your prompt or uploading different images</p>
  </div>
);

export const GeneratedImageViewer: React.FC<GeneratedImageViewerProps> = ({ isLoading, imageUrl, error }) => {
  const [showCopied, setShowCopied] = useState(false);

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `ai-product-photo-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyToClipboard = async () => {
    if (!imageUrl) return;
    try {
      // Convert data URL to blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ]);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy image:', err);
    }
  };

  const handleShare = async () => {
    if (!imageUrl) return;
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], `ai-product-photo-${Date.now()}.png`, { type: blob.type });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'AI Generated Product Photo',
          text: 'Check out this AI-generated product photo!',
        });
      } else {
        // Fallback to download if sharing is not supported
        handleDownload();
      }
    } catch (err) {
      console.error('Failed to share image:', err);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (imageUrl) {
    return (
      <div className="w-full flex flex-col items-center space-y-6">
        {/* Image Display */}
        <div className="relative w-full">
          <img
            src={imageUrl}
            alt="AI Generated Product Photography"
            className="w-full max-h-[600px] object-contain rounded-xl shadow-2xl border border-gray-200"
          />
          <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Generated
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 w-full justify-center">
          <button
            onClick={handleDownload}
            className="btn-primary flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download HD
          </button>

          <button
            onClick={handleCopyToClipboard}
            className="btn-secondary flex items-center gap-2 relative"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {showCopied ? 'Copied!' : 'Copy Image'}
          </button>

          <button
            onClick={handleShare}
            className="btn-secondary flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </button>
        </div>

        {/* Info Banner */}
        <div className="w-full bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-indigo-900 mb-1">Pro Tips for Best Results</h4>
              <ul className="text-xs text-indigo-700 space-y-1">
                <li>• Use this image for Facebook ads, Instagram posts, or product listings</li>
                <li>• Download in HD for print-on-demand services like Printful or Printify</li>
                <li>• Try different scene descriptions to create multiple variations</li>
                <li>• Images are generated fresh each time - no two are exactly alike</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <InitialState />;
};
