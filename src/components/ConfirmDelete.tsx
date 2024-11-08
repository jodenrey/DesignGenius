import React from 'react';
import Image from 'next/image';

interface ConfirmDeleteProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  imageUrl: string | null;
  message?: string;
}

const ConfirmDelete: React.FC<ConfirmDeleteProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  imageUrl,
  message = "Are you sure you want to delete this image? This action cannot be undone."
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
      <div className="relative bg-white text-black rounded-lg p-6 max-w-sm w-full shadow-lg">
        <h2 className="text-lg font-bold mb-4">Delete Image{!imageUrl ? 's' : ''}</h2>

        {imageUrl && (
          <div className="mb-4 flex justify-center">
            <Image
              src={imageUrl}
              alt="Image to delete"
              width={300}
              height={200}
              className="rounded-lg shadow-md"
            />
          </div>
        )}

        <p className="mb-6 text-center">{message}</p>
        
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDelete;