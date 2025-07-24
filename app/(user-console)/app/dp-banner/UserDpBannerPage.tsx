"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Plus } from "lucide-react";
import ComponentLoader from "@/app/components/Loader/ComponentLoader";
import { IBanner } from "@/app/models/IBanner";
import { ISavedDp } from "@/app/models/IDp";
import { SavedDpCard } from "@/app/components/DpBanner/UserDpBanner/SavedDpBannerCard";
import { MyBannerCard } from "@/app/components/DpBanner/UserDpBanner/MyBannerCard";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";
import { useFetchMyBanners, useFetchMyDps } from "@/app/api/apiClient";
import { catchError } from "@/app/constants/catchError";

export default function UserDpBannerPage() {
  const { data: session } = useSession();
  const fetchMyDps = useFetchMyDps();
  const fetchMyBanners = useFetchMyBanners();

  const [myBanners, setMyBanners] = useState<IBanner[]>([]);
  const [savedDps, setSavedDps] = useState<ISavedDp[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (session?.user?.token) {
        setIsLoading(true);
        setError(null);
        try {
          // Fetch both saved DPs and created banners in parallel
          const [dpsResponse, bannersResponse] = await Promise.all([
            fetchMyDps(session.user.token),
            fetchMyBanners(session.user.token),
          ]);

          setSavedDps(dpsResponse.data);
          setMyBanners(bannersResponse.data);
        } catch (e) {
          catchError(e);
          setError("Failed to load your DP Banners. Please try again later.");
        } finally {
          setIsLoading(false);
        }
      } else if (session === null) {
        // Not logged in
        setIsLoading(false);
      }
    };

    fetchData();
  }, [session]);

  if (isLoading) {
    return (
      <div className="h-screen w-full grid place-items-center">
        <ComponentLoader customLoaderColor="#fff" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full p-6 py-7 text-center text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="h-full w-full p-6 py-7 text-white">
      <div className="flex justify-between items-center mb-8">
        <h4 className="text-2xl font-normal">DP Banners</h4>
        <Link href={ApplicationRoutes.CreateDpBanner}>
          <button className="flex items-center gap-2 bg-primary-color hover:bg-primary-color-sub text-white font-semibold px-4 py-2 rounded-md transition-colors">
            <Plus size={18} />
            Create New Banner
          </button>
        </Link>
      </div>

      {/* Saved DPs Section */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
          Saved DPs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {savedDps.length > 0 ? (
            savedDps.map((dp) => <SavedDpCard key={dp.id} dp={dp} />)
          ) : (
            <p className="text-gray-400 col-span-full">
              You haven't generated any DPs yet.
            </p>
          )}
        </div>
      </section>

      {/* My DP Banners Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
          My DP Banners
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {myBanners.length > 0 ? (
            myBanners.map((banner) => (
              <MyBannerCard key={banner.id} banner={banner} />
            ))
          ) : (
            <p className="text-gray-400 col-span-full">
              You haven't created any DP banners yet.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
