import React, { useState, useCallback } from 'react';
import type { UploadedImage } from '../types';

interface ImageUploaderProps {
  onImagesUploaded: (images: UploadedImage[]) => void;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // result is a data URL: data:image/png;base64,iVBORw0KGgo...
      // Store the complete data URL for previews
      resolve(reader.result as string);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesUploaded }) => {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleFileChange = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsProcessing(true);

    const uploadedImages: UploadedImage[] = [];
    const newPreviews: string[] = [];

    try {
      const fileList = Array.from(files).slice(0, 5); // Limit to 5 files
      const conversionPromises = fileList.map(async (file: File) => {
        const dataUrl = await fileToBase64(file);
        // Extract base64 data without the data URL prefix
        const base64Data = dataUrl.split(',')[1];
        uploadedImages.push({
          name: file.name,
          data: base64Data,
          mimeType: file.type,
          dataUrl: dataUrl, // Keep full data URL for preview
        });
        newPreviews.push(dataUrl);
      });

      await Promise.all(conversionPromises);

      setImagePreviews(newPreviews);
      onImagesUploaded(uploadedImages);
    } catch (error) {
      console.error("Error processing files:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [onImagesUploaded]);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(event.target.files);
  }, [handleFileChange]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    handleFileChange(event.dataTransfer.files);
  }, [handleFileChange]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  const handleClear = () => {
    setImagePreviews([]);
    onImagesUploaded([]);
    const input = document.getElementById('file-input') as HTMLInputElement;
    if(input) input.value = '';
  };

  const removeImage = (index: number) => {
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);

    // Update uploaded images by re-parsing from previews
    // (In a real app, you'd maintain a separate state for uploaded images)
    if (newPreviews.length === 0) {
      onImagesUploaded([]);
      const input = document.getElementById('file-input') as HTMLInputElement;
      if(input) input.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50/50 scale-102'
            : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
        } ${isProcessing ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}
      >
        <input
          type="file"
          id="file-input"
          multiple
          accept="image/png, image/jpeg, image/webp"
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isProcessing}
        />
        <div className="flex flex-col items-center pointer-events-none">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <p className="text-gray-700 font-medium mb-1">
            {isProcessing ? 'Processing images...' : 'Drop your images here, or click to browse'}
          </p>
          <p className="text-sm text-gray-500">
            PNG, JPG, or WEBP (max 5 files)
          </p>
        </div>
      </div>

      {imagePreviews.length > 0 && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-700 text-sm">
              {imagePreviews.length} {imagePreviews.length === 1 ? 'file' : 'files'} selected
            </h3>
            <button
              onClick={handleClear}
              className="text-sm text-red-600 hover:text-red-700 font-medium hover:underline"
            >
              Clear All
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {imagePreviews.map((src, index) => (
              <div key={index} className="relative group">
                <img
                  src={src}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-28 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    removeImage(index);
                  }}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                  title="Remove image"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
