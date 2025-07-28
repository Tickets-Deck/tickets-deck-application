"use client";

import { useState } from "react";
import Image from "next/image";
import { ISavedDp } from "@/app/models/IDp";
import { ImagePopup } from "@/app/components/custom/ImagePopup";
import { useToast } from "@/app/context/ToastCardContext";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

interface SavedDpCardProps {
  dp: ISavedDp;
}

export const SavedDpCard = ({ dp }: SavedDpCardProps) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const toast = useToast();

  const handleDownload = async () => {
    try {
      const response = await fetch(dp.generatedImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `dp_banner_${dp.banner.title
        .replace(" ", "_")
        .toLowerCase()}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.logSuccess("Downloaded!", "Your Pulse Card has been downloaded.");
    } catch (error) {
      console.error("Failed to download image", error);
      toast.logError("Download Failed", "Could not download the image.");
    }
  };

  return (
    <>
      <ImagePopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        imageUrl={dp.generatedImageUrl}
        alt={`Generated DP for banner ${dp.banner.title}`}
        onDownload={handleDownload}
      />
      <div
        className="bg-dark-grey-2 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105 group cursor-pointer"
        onClick={() => setIsPopupOpen(true)}
      >
        <div className="relative h-56 w-full bg-gray-700">
          <Image
            src={dp.generatedImageUrl}
            alt={`Generated DP for banner ${dp.banner.title}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-400 truncate">
            From: {dp.banner.title}
          </p>

          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
            <Calendar size={14} />
            Generated:{" "}
            {format(new Date(dp.createdAt), "MMM d, yyyy || hh:mm a")}
          </p>
        </div>
      </div>
    </>
  );
};
