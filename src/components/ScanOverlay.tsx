import React, { useState, useEffect, useRef } from "react";

interface Furniture {
  type: string;
  confidence: number;
  plot: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  image: {
    type: "base64";
    value: string;
  };
}

interface FurnitureWithMetadata extends Furniture {
  id?: string;
  description?: string;
  similarProducts?: any[];
}

import Image from "next/image";
import { useOutput, useRoom } from "@/store/useStore";
import searchWithSerper from "@/lib/SearchScrape_SerperAPI";

// Mock product data for fallback
const mockProducts = [
  {
    id: "p1",
    name: "Modern Scandinavian Sofa",
    price: "$899",
    rating: 4.7,
    reviewCount: 256,
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
    store: "Design Home",
    url: "https://example.com/sofa1"
  },
  {
    id: "p2",
    name: "Minimalist Coffee Table",
    price: "$249",
    rating: 4.5,
    reviewCount: 124,
    imageUrl: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91",
    store: "Modern Living",
    url: "https://example.com/table1"
  },
  {
    id: "p3",
    name: "Accent Chair - Natural Wood",
    price: "$329",
    rating: 4.8,
    reviewCount: 88,
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7",
    store: "Furniture Plus",
    url: "https://example.com/chair1"
  },
  {
    id: "p4",
    name: "Round Pendant Light",
    price: "$129",
    rating: 4.6,
    reviewCount: 74,
    imageUrl: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15",
    store: "Lighting World",
    url: "https://example.com/light1"
  }
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
  imageSrc
}) => {
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  // States for product scanning functionality
  const [scanningStage, setScanningStage] = useState<
    "initial" | "scanning" | "furniture-list" | "furniture-detail" | "results"
  >("initial");
  const [detectedFurniture, setDetectedFurniture] = useState<FurnitureWithMetadata[]>([]);
  const [selectedFurniture, setSelectedFurniture] = useState<FurnitureWithMetadata | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  
  // Add state for container dimensions and a ref for the container
  const [containerDimensions, setContainerDimensions] = useState({ width: 512, height: 384 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const output = useOutput((state: any) => state.output); // Get image
  const room = useRoom((state: any) => state.room); // Get room

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsAnimatingOut(false);
      setScanningStage("initial");
      setError(null);
    } else if (isVisible) {
      setIsAnimatingOut(true);
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isVisible]);

  // New effect to update container dimensions when needed
  useEffect(() => {
    if (scanningStage === "furniture-list" && imageContainerRef.current) {
      const updateDimensions = () => {
        if (imageContainerRef.current) {
          setContainerDimensions({
            width: imageContainerRef.current.clientWidth,
            height: imageContainerRef.current.clientHeight
          });
        }
      };
      
      // Initial update
      updateDimensions();
      
      // Update on window resize
      window.addEventListener("resize", updateDimensions);
      
      return () => {
        window.removeEventListener("resize", updateDimensions);
      };
    }
  }, [scanningStage]);

  const handleClose = () => {
    setIsAnimatingOut(true);
    setTimeout(onClose, 300);
  };

  const startScanning = async () => {
    setIsLoading(true);
    setScanningStage("scanning");
    setError(null);
    setScanProgress(0);
    
    try {
      // Progress animation
      const progressInterval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);
      
      // Call Roboflow API to detect furniture
      const response = await fetch("/api/roboflow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          imageUrl: output, // The generated image URL
          roomType: room // Room type
        })
      });
      
      clearInterval(progressInterval);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to detect furniture");
      }
      
      const data = await response.json();
      setScanProgress(100);
      
      if (data?.furnitures && Array.isArray(data.furnitures)) {
        setDetectedFurniture(data.furnitures.map((furniture: any, index: number) => ({
          ...furniture,
          id: `furniture-${index}`
        })));
        setScanningStage("furniture-list");
      } else {
        throw new Error("No furniture detected");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during scanning");
      console.error("Scanning error:", err);
    } finally {
      setIsLoading(false);
      setScanProgress(100);
    }
  };

  const handleFurnitureSelect = async (furniture: FurnitureWithMetadata) => {
    setSelectedFurniture(furniture);
    setIsLoading(true);
    setScanningStage("furniture-detail");
    setError(null);
    
    try {
      // Get furniture description from OpenAI
      const descResponse = await fetch("/api/openai/describe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          type: furniture.type,
          base64Image: furniture.image.value
        })
      });
      
      if (!descResponse.ok) {
        const errorData = await descResponse.json();
        throw new Error(errorData.error || "Failed to get furniture description");
      }
      
      const descData = await descResponse.json();
      const description = descData.description;
      
      // Update the selected furniture with description
      setSelectedFurniture(prev => prev ? { ...prev, description } : null);
      
      // Search for similar products
      if (description) {
        // Use Serper API to find similar products
        const products = await searchWithSerper(description);
        
        if (products && Array.isArray(products)) {
          setSimilarProducts(products);
        } else {
          setSimilarProducts([]);
        }
      }
      
      setScanningStage("results");
    } catch (err: any) {
      setError(err.message || "An error occurred while analyzing furniture");
      console.error("Furniture detail error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const goBackToFurnitureList = () => {
    setScanningStage("furniture-list");
    setSelectedFurniture(null);
    setSimilarProducts([]);
  };

  const openProductUrl = (url: string) => {
    window.open(url, "_blank");
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
      style={{ opacity: isAnimatingOut ? 0 : 1 }}
    >
      {/* Modal Container */}
      <div
        className={`
          relative bg-white dark:bg-gray-800 w-full max-w-xl rounded-2xl shadow-xl
          transition-all duration-300 ease-in-out overflow-hidden
          ${isAnimatingOut ? "scale-95 opacity-0" : "scale-100 opacity-100"}
        `}
      >
        {/* Image Header */}
        <div 
          ref={imageContainerRef}
          className="relative h-64 md:h-80 rounded-t-2xl overflow-hidden"
        >
          <Image
            src={imageSrc}
            alt="Room Image"
            fill
            className="object-cover"
            priority
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Detected furniture markers - show in furniture-list stage */}
          {scanningStage === "furniture-list" && detectedFurniture.map((item) => {
            // Get the original image dimensions from the response data
            const originalWidth = 512; // assuming this is the width of the source image
            const originalHeight = 768; // assuming this is the height of the source image
            
            // Calculate scale factors
            const scaleX = containerDimensions.width / originalWidth;
            const scaleY = containerDimensions.height / originalHeight;
            
            // Calculate scaled position and dimensions
            const scaledX = item.plot.x * scaleX;
            const scaledY = item.plot.y * scaleY;
            const scaledWidth = item.plot.width * scaleX;
            const scaledHeight = item.plot.height * scaleY;
            
            return (
              <div
                key={item.id}
                className="absolute cursor-pointer group"
                style={{
                  left: `${scaledX - scaledWidth/2}px`,
                  top: `${scaledY - scaledHeight/2}px`,
                  width: `${scaledWidth}px`,
                  height: `${scaledHeight}px`
                }}
                onClick={() => handleFurnitureSelect(item)}
              >
                <div className="absolute inset-0 border-2 border-blue-500 rounded-md bg-blue-500/20 group-hover:bg-blue-500/40 transition-colors"></div>
                <div className="absolute -top-8 left-0 bg-blue-600 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {item.type} ({item.confidence}%)
                </div>
              </div>
            );
          })}

          {/* Close Button (top-right corner) */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Back button (when in results or furniture-detail stage) */}
          {(scanningStage === "results" || scanningStage === "furniture-detail") && (
            <button
              type="button"
              onClick={goBackToFurnitureList}
              className="absolute top-4 left-4 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all"
              aria-label="Back"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}

          {/* Stage indicators */}
          {scanningStage === "furniture-list" && (
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <div className="bg-black/70 text-white py-2 px-4 rounded-lg inline-block">
                Tap on any furniture to identify and get similar products
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22 22L16 16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {scanningStage === "results" ? "Similar Products" : "Furniture Scanner"}
          </h3>

          {scanningStage === "initial" && (
            <div className="flex flex-col items-center justify-center py-4">
              <button
                onClick={startScanning}
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium shadow-lg transition-colors"
                disabled={isLoading}
              >
                {isLoading ? "Starting..." : "Start Scanning"}
              </button>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                Scan your room design to identify furniture and find similar products
              </p>
            </div>
          )}

          {scanningStage === "scanning" && (
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
                {isLoading ? "Analyzing your design..." : "Scanning complete!"}
              </p>
            </div>
          )}

          {scanningStage === "furniture-list" && (
            <div>
              <p className="mb-3 text-gray-600 dark:text-gray-300 text-sm">
                {detectedFurniture.length > 0
                  ? `${detectedFurniture.length} items detected. Tap on an item above for details.`
                  : "No furniture detected. Try scanning again."}
              </p>
              
              <div className="grid grid-cols-2 gap-3 mt-4">
                {detectedFurniture.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleFurnitureSelect(item)}
                    className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium capitalize">{item.type}</span>
                      <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-2 py-1 rounded">
                        {item.confidence}%
                      </span>
                    </div>
                    {item.image?.value && (
                      <div className="relative h-24 w-full rounded overflow-hidden">
                        <Image
                          src={`data:image/jpeg;base64,${item.image.value}`}
                          alt={item.type}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <button
                onClick={startScanning}
                className="mt-6 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors w-full"
              >
                Scan Again
              </button>
            </div>
          )}

          {scanningStage === "furniture-detail" && selectedFurniture && (
            <div className="flex flex-col items-center justify-center py-4">
              <div className="w-full">
                <h4 className="font-medium text-lg capitalize mb-2">{selectedFurniture.type}</h4>
                <div className="relative h-40 w-full rounded-lg overflow-hidden mb-4">
                  {selectedFurniture.image?.value && (
                    <Image
                      src={`data:image/jpeg;base64,${selectedFurniture.image.value}`}
                      alt={selectedFurniture.type}
                      fill
                      className="object-contain"
                    />
                  )}
                </div>
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
                <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-2">
                  Analyzing and finding similar products...
                </p>
              </div>
            </div>
          )}

          {scanningStage === "results" && selectedFurniture && (
            <div>
              <div className="mb-4">
                <h4 className="font-medium capitalize mb-1">{selectedFurniture.type}</h4>
                {selectedFurniture.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    {selectedFurniture.description}
                  </p>
                )}
              </div>
              
              <p className="font-medium text-sm mb-2">Similar Products:</p>
              
              {/* Product listings */}
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {(similarProducts.length > 0 ? similarProducts : mockProducts).map((product, index) => (
                  <div
                    key={product.id || `product-${index}`}
                    className="flex bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer"
                    onClick={() => openProductUrl(product.url || product.link)}
                  >
                    <div className="w-24 h-24 relative flex-shrink-0">
                      <Image
                        src={product.imageUrl || product.thumbnail || "https://via.placeholder.com/100"}
                        alt={product.name || product.title || "Product"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-3 flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                        {product.name || product.title || "Product Name"}
                      </h4>
                      <p className="text-blue-600 dark:text-blue-400 font-bold">
                        {product.price || product.price_str || "$???"}
                      </p>
                      <div className="flex items-center mt-1">
                        {product.rating && (
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
                        )}
                        {product.store && (
                          <span className="ml-auto text-xs text-gray-500">
                            {product.store}
                          </span>
                        )}
                        {product.source && (
                          <span className="ml-auto text-xs text-gray-500">
                            {product.source}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Progress indicator */}
          {scanningStage === "scanning" && (
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-4 dark:bg-gray-700">
              <div
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${scanProgress}%` }}
              ></div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/30 rounded-b-2xl">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {scanningStage === "scanning"
              ? "Our AI is analyzing your design to identify furniture and design elements."
              : scanningStage === "results"
              ? "Click on a product to view more details or purchase options."
              : scanningStage === "furniture-list"
              ? "Select a furniture item to get product recommendations."
              : "Start scanning to identify products in your room design."}
          </p>
        </div>
      </div>
    </div>
  );
};
