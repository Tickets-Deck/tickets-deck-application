import { IBanner } from "@/app/models/IBanner";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";
import {
  Eye,
  Users,
  Link as LinkIcon,
  MoreVertical,
  Share2,
  Trash2,
  Edit,
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { useToast } from "@/app/context/ToastCardContext";

interface BannerInfoProps {
  banner: IBanner;
}

const getEventStatus = (startDate: string, endDate: string) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (end < now) return { text: "Ended", color: "bg-gray-500" };
  if (start > now) return { text: "Upcoming", color: "bg-blue-500" };
  return { text: "Live", color: "bg-green-500" };
};

export const BannerInfo = ({ banner }: BannerInfoProps) => {
  const toast = useToast();
  const bannerUrl = `${window.location.origin}${ApplicationRoutes.PulseCard}/${banner.id}`;
  const eventStatus = banner.event
    ? getEventStatus(banner.event.startDate, banner.event.endDate)
    : null;

  const handleShare = () => {
    navigator.clipboard.writeText(bannerUrl);
    toast.logSuccess("Copied!", "Banner link copied to clipboard.");
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col justify-between">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg text-white mb-2 truncate pr-2">
            {banner.title}
          </h3>
        </div>

        {banner.event && (
          <div className="flex items-center gap-2 mb-3 text-sm text-gray-400">
            <LinkIcon size={14} />
            <span className="truncate">{banner.event.title}</span>
            {eventStatus && (
              <span
                className={`px-2 py-0.5 text-xs font-semibold rounded-full ${eventStatus.color}`}
              >
                {eventStatus.text}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="bg-gray-900/50 px-4 py-3 flex justify-around text-sm">
        <div className="text-center">
          <p className="font-bold text-lg text-white">
            {banner.generationCount}
          </p>
          <p className="text-gray-400 text-xs flex items-center gap-1">
            <Users size={12} /> Generations
          </p>
        </div>
        <div className="text-center">
          <p className="font-bold text-lg text-white">{banner.viewCount}</p>
          <p className="text-gray-400 text-xs flex items-center gap-1">
            <Eye size={12} /> Views
          </p>
        </div>
      </div>
    </div>
  );
};
