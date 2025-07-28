import { ApplicationRoutes } from "@/app/constants/applicationRoutes";
import { useToast } from "@/app/context/ToastCardContext";
import { IBanner } from "@/app/models/IBanner";
import { format } from "date-fns";
import { Eye, Share2, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface MyBannerCardProps {
  banner: IBanner;
}

export const MyBannerCard = ({ banner }: MyBannerCardProps) => {
  const toast = useToast();
  const bannerUrl = `${window.location.origin}${ApplicationRoutes.PulseCard}/${banner.id}`;

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(bannerUrl);
    toast.logSuccess("Copied!", "Banner link copied to clipboard.");
  };

  return (
    <div className="bg-dark-grey-2 rounded-lg overflow-hidden shadow-lg transition-transform group flex flex-col">
      <div
        // href={`${ApplicationRoutes.UserDpBanner}/${banner.id}`}
        className="flex-grow"
      >
        <div className="relative h-48 bg-gray-700">
          {banner.configuration.frameImageUrl && (
            <Image
              src={banner.configuration.frameImageUrl}
              alt={banner.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            />
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-white truncate">{banner.title}</h3>
          <p className="text-xs text-gray-400 mt-1">
            Created: {format(new Date(banner.createdAt), "MMM d, yyyy")}
          </p>
        </div>
      </div>
      <div className="p-4 pt-0 flex justify-between items-center">
        <div className="flex items-center gap-4 text-sm text-gray-300">
          <div className="flex items-center gap-1">
            <Eye size={14} />
            <span>{banner.viewCount} views</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap size={14} />
            <span>{banner.generationCount} generations</span>
          </div>
        </div>
        <button
          onClick={handleShare}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
          aria-label="Share banner"
        >
          <Share2 size={16} />
        </button>
      </div>
    </div>
  );
};
