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
      // we only need the base64 part
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesUploaded }) => {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    
    const uploadedImages: UploadedImage[] = [];
    const newPreviews: string[] = [];

    try {
      const fileList = Array.from(files);
      // Fix: Explicitly type 'file' as File to resolve type inference issues.
      const conversionPromises = fileList.map(async (file: File) => {
        const base64Data = await fileToBase64(file);
        uploadedImages.push({
          name: file.name,
          data: base64Data,
          mimeType: file.type,
        });
        newPreviews.push(URL.createObjectURL(file));
      });

      await Promise.all(conversionPromises);

      setImagePreviews(newPreviews);
      onImagesUploaded(uploadedImages);
    } catch (error) {
      console.error("Error processing files:", error);
      // Optionally show an error to the user
    } finally {
      setIsProcessing(false);
    }
  }, [onImagesUploaded]);

  const handleClear = () => {
    setImagePreviews([]);
    onImagesUploaded([]);
    // Reset file input value to allow re-uploading the same file
    const input = document.getElementById('file-input') as HTMLInputElement;
    if(input) input.value = '';
  };

  return (
    <div className="space-y-4">
      <div className="relative border-2 border-dashed border-yellow-500/50 rounded-lg p-6 text-center hover:border-yellow-400 transition-colors">
        <input
          type="file"
          id="file-input"
          multiple
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isProcessing}
        />
        <div className="flex flex-col items-center">
          <svg className="w-12 h-12 text-yellow-500/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          <p className="mt-2 text-sm text-gray-300">
            <span className="font-semibold text-yellow-400">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">PNG, JPG, WEBP</p>
          {isProcessing && <p className="text-sm text-yellow-400 mt-2">Processing images...</p>}
        </div>
      </div>
      
      {imagePreviews.length > 0 && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-300">Image Previews:</h3>
            <button onClick={handleClear} className="text-sm text-red-400 hover:text-red-300 font-medium">Clear All</button>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {imagePreviews.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`preview ${index}`}
                className="w-full h-24 object-cover rounded-md border border-yellow-800/50"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};