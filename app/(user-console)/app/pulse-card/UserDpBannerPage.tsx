"use client";

import React, { useEffect, useState, Fragment } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Plus, Edit, Image as ImageIcon } from "lucide-react";
import ComponentLoader from "@/app/components/Loader/ComponentLoader";
import { IBanner } from "@/app/models/IBanner";
import { ISavedDp } from "@/app/models/IDp";
import { SavedDpCard } from "@/app/components/DpBanner/UserDpBanner/SavedDpBannerCard";
import { BannerInfo } from "@/app/components/DpBanner/UserDpBanner/BannerInfo";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";
import { useFetchMyBanners, useFetchMyDps } from "@/app/api/apiClient";
import { catchError } from "@/app/constants/catchError";
import { Tab } from "@headlessui/react";
import { MyBannerCard } from "@/app/components/DpBanner/UserDpBanner/MyBannerCard";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

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
          setError("Failed to load your Pulse cards. Please try again later.");
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

  const tabs = [
    { name: "My Created Banners", data: myBanners },
    { name: "My Generated Cards", data: savedDps },
  ];

  return (
    <div className="h-full w-full p-6 py-7 text-white">
      <div className="flex justify-between items-center mb-8">
        <h4 className="text-2xl font-normal">My Pulse Cards</h4>
        <Link href={ApplicationRoutes.CreatePulseCard}>
          <button className="flex items-center gap-2 bg-primary-color hover:bg-primary-color-sub text-white font-semibold px-4 py-2 rounded-md transition-colors">
            <Plus size={18} />
            Create New Banner
          </button>
        </Link>
      </div>

      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-6">
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                  "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white text-blue-700 shadow"
                    : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                )
              }
            >
              {tab.name}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {myBanners.length > 0 ? (
                myBanners.map((banner) => (
                  <MyBannerCard key={banner.id} banner={banner} />
                  //   <BannerInfo key={banner.id} banner={banner} />
                ))
              ) : (
                <div className="col-span-full text-center py-16 px-6 bg-gray-800/50 rounded-lg">
                  <Edit className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-white">
                    No banners created
                  </h3>
                  <p className="mt-1 text-sm text-gray-400">
                    Get started by creating a new banner for your campaign.
                  </p>
                  <div className="mt-6">
                    <Link href={ApplicationRoutes.CreatePulseCard}>
                      <button
                        type="button"
                        className="inline-flex items-center rounded-md bg-primary-color px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-color-sub focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        <Plus
                          className="-ml-0.5 mr-1.5 h-5 w-5"
                          aria-hidden="true"
                        />
                        Create Your First Banner
                      </button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {savedDps.length > 0 ? (
                savedDps.map((dp) => <SavedDpCard key={dp.id} dp={dp} />)
              ) : (
                <div className="col-span-full text-center py-16 px-6 bg-gray-800/50 rounded-lg">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-white">
                    No Place Cards generated
                  </h3>
                  <p className="mt-1 text-sm text-gray-400">
                    Your generated profile pictures will appear here.
                  </p>
                </div>
              )}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
