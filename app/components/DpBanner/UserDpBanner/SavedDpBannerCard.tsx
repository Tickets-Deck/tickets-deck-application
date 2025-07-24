import { ApplicationRoutes } from "@/app/constants/applicationRoutes";
import { ISavedDp } from "@/app/models/IDp";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface SavedDpCardProps {
  dp: ISavedDp;
}

export const SavedDpCard = ({ dp }: SavedDpCardProps) => {
  return (
    <div className="bg-dark-grey-2 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105 group">
      <Link href={`${ApplicationRoutes.UserDpBanner}/${dp.banner.id}`}>
        <div className="relative h-48 bg-gray-700">
          <Image
            src={dp.generatedImageUrl}
            alt={`Generated DP for ${dp.banner.title}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-white truncate">
            {dp.banner.title}
          </h3>
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
            <Calendar size={14} />
            Generated:{" "}
            {format(new Date(dp.createdAt), "MMM d, yyyy || hh:mm a")}
          </p>
        </div>
      </Link>
    </div>
  );
};
