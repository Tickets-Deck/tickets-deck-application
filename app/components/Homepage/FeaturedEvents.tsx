"use client";
import { FunctionComponent, ReactElement, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Tooltip from "../custom/Tooltip";
import { FeaturedEvent } from "@/app/models/IEvents";
import ComponentLoader from "../Loader/ComponentLoader";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";
import { Icons } from "../ui/icons";
import moment from "moment";
import { useApplicationContext } from "@/app/context/ApplicationContext";
import { NairaPrice } from "@/app/constants/priceFormatter";
import { IEventCategory } from "@/app/models/IEventCategory";
import EventCard from "../Event/EventCard";

interface FeaturedEventsProps {
  isNotHomepage?: boolean;
  featuredEvents: FeaturedEvent[];
  isFetchingEvents: boolean;
}

const FeaturedEvents: FunctionComponent<FeaturedEventsProps> = ({
  isNotHomepage,
  featuredEvents,
  isFetchingEvents,
}): ReactElement => {
  const { eventCategories } = useApplicationContext();

  const [featuredEventCategories, setFeaturedEventCategories] =
    useState<IEventCategory[]>();
  const [selectedEventCategoryId, setSelectedEventCategoryId] =
    useState<string>("All");
  const [filteredFeaturedEvents, setFilteredFeaturedEvents] =
    useState<FeaturedEvent[]>();

  useEffect(() => {
    if (!eventCategories || !featuredEvents) return;

    const categoryMap = new Map<string, IEventCategory>(); // Using a map to ensure uniqueness

    featuredEvents.forEach((event) => {
      const category = eventCategories.find(
        (cat) => cat.id === event.categoryId
      );
      if (category) categoryMap.set(category.id, category); // Using the 'id' as the key ensures uniqueness
    });

    setFeaturedEventCategories(Array.from(categoryMap.values()));
  }, [featuredEvents, eventCategories]);

  useEffect(() => {
    if (featuredEvents.length == 0) return;
    setFilteredFeaturedEvents(featuredEvents);
  }, [featuredEvents]);

  useEffect(() => {
    if (selectedEventCategoryId == "All") {
      setFilteredFeaturedEvents(featuredEvents);
      return;
    }

    const _filteredFeaturedEvents = featuredEvents.filter(
      (event) => event.categoryId == selectedEventCategoryId
    );
    setFilteredFeaturedEvents(_filteredFeaturedEvents);
  }, [selectedEventCategoryId]);

  return (
    <section className='sectionPadding !py-[4.5rem] bg-dark-grey flex items-start relative text-white flex-col sm:gap-6 gap-2 pt-[6.5rem] pb-[4.5rem]'>
      <div className='flex items-start justify-between w-full mb-4'>
        <div className=''>
          <div className='flex items-center gap-1'>
            <span className='text-[30px] font-medium font-Mona-Sans-Wide'>
              Featured Events
            </span>
            {/* <span className="text-[30px]">🎭</span> */}
          </div>
          <p className='text-base text-grey w-auto opacity-80'>
            Based on the superstar that you are, we have carefully gathered top
            events for you.{" "}
          </p>
        </div>
        <div className='hidden sm:block'>
          {!isNotHomepage && (
            <Link href='/events'>
              <button className='py-[0.4rem] px-[0.8rem] flex flex-row items-center gap-2 bg-transparent border-none cursor-pointer rounded-md opacity-80 text-sm text-white whitespace-nowrap hover:bg-white/10 hover:opacity-100'>
                See all events
                <Icons.ChevronRight stroke='white' />
              </button>
            </Link>
          )}
          {isNotHomepage && (
            <Tooltip tooltipText='More Info'>
              <button className='rounded-full bg-white/0.1 p-0 size-8 grid place-items-center'>
                <svg
                  width='12'
                  height='17'
                  viewBox='0 0 12 17'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M5.09071 12.4729V12.1915C5.09071 11.6719 5.19175 11.21 5.39382 10.8058C5.61033 10.4017 5.87736 10.0264 6.1949 9.67997C6.52688 9.33356 6.88051 8.99436 7.2558 8.66238C7.63108 8.3304 7.97749 7.98399 8.29504 7.62314C8.62702 7.26229 8.89405 6.86536 9.09612 6.43234C9.31263 5.99932 9.42088 5.50857 9.42088 4.96008C9.42088 4.32499 9.27654 3.79815 8.98787 3.37957C8.71362 2.94655 8.32391 2.62179 7.81872 2.40528C7.31353 2.17433 6.70731 2.05886 6.00004 2.05886C4.90307 2.05886 4.04425 2.32589 3.42359 2.85995C2.80293 3.394 2.46373 4.10126 2.406 4.98173H0.565674C0.62341 4.02909 0.88322 3.22079 1.34511 2.55683C1.82142 1.87844 2.46373 1.36603 3.27203 1.01962C4.09477 0.673207 5.04019 0.5 6.1083 0.5C6.94547 0.5 7.68881 0.601037 8.33834 0.803112C9.0023 1.00519 9.55801 1.30108 10.0055 1.6908C10.4673 2.06608 10.821 2.52075 11.0664 3.0548C11.3117 3.57442 11.4344 4.16622 11.4344 4.83018C11.4344 5.49414 11.3189 6.08593 11.088 6.60555C10.8715 7.12517 10.59 7.59427 10.2436 8.01286C9.8972 8.41701 9.52914 8.79229 9.13942 9.1387C8.76414 9.48512 8.40329 9.82431 8.05688 10.1563C7.71046 10.4738 7.42179 10.8058 7.19084 11.1522C6.97433 11.4842 6.86608 11.8523 6.86608 12.2564V12.4729H5.09071ZM5.02575 16.5V14.4865H6.97433V16.5H5.02575Z'
                    fill='#ADADBC'
                  />
                </svg>
              </button>
            </Tooltip>
          )}
        </div>
      </div>

      {featuredEventCategories && featuredEventCategories.length > 0 && (
        <div className='bg-container-grey mb-4 p-1 rounded-lg max-w-full overflow-x-auto md:overflow-auto'>
          <div className='flex flex-row text-nowrap space-x-2 text-sm'>
            <span
              onClick={() => setSelectedEventCategoryId("All")}
              className={`p-2 px-3 rounded-md cursor-pointer ${
                selectedEventCategoryId == "All"
                  ? "bg-primary-color text-white"
                  : ""
              }`}
            >
              All
            </span>
            {featuredEventCategories?.map((category) => (
              <span
                onClick={() => setSelectedEventCategoryId(category.id)}
                key={category?.id}
                className={`p-2 px-3 rounded-md cursor-pointer 
                                    ${
                                      selectedEventCategoryId == category.id
                                        ? "bg-primary-color text-white"
                                        : "bg-transparent text-white/60 hover:text-white hover:bg-white/10"
                                    }`}
              >
                {category?.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className='w-full overflow-x-auto relative overflow-hidden mb-4'>
        {!isFetchingEvents &&
          filteredFeaturedEvents &&
          filteredFeaturedEvents.length > 0 && (
            <div className='overflow-x-auto snap-mandatory grid sm:grid-cols-2 lg:grid-cols-4 gap-6 flex-nowrap'>
              {filteredFeaturedEvents.slice(0, 4).map((event) => (
                // <EventCard
                //     event={event}
                //     key={index}
                // />
                <EventCard event={event} key={event.id} />
              ))}
            </div>
          )}
        {isFetchingEvents && (
          <>
            <br />
            <br />
            <ComponentLoader customLoaderColor='#fff' />
          </>
        )}
        {!isFetchingEvents &&
          filteredFeaturedEvents &&
          filteredFeaturedEvents.length == 0 && (
            <div className='text-center w-fit mx-auto'>
              <br />
              <br />
              <p className='text-sm opacity-40'>No events found.</p>
            </div>
          )}
      </div>

      {!isNotHomepage &&
        !isFetchingEvents &&
        filteredFeaturedEvents &&
        filteredFeaturedEvents.length > 0 && (
          <Link
            href={ApplicationRoutes.GeneralEvents}
            className='tertiaryButton my-0 mx-auto'
          >
            See all events
          </Link>
        )}
      {/* {
                events.length > 3 &&
                <>
                    <span className={styles.controller}><CaretLeftIcon /></span>
                    <span className={styles.controller}><CaretRightIcon /></span>
                </>
            } */}
    </section>
  );
};

export default FeaturedEvents;
