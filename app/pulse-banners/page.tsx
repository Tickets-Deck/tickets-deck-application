"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useFetchAllBanners } from "../api/apiClient";
import { IBanner } from "../models/IBanner";
import { ApplicationRoutes } from "../constants/applicationRoutes";

const PulseBannersPage = () => {
  const [banners, setBanners] = useState<IBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 9; // For a 3x3 grid

  // Changed to a hook that fetches all banners publicly
  const fetchAllBanners = useFetchAllBanners();

  useEffect(() => {
    // This page is public, so no authentication is needed.
    const loadBanners = async () => {
      try {
        setLoading(true);
        const response = await fetchAllBanners(currentPage, limit);
        // The public API returns a paginated response: { data: IBanner[], meta: {...} }
        setBanners(response.data.data);
        setTotalPages(response.data.meta.lastPage);
        setError(null);
      } catch (err) {
        setError("Failed to fetch banners.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadBanners();
  }, [currentPage, limit]);

  return (
    <div className="container mx-auto p-4 py-8 pb-16">
      <div className="flex flex-row justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold">
          Discover PulseCard Banners
        </h1>
        <Link
          href={ApplicationRoutes.CreatePulseCard}
          className="bg-primary-color hover:bg-dark-grey-2 text-white font-normal py-2 px-4 rounded transition-colors duration-200 whitespace-nowrap"
        >
          Create Yours
        </Link>
      </div>
      {loading && banners.length === 0 && (
        <p className="text-center">Loading...</p>
      )}
      {error && <p className="text-center text-red-500">Error: {error}</p>}
      {!loading && !error && banners.length === 0 && (
        <p>No banners have been created on the platform yet.</p>
      )}
      {banners.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {banners.map((banner) => (
              <div
                key={banner.id}
                className="border rounded-lg shadow-lg overflow-hidden flex flex-col"
              >
                <Link
                  href={`${ApplicationRoutes.PulseCard}/${banner.id}`}
                  className="block group"
                >
                  <div className="overflow-hidden">
                    <img
                      src={banner.configuration.frameImageUrl}
                      alt={banner.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 flex-grow">
                    <h2 className="text-xl font-semibold truncate">
                      {banner.title}
                    </h2>
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>Views: {banner.viewCount}</span>
                      <span>Usage: {banner.generationCount}</span>
                    </div>
                  </div>
                </Link>
                {banner.event && banner.event.id && (
                  <div className="p-4 py-2 mt-auto border-t bg-gray-50 flex flex-row justify-between">
                    <p className="text-sm text-gray-500">Linked Event:</p>
                    <Link
                      href={`${ApplicationRoutes.GeneralEvent}${banner.event.id}`}
                      className="text-blue-600 hover:underline font-semibold max-w-[65%] text-ellipsis overflow-hidden whitespace-nowrap"
                    >
                      {banner.event.title}
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 space-x-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1 || loading}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
              >
                Previous
              </button>
              <span className="text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages || loading}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PulseBannersPage;
