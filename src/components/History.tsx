"use client";
import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";
import ConfirmDelete from "@/components/ConfirmDelete";
import useDownloader from "react-use-downloader";
import { Download, Trash2, Calendar, Loader2 } from "lucide-react";

// Define the type for a history entry
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
  const [isModalOpen, setModalOpen] = useState(false);
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
      
      // Validate that data is an array
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
    if (selectedImageId) {
      try {
        const response = await fetch("/api/history/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageId: selectedImageId }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        setHistory((prev) => prev.filter((item) => item.id !== selectedImageId));
      } catch (error) {
        console.error("Error deleting image:", error);
        setError("Failed to delete image");
      } finally {
        setModalOpen(false);
      }
    }
  };

  const openDeleteModal = (imageId: string) => {
    setSelectedImageId(imageId);
    setModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedImageId(null);
    setModalOpen(false);
  };

  const fileName = (length: number) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => 
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join('') + '.jpg';
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
      <h2 className="text-2xl font-bold mb-4">Your design history</h2>
      <div className="history-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {history.map((entry) => (
          <div key={entry.id} className="history-item space-y-2">
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

            <div className="flex justify space-x-2">
              <button
                onClick={() => download(entry.imageUrl, fileName(10))}
                className="p-2 hover:bg-orange-600 text-white rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                title="Download"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={() => openDeleteModal(entry.id)}
                className="p-2 hover:bg-red-600 text-white rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
                title="Delete"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDelete
        isOpen={isModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
      />
    </div>
  );
});

History.displayName = "History";

export default History;