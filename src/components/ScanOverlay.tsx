import React, { useState, useEffect } from 'react';
import Image from 'next/image';

// Mock product data - in a real implementation this would come from an API
const mockProducts = [
  {
    id: 'p1',
    name: 'Modern Scandinavian Sofa',
    price: '$899',
    rating: 4.7,
    reviewCount: 256,
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
    store: 'Design Home',
    url: 'https://example.com/sofa1'
  },
  {
    id: 'p2',
    name: 'Minimalist Coffee Table',
    price: '$249',
    rating: 4.5,
    reviewCount: 124,
    imageUrl: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91',
    store: 'Modern Living',
    url: 'https://example.com/table1'
  },
  {
    id: 'p3',
    name: 'Accent Chair - Natural Wood',
    price: '$329',
    rating: 4.8,
    reviewCount: 88,
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7',
    store: 'Furniture Plus',
    url: 'https://example.com/chair1'
  },
  {
    id: 'p4',
    name: 'Round Pendant Light',
    price: '$129',
    rating: 4.6,
    reviewCount: 74,
    imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15',
    store: 'Lighting World',
    url: 'https://example.com/light1'
  },
];

interface ScanOverlayProps {
  /** Whether the overlay is open (true) or not (false). */
  isOpen: boolean;
  /** Function to call when the user closes the overlay (clicking the X). */
  onClose: () => void;
  /** The URL for the AI-generated image to show in the background. */
  imageSrc: string;
}

export const ScanOverlay: React.FC<ScanOverlayProps> = ({
  isOpen,
  onClose,
  imageSrc,
}) => {
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  // New states for product scanning functionality
  const [scanningStage, setScanningStage] = useState<'initial' | 'scanning' | 'results'>('initial');
  const [detectedProducts, setDetectedProducts] = useState<any[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<{x: number, y: number} | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsAnimatingOut(false);
      // Start in initial state when opened
      setScanningStage('initial');
    } else if (isVisible) {
      setIsAnimatingOut(true);
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isVisible]);

  useEffect(() => {
    // Simulate scanning process when in scanning stage
    if (scanningStage === 'scanning') {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        setScanProgress(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          // Simulate product detection completed
          setDetectedProducts(mockProducts);
          setScanningStage('results');
        }
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [scanningStage]);

  const handleClose = () => {
    setIsAnimatingOut(true);
    setTimeout(onClose, 300);
  };
  
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (scanningStage === 'results') {
      // Get click coordinates relative to the image container
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      setSelectedPoint({ x, y });
      
      // In a real implementation, these coordinates would be sent to an API
      // that identifies the object at this position in the image
      
      // For demo purposes, we'll just simulate this by selecting a random product
      const randomProduct = mockProducts[Math.floor(Math.random() * mockProducts.length)];
      setDetectedProducts([randomProduct]);
    }
  };

  const startScanning = () => {
    setScanningStage('scanning');
    setSelectedPoint(null);
  };

  const openProductUrl = (url: string) => {
    window.open(url, '_blank');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
         style={{ opacity: isAnimatingOut ? 0 : 1 }}>
      {/* Modal Container */}
      <div 
        className={`
          relative bg-white dark:bg-gray-800 w-full max-w-xl rounded-2xl shadow-xl
          transition-all duration-300 ease-in-out overflow-hidden
          ${isAnimatingOut ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}
        `}
      >
        {/* Image Header */}
        <div 
          className="relative h-64 md:h-80 rounded-t-2xl overflow-hidden" 
          onClick={scanningStage === 'results' ? handleImageClick : undefined}
          style={{ cursor: scanningStage === 'results' ? 'crosshair' : 'default' }}
        >
          <Image
            src={imageSrc}
            alt="Product Image"
            fill
            className="object-cover"
            priority
          />
          
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Show selected point */}
          {selectedPoint && (
            <div 
              className="absolute w-6 h-6 rounded-full border-2 border-white bg-blue-500/50 -mt-3 -ml-3 pulse-animation"
              style={{ 
                left: `${selectedPoint.x}%`, 
                top: `${selectedPoint.y}%` 
              }}
            />
          )}
          
          {/* Close Button (top-right corner) */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          {/* Instruction overlay for results stage */}
          {scanningStage === 'results' && !selectedPoint && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/70 text-white p-4 rounded-lg max-w-xs text-center">
                <p>Tap on any item in the image to identify products</p>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 22L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Product Scanner
          </h3>
          
          {scanningStage === 'initial' && (
            <div className="flex flex-col items-center justify-center py-4">
              <button
                onClick={startScanning}
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium shadow-lg transition-colors"
              >
                Start Scanning
              </button>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                Scan the image to identify furniture and design items
              </p>
            </div>
          )}
          
          {scanningStage === 'scanning' && (
            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative w-40 h-40 border-2 border-dashed border-blue-500 rounded-lg mb-4">
                {/* Scanning line animation */}
                <div 
                  className="absolute left-0 right-0 h-1 bg-blue-500" 
                  style={{ top: `${(scanProgress % 100) * 0.4}%` }} 
                />
                
                {/* Corner highlights */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-blue-500" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-blue-500" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-blue-500" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-blue-500" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Scanning for products...
              </p>
            </div>
          )}
          
          {scanningStage === 'results' && (
            <div>
              {selectedPoint ? (
                <p className="mb-3 text-gray-600 dark:text-gray-300 text-sm">
                  Found {detectedProducts.length} matching products:
                </p>
              ) : (
                <p className="mb-3 text-gray-600 dark:text-gray-300 text-sm">
                  {detectedProducts.length} products detected. Tap on specific items for details.
                </p>
              )}
              
              {/* Product listings */}
              <div className="space-y-4 mt-3 max-h-64 overflow-y-auto">
                {detectedProducts.map((product) => (
                  <div 
                    key={product.id}
                    className="flex bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer"
                    onClick={() => openProductUrl(product.url)}
                  >
                    <div className="w-24 h-24 relative flex-shrink-0">
                      <Image 
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-3 flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">{product.name}</h4>
                      <p className="text-blue-600 dark:text-blue-400 font-bold">{product.price}</p>
                      <div className="flex items-center mt-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg 
                              key={i}
                              className={`w-3 h-3 ${
                                i < Math.floor(product.rating) 
                                  ? "text-yellow-400" 
                                  : "text-gray-300"
                              }`}
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">
                          ({product.reviewCount})
                        </span>
                        <span className="ml-auto text-xs text-gray-500">{product.store}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {detectedProducts.length > 0 && (
                <button 
                  onClick={startScanning}
                  className="mt-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors w-full"
                >
                  Scan Again
                </button>
              )}
            </div>
          )}
          
          {/* Progress indicator */}
          {scanningStage === 'scanning' && (
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-4 dark:bg-gray-700">
              <div 
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300 ease-out" 
                style={{width: `${scanProgress}%`}}
              ></div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/30 rounded-b-2xl">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {scanningStage === 'scanning' 
              ? 'Our AI is analyzing your image to identify products and design elements.'
              : scanningStage === 'results'
                ? 'Click on a product to view more details or purchase options.'
                : 'Start scanning to identify products in your room design.'}
          </p>
        </div>
      </div>
    </div>
  );
};
