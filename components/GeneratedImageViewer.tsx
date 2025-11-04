import React from 'react';

interface GeneratedImageViewerProps {
  isLoading: boolean;
  imageUrl: string | null;
  error: string | null;
}

const LoadingState: React.FC = () => (
  <div className="flex flex-col items-center justify-center text-center">
    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-yellow-400"></div>
    <p className="mt-4 text-lg font-semibold text-gray-300">Generating your model...</p>
    <p className="text-sm text-gray-400">This might take a moment, man.</p>
  </div>
);

const InitialState: React.FC = () => (
   <div className="flex flex-col items-center justify-center text-center text-gray-400">
    <svg className="w-24 h-24 mb-4 text-yellow-500/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
    <h3 className="text-xl font-bold text-gray-300">Your cosmic creation will appear here</h3>
    <p className="mt-2 max-w-sm">Upload your gear, describe a scene, and let the magic happen.</p>
  </div>
);

const ErrorState: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center text-center text-red-300 bg-[#c83232]/20 p-6 rounded-lg">
    <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
    <h3 className="text-xl font-bold">Whoa, a Bummer!</h3>
    <p className="mt-2 max-w-sm">{message}</p>
  </div>
);


export const GeneratedImageViewer: React.FC<GeneratedImageViewerProps> = ({ isLoading, imageUrl, error }) => {
  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'grateful-model.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }
  
  if (imageUrl) {
    return (
      <div className="w-full flex flex-col items-center space-y-4">
        <img src={imageUrl} alt="Generated fashion model" className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl" />
        <button 
          onClick={handleDownload}
          className="mt-4 bg-[#1e5ca6] text-white font-bold py-2 px-6 rounded-lg hover:bg-[#2a6ecb] transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          Download Image
        </button>
      </div>
    );
  }

  return <InitialState />;
};