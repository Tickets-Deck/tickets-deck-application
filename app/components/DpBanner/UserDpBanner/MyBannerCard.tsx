import { ApplicationRoutes } from "@/app/constants/applicationRoutes";
import { useToast } from "@/app/context/ToastCardContext";
import { IBanner } from "@/app/models/IBanner";
import { format } from "date-fns";
import { Eye, Share2, Zap, Edit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Tooltip from "../../custom/Tooltip";

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
    <div className="bg-dark-grey-2 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105 group flex flex-col">
      <Link
        href={`${ApplicationRoutes.UserPulseCard}/${banner.id}/edit`}
        className="flex-grow"
      >
        <div className="relative h-48 bg-gray-700">
          <div className="absolute top-2 right-2 z-10 p-2 bg-black/50 rounded-full text-white group-hover:bg-primary-color transition-colors">
            <Edit size={16} />
          </div>
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
      </Link>
      <div className="p-4 py-2 flex justify-between items-center border-t border-gray-700/50">
        <div className="flex items-center gap-4 text-sm text-gray-300">
          <Tooltip position={"top"} tooltipText="Views">
            <div className="flex items-center gap-1" title="Views">
              <Eye size={14} />
              <span>{banner.viewCount}</span>
            </div>
          </Tooltip>

          <Tooltip position={"top"} tooltipText="Generations">
            <div className="flex items-center gap-1" title="Generations">
              <Zap size={14} />
              <span>{banner.generationCount}</span>
            </div>
          </Tooltip>
        </div>
        <button
          onClick={handleShare}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors z-10"
          aria-label="Share banner"
        >
          <Share2 size={16} />
        </button>
      </div>
    </div>
  );
};
