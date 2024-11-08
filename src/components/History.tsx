import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";
import ConfirmDelete from "@/components/ConfirmDelete";
import useDownloader from "react-use-downloader";
import { Download, Trash2, Calendar, Loader2, CheckSquare, Square } from "lucide-react";

interface HistoryEntry {
  id: string;
  userId: string;
  imageUrl: string;
  createdAt: Date;
}

const History = forwardRef((_, ref) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const { userId } = useAuth();
  const { download } = useDownloader();

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/history/get");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error("Invalid response format: expected an array");
      }
      
      setHistory(data);
    } catch (error) {
      console.error("Error fetching history:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch history");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchHistory();
  }, [userId]);

  useImperativeHandle(ref, () => ({
    fetchHistory,
  }));

  const handleDelete = async () => {
    try {
      const idsToDelete = isBulkDelete ? Array.from(selectedItems) : [selectedImageId];
      
      const response = await fetch("/api/history/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageIds: idsToDelete }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setHistory((prev) => prev.filter((item) => !idsToDelete.includes(item.id)));
      setSelectedItems(new Set());
    } catch (error) {
      console.error("Error deleting images:", error);
      setError("Failed to delete images");
    } finally {
      setModalOpen(false);
      setIsBulkDelete(false);
    }
  };

  const openDeleteModal = (imageId: string, imageUrl: string, isBulk: boolean = false) => {
    setSelectedImageId(imageId);
    setSelectedImageUrl(imageUrl);
    setIsBulkDelete(isBulk);
    setModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedImageId(null);
    setSelectedImageUrl(null);
    setModalOpen(false);
    setIsBulkDelete(false);
  };

  const fileName = (length: number) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => 
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join('') + '.jpg';
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === history.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(history.map(item => item.id)));
    }
  };

  const toggleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleBulkDownload = async () => {
    const selectedImages = history.filter(item => selectedItems.has(item.id));
    for (const image of selectedImages) {
      await download(image.imageUrl, fileName(10));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        <p>Error: {error}</p>
        <button 
          onClick={fetchHistory}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center p-4 text-gray-500">
        <p>No design history found.</p>
      </div>
    );
  }

  return (
    <div className="history-page">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Your design history</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSelectAll}
            className="flex items-center px-3 py-2  rounded"
          >
            {selectedItems.size === history.length ? (
              <CheckSquare className="w-5 h-5 mr-2" />
            ) : (
              <Square className="w-5 h-5 mr-2" />
            )}
            Select All
          </button>
          {selectedItems.size > 0 && (
            <div className="flex space-x-2">
              <button
                onClick={handleBulkDownload}
                className="flex items-center px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <Download className="w-5 h-5 mr-2" />
                Download 
              </button>
              <button
                onClick={() => openDeleteModal(Array.from(selectedItems)[0], "", true)}
                className="flex items-center px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Delete 
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="history-scroll-container max-h-[600px] overflow-y-auto">
        <div className="history-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {history.map((entry) => (
            <div key={entry.id} className="history-item space-y-2 relative">
              <div className="absolute top-4 left-2 z-10">
                <button
                  onClick={() => toggleSelectItem(entry.id)}
                  className="p-1 rounded-full "
                >
                  {selectedItems.has(entry.id) ? (
                    <CheckSquare className="w-5 h-5 text-orange-500" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div className="relative w-full h-48 overflow-hidden rounded-lg shadow-lg">
                <Image
                  src={entry.imageUrl}
                  width={300}
                  height={200}
                  alt="Room Design"
                  className="object-cover"
                />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(entry.createdAt).toLocaleString()}
              </p>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => download(entry.imageUrl, fileName(10))}
                  className="p-2 hover:bg-blue-600 text-white rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                  title="Download"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={() => openDeleteModal(entry.id, entry.imageUrl)}
                  className="p-2 hover:bg-red-600 text-white rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ConfirmDelete
        isOpen={isModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        imageUrl={!isBulkDelete ? selectedImageUrl : null}
        message={isBulkDelete 
          ? `Are you sure you want to delete ${selectedItems.size} selected images?` 
          : "Are you sure you want to delete this image?"
        }
      />
    </div>
  );
});

History.displayName = "History";

export default History;