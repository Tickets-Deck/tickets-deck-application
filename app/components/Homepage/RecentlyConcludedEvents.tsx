import React, { useEffect, useMemo, useRef, useState } from "react";
import { EventResponse } from "@/app/models/IEvents";
import moment from "moment";
import Image from "next/image";
import { buildCloudinaryImageUrl } from "@/utils/getCloudinaryImageUrl";
import Link from "next/link";
import { formatStoredDate } from "@/utils/dateformatter";
import { useFetchPastEvents } from "@/app/api/apiClient";
import { StorageKeys } from "@/app/constants/storageKeys";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";

type Props = {};

export default function RecentlyConcludedEvents({}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [concludedEvents, setConcludedEvents] = useState<EventResponse[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const fetchPastEvents = useFetchPastEvents();

  useEffect(() => {
    const fetchAndStorePastEvents = async () => {
      setIsFetching(true);
      try {
        const response = await fetchPastEvents(1, 5, "newest"); // Fetch first 5 for the homepage
        if (response?.data) {
          const pastEvents = response.data;
          setConcludedEvents(pastEvents);
          localStorage.setItem(
            StorageKeys.PastEvents,
            JSON.stringify(pastEvents)
          );
          localStorage.setItem(StorageKeys.PastEventsPage, "1");
        }
      } catch (error) {
        console.error("Failed to fetch past events:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchAndStorePastEvents();
  }, []);

  useEffect(() => {
    if (concludedEvents.length <= 3) return; // No need to scroll if not enough items

    const interval = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({
          left: 320, // Adjust based on card width
          behavior: "smooth",
        });

        // Reset to start if reached end
        if (
          scrollRef.current.scrollLeft + scrollRef.current.clientWidth >=
          scrollRef.current.scrollWidth
        ) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        }
      }
    }, 5000); // every 5 seconds

    return () => clearInterval(interval);
  }, [concludedEvents]);

  if (isFetching) {
    return null; // Or a skeleton loader
  }

  if (concludedEvents.length === 0) {
    return null;
  }

  return (
    <section className="sectionPadding !py-[4.5rem] bg-dark-grey text-white sm:gap-6 gap-2 pt-[6.5rem] !pb-[2.5rem]">
      <div className="mx-auto px-0">
        <h2 className="text-white text-xl font-semibold mb-4">
          Recently Concluded Events
        </h2>
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide"
        >
          {concludedEvents.map((event) => (
            <div
              key={event.id}
              className="flex-none w-80 bg-white rounded-2xl p-4 shadow-md"
            >
              <Link
                href={`${ApplicationRoutes.GeneralEvent}${event.id}`}
                className="w-full h-32 bg-gray-300 rounded-xl mb-4 block relative overflow-hidden group"
              >
                <Image
                  src={buildCloudinaryImageUrl(event.mainImageUrl)}
                  alt={event.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <h3 className="text-black text-lg font-bold truncate capitalize">
                {event.title}
              </h3>
              <p className="text-sm text-gray-600">
                Concluded on {formatStoredDate(event.endDate, "MMM. Do, YYYY")}
              </p>
              <Link
                href={`${ApplicationRoutes.GeneralEvent}${event.id}`}
                className="text-sm text-primary-color font-medium underline mt-1 inline-block"
              >
                See more details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
