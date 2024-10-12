"use client";
import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";
import ConfirmDelete from "@/components/ConfirmDelete";  // Import the ConfirmDelete modal
import useDownloader from "react-use-downloader";
import { Download, Trash2, Calendar } from "lucide-react";


// Define the type for a history entry
interface HistoryEntry {
  id: string;
  userId: string;
  imageUrl: string;
  createdAt: Date;
}

const History = forwardRef((_, ref) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);  // Track selected image for delete
  const [isModalOpen, setModalOpen] = useState(false);  // Track modal open state
  const { userId } = useAuth();
  const { download } = useDownloader();

  const fetchHistory = async () => {
    try {
      const response = await fetch("/api/history/get");
      const data: HistoryEntry[] = await response.json();
      setHistory(data);
    } catch (error) {
      console.error("Error fetching history:", error);
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
      await fetch("/api/history/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageId: selectedImageId }),
      });
      setHistory((prev) => prev.filter((item) => item.id !== selectedImageId));  // Remove deleted item from history
      setModalOpen(false);  // Close modal after delete
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
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result + '.jpg';
  };

  return (
    <div className="history-page">
      <h2 className="text-2xl font-bold mb-4">Your design history</h2>
      <div className="history-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"> {/* Responsive grid layout */}
        {history.map((entry) => (
          <div key={entry.id} className="history-item space-y-2"> {/* Add space between buttons and text */}
            <div className="relative w-full h-48 overflow-hidden rounded-lg shadow-lg"> {/* Full width and fixed height wrapper */}
              <Image
                src={entry.imageUrl}
                width={300}
                height={200}
                alt="Room Design"
                className="object-cover" // Use object-cover to maintain uniformity
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(entry.createdAt).toLocaleString()}
              </p>
  
            <div className="flex justify space-x-2">
                <button
                  onClick={() => download(entry.imageUrl, fileName(10))}
                  className="p-2  hover:bg-orange-600 text-white rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                  title="Download"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={() => openDeleteModal(entry.id)}
                  className="p-2  hover:bg-red-600 text-white rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
          </div>
        ))}
      </div>
  
      {/* Delete Confirmation Modal */}
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
