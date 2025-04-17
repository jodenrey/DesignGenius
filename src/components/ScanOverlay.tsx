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
    "initial" | "scanning" | "furniture-list" | "results"
  >("initial");
  const [detectedFurniture, setDetectedFurniture] = useState<
    FurnitureWithMetadata[]
  >([]);
  const [selectedFurniture, setSelectedFurniture] =
    useState<FurnitureWithMetadata | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);

  // Add state for container dimensions and a ref for the container
  const [containerDimensions, setContainerDimensions] = useState({
    width: 512,
    height: 384
  });

  // Add default container dimensions of the image given by roboflow
  const [imageDefaultsize, setimageDefaultsize] = useState({
    width: 512,
    height: 384
  });

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

  // Effect to update container dimensions when needed
  useEffect(() => {
    if (
      (scanningStage === "furniture-list" || scanningStage === "results") &&
      imageContainerRef.current
    ) {
      const updateDimensions = () => {
        if (imageContainerRef.current) {
          console.log(
            "Updating container dimensions:",
            imageContainerRef.current.clientWidth,
            imageContainerRef.current.clientHeight
          );
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
        setScanProgress((prev) => {
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

      // Log the furniture data for debugging
      console.log("Furniture detection data:", data);

      if (data?.furnitures && Array.isArray(data.furnitures)) {
        // Log the first furniture item to check coordinates
        if (data.furnitures.length > 0) {
          console.log("First furniture item:", data.furnitures[0]);
        }

        setDetectedFurniture(
          data.furnitures.map((furniture: any, index: number) => ({
            ...furniture,
            id: `furniture-${index}`
          }))
        );
        setimageDefaultsize({
          width: data?.image?.width,
          height: data?.image?.height
        });
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
    setScanningStage("results");
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
          base64Image: furniture.image.value,
          roomType: room
        })
      });

      if (!descResponse.ok) {
        const errorData = await descResponse.json();
        throw new Error(
          errorData.error || "Failed to get furniture description"
        );
      }

      const descData = await descResponse.json();
      const description = descData.description;

      // Update the selected furniture with description
      setSelectedFurniture((prev) => (prev ? { ...prev, description } : null));

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
      style={{ opacity: isAnimatingOut ? 0 : 1 }}
    >
      {/* Add pulse animation style */}
      <style jsx global>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(6, 182, 212, 0.7);
          }

          70% {
            transform: scale(1.05);
            box-shadow: 0 0 0 10px rgba(6, 182, 212, 0);
          }

          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(6, 182, 212, 0);
          }
        }

        .pulse-dot {
          animation: pulse 2s infinite;
        }
      `}</style>

      {/* Modal container with the background image covering the entire modal */}
      <div
        className={`
          relative rounded-xl shadow-2xl overflow-hidden
          w-[90vw] max-w-6xl h-[80vh] max-h-[900px]
          ${scanningStage !== "initial" ? "flex flex-col md:flex-row" : ""}
          transition-all duration-300 ease-in-out
          ${isAnimatingOut ? "scale-95 opacity-0" : "scale-100 opacity-100"}
        `}
      >
        {/* Initial stage - full image view only */}
        {scanningStage === "initial" && (
          <div className="relative w-full h-full" ref={imageContainerRef}>
            <Image
              src={imageSrc}
              alt="Room Image"
              fill
              className="object-contain"
              priority
              unoptimized={true}
            />

            {/* Close button */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
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

            {/* Start scanning overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
              <button
                onClick={startScanning}
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium shadow-lg transition-colors"
                disabled={isLoading}
              >
                {isLoading ? "Starting..." : "Start Scanning"}
              </button>
              <p className="mt-4 text-sm text-white">
                Scan your room design to identify furniture and find similar
                products
              </p>
            </div>
          </div>
        )}

        {/* Other stages - split view with image and sidebar */}
        {scanningStage !== "initial" && (
          <>
            {/* Left panel - Main image with dots */}
            <div className="w-full md:w-3/5 h-full relative bg-black flex items-center justify-center overflow-hidden">
              {/* Close button */}
              <button
                type="button"
                onClick={handleClose}
                className="absolute top-4 left-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
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

              {/* Image container */}
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                <div
                  ref={imageContainerRef}
                  className="relative max-w-full max-h-full"
                >
                  <img
                    src={imageSrc}
                    className={`${
                      imageDefaultsize.width > imageDefaultsize.height
                        ? "w-full"
                        : "h-full"
                    } `}
                    alt="Room Image"
                  />

                  {/* Scanning overlay */}
                  {scanningStage === "scanning" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
                      <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="mt-4 text-sm text-white">
                        {isLoading
                          ? "Analyzing your design..."
                          : "Scanning complete!"}
                      </p>
                      {/* Progress bar */}
                      <div className="w-64 bg-gray-700 rounded-full h-1.5 mt-4">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full transition-all duration-300 ease-out"
                          style={{ width: `${scanProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Furniture dot markers - show in furniture-list stage */}
                  {scanningStage === "furniture-list" &&
                    detectedFurniture.map((item, index) => {
                      // Get current container dimensions
                      const containerWidth =
                        imageContainerRef.current?.clientWidth || 500;
                      const containerHeight =
                        imageContainerRef.current?.clientHeight || 400;

                      // Adjust the original dimensions to match what the API seems to be using
                      const originalWidth = 768;
                      const originalHeight = 768;

                      // Directly use the coordinates from the API
                      const furnitureX = item.plot.x;
                      const furnitureY = item.plot.y;

                      // Calculate displayed image size with proper aspect ratio preservation
                      const containerAspectRatio =
                        containerWidth / containerHeight;
                      const imageAspectRatio =
                        imageDefaultsize.width / imageDefaultsize.height; // Using 1:1 aspect ratio based on coordinate patterns

                      let displayedWidth, displayedHeight;
                      if (containerAspectRatio > imageAspectRatio) {
                        // Container is wider than image
                        displayedHeight = containerHeight;
                        displayedWidth = containerHeight * imageAspectRatio;
                      } else {
                        // Container is taller than image
                        displayedWidth = containerWidth;
                        displayedHeight = containerWidth / imageAspectRatio;
                      }

                      // Margins for centering the image in the container
                      const marginLeft = (containerWidth - displayedWidth) / 2;
                      const marginTop = (containerHeight - displayedHeight) / 2;

                      // Apply scaling based on how the image is displayed
                      const scaleFactorX =
                        displayedWidth / imageDefaultsize.width;
                      const scaleFactorY =
                        displayedHeight / imageDefaultsize.height;

                      // console.log(
                      //   "Scale factors:",
                      //   scaleFactorX,
                      //   scaleFactorY,
                      //   "\nMargins:",
                      //   marginLeft,
                      //   marginTop,
                      //   "\nContainer dimensions:",
                      //   containerWidth,
                      //   containerHeight,
                      //   "\nImage default size:",
                      //   imageDefaultsize.width,
                      //   imageDefaultsize.height,
                      //   "\nFurniture coordinates:",
                      //   containerHeight - imageDefaultsize.height
                      // );

                      // Final coordinates
                      const dotX = furnitureX * scaleFactorX + marginLeft;
                      const dotY = furnitureY * scaleFactorY + marginTop;

                      // For debugging
                      console.log(
                        `Furniture ${index} (${
                          item.type
                        }): Placing dot at ${Math.round(dotX)},${Math.round(
                          dotY
                        )}`
                      );

                      return (
                        <div
                          key={item.id}
                          className="absolute cursor-pointer group z-20"
                          style={{
                            left: `${dotX}px`,
                            top: `${dotY}px`,
                            transform: "translate(-50%, -50%)"
                          }}
                          onClick={() => handleFurnitureSelect(item)}
                        >
                          <div className="w-8 h-8 flex items-center justify-center">
                            <div className="w-6 h-6 rounded-full bg-orange-500 border-2 border-white shadow-lg hover:w-7 hover:h-7 transition-all duration-200 pulse-dot"></div>
                          </div>
                          <div className="absolute -top-8 left-0 bg-orange-500 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {item.type} ({item.confidence}%)
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Right panel - Product results */}
            <div className="w-full md:w-2/5 h-full bg-white dark:bg-gray-900 overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 z-10">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {scanningStage === "scanning" && "Scanning..."}
                  {scanningStage === "furniture-list" && "Detected Furniture"}
                  {scanningStage === "results" &&
                    selectedFurniture &&
                    `${
                      selectedFurniture.type.charAt(0).toUpperCase() +
                      selectedFurniture.type.slice(1)
                    } Products`}
                </h2>

                {scanningStage === "results" && selectedFurniture && (
                  <button
                    onClick={goBackToFurnitureList}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                    Back to all furniture
                  </button>
                )}

                {/* {selectedFurniture?.description &&
                  scanningStage === "results" && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      {selectedFurniture.description}
                    </p>
                  )} */}
              </div>

              {/* Content */}
              <div className="p-4">
                {error && (
                  <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {scanningStage === "scanning" && (
                  <div className="text-center py-8">
                    <p className="text-gray-600 dark:text-gray-300">
                      Please wait while we analyze your image...
                    </p>
                  </div>
                )}

                {scanningStage === "furniture-list" && (
                  <div className="grid grid-cols-2 gap-3">
                    {detectedFurniture.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleFurnitureSelect(item)}
                        className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-all"
                      >
                        {item.image?.value && (
                          <div className="relative h-32 w-full">
                            <img
                              src={`data:image/jpeg;base64,${item.image.value}`}
                              alt={item.type}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        )}
                        <div className="p-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium capitalize text-gray-900 dark:text-white">
                              {item.type}
                            </span>
                            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-2 py-1 rounded-full">
                              {item.confidence}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {scanningStage === "results" && (
                  <>
                    {isLoading ? (
                      <div className="flex justify-center py-8">
                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        {(similarProducts.length > 0
                          ? similarProducts
                          : mockProducts
                        ).map((product, index) => (
                          <div
                            key={product.id || `product-${index}`}
                            className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-all"
                            onClick={() =>
                              openProductUrl(product.url || product.link)
                            }
                          >
                            <div className="relative h-32 w-full">
                              <img
                                src={
                                  product.imageUrl ||
                                  product.thumbnail ||
                                  "https://via.placeholder.com/100"
                                }
                                alt={product.name || product.title || "Product"}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            </div>
                            <div className="p-2">
                              <h4 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-1">
                                {product.name ||
                                  product.title ||
                                  "Product Name"}
                              </h4>
                              <p className="text-blue-600 dark:text-blue-400 font-bold text-sm">
                                {product.price || product.price_str || "$???"}
                              </p>
                              <div className="flex items-center mt-1">
                                {product.source && (
                                  <span className="text-xs text-gray-500">
                                    {product.source}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {scanningStage === "furniture-list" ||
                scanningStage === "results" ? (
                  <button
                    onClick={startScanning}
                    className="mt-6 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors w-full"
                    disabled={isLoading}
                  >
                    Scan Again
                  </button>
                ) : null}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
