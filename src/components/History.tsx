"use client";
import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";
import ConfirmDelete from "@/components/ConfirmDelete";  // Import the ConfirmDelete modal
import useDownloader from "react-use-downloader";

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
      <div className="history-grid space-y-4"> {/* Add space between history items */}
        {history.map((entry) => (
          <div key={entry.id} className="history-item space-y-2"> {/* Add space between buttons and text */}
            <Image
              src={entry.imageUrl}
              width={300}
              height={200}
              alt="Room Design"
              className="rounded-lg shadow-lg"
            />
            <p className="mt-2 text-sm text-gray-300">
              Created: {new Date(entry.createdAt).toLocaleString()}
            </p>

            <div className="flex space-x-2"> {/* Flex container for buttons */}
              {/* Download Button */}
              <button
                onClick={() => download(entry.imageUrl, fileName(10))} // Download button
                className="bg-blue-500 px-5 py-3 text-white rounded-lg"
              >
                Download
              </button>

              {/* Delete Button */}
              <button
                className="bg-red-500 px-5 py-3 text-white rounded-lg"
                onClick={() => openDeleteModal(entry.id)}
              >
                Delete
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
