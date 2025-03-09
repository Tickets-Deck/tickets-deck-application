"use client";
import { FunctionComponent, ReactElement, useContext } from "react";
import Image from "next/image";
import images from "../../../public/images";
import Link from "next/link";
import Tooltip from "../custom/Tooltip";
import EventCard from "../Event/EventCard";
import { EventResponse } from "@/app/models/IEvents";
import ComponentLoader from "../Loader/ComponentLoader";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";
import { Icons } from "../ui/icons";
import { TicketResponse } from "@/app/models/ITicket";
import { Icon } from "@fluentui/react";
import moment from "moment";

interface FeaturedEventsProps {
    isNotHomepage?: boolean;
    featuredEvents: EventResponse[];
    isFetchingEvents: boolean;
}

const FeaturedEvents: FunctionComponent<FeaturedEventsProps> = ({
    isNotHomepage,
    featuredEvents,
    isFetchingEvents,
}): ReactElement => {
    // const [retrievedFeaturedEvents, setRetrievedFeaturedEvents] = useState<EventResponse[]>();

    // function persistFeaturedEvents() {
    //     if (events.length > 0 && !sessionStorage.getItem(StorageKeys.FeaturedEvents)) {
    //         sessionStorage.setItem(StorageKeys.FeaturedEvents, JSON.stringify(events.slice(0, 3)));
    //     }
    // }

    // function retrieveFeaturedEvents() {
    //     const _featuredEvents = sessionStorage.getItem(StorageKeys.FeaturedEvents);

    //     if (_featuredEvents && _featuredEvents.length > 0) {
    //         setRetrievedFeaturedEvents(JSON.parse(_featuredEvents));
    //         return;
    //     }

    //     setRetrievedFeaturedEvents(events.slice(0, 3));
    // }

    return (
        <section className='sectionPadding !py-[4.5rem] bg-dark-grey flex items-start relative text-white flex-col sm:gap-6 gap-2 pt-[6.5rem] pb-[4.5rem]'>
            <div className='flex items-start justify-between w-full mb-4'>
                <div className=''>
                    <div className='flex items-center gap-1'>
                        <span className='text-[30px] font-medium font-Mona-Sans-Wide'>
                            Featured Events
                        </span>
                        <span className="text-[30px]">🎭</span>
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
                                <Icons.ChevronRight stroke="white" />
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

            <div className="bg-container-grey mb-4 p-1 rounded-lg max-w-full overflow-x-auto md:overflow-auto">
                <div className="flex flex-row text-nowrap space-x-2 text-sm">
                    <span className="p-2 px-3 bg-primary-color text-white rounded-md">All</span>
                    <span className="p-2 px-3 bg-transparent text-white/60 rounded-md cursor-pointer hover:text-white hover:bg-white/10">Comedy</span>
                    <span className="p-2 px-3 bg-transparent text-white/60 rounded-md cursor-pointer hover:text-white hover:bg-white/10">Music</span>
                    <span className="p-2 px-3 bg-transparent text-white/60 rounded-md cursor-pointer hover:text-white hover:bg-white/10">Sports</span>
                    <span className="p-2 px-3 bg-transparent text-white/60 rounded-md cursor-pointer hover:text-white hover:bg-white/10">Arts & Theatre</span>
                </div>
            </div>

            <div className='w-full overflow-x-auto relative overflow-hidden mb-4'>
                {!isFetchingEvents && featuredEvents.length > 0 && (
                    <div className='overflow-x-auto snap-mandatory grid sm:grid-cols-2 lg:grid-cols-4 gap-6 flex-nowrap'>
                        {featuredEvents.slice(0, 3).map((event, index) => (
                            // <EventCard
                            //     event={event}
                            //     key={index}
                            // />
                            <div
                                key={event.id}
                                className="bg-gray-900 border-gray-800 overflow-hidden group hover:border-purple-500/50 rounded-xl transition-all duration-300"
                            >
                                <div className="relative">
                                    <Link href={`/event/${event.id}`}>
                                        <Image
                                            src={event.mainImageUrl || "/placeholder.svg"}
                                            alt={event.title}
                                            width={400}
                                            height={200}
                                            className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </Link>
                                    {true && (
                                        <span className="absolute top-2 right-2 flex flex-row items-center space-x-1 text-sm p-1 px-2 rounded-lg bg-primary-color/70">
                                            <Icons.Fire className="h-4 w-4 mr-1" />
                                            Trending
                                        </span>
                                    )}
                                    <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-sm">
                                        &#8358;{(3500).toLocaleString()}
                                    </div>
                                </div>

                                <div className="p-4 pb-2">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-medium text-lg">{event.title}</h3>
                                        <span className="bg-gray-800 text-xs border-[1px] border-white/30 p-1 px-2 rounded-xl">
                                            category
                                        </span>
                                    </div>
                                </div>

                                <div className="p-4 pt-0 text-gray-400 text-sm">
                                    <div className="flex items-center gap-2 mt-2">
                                        <Icons.Calender className="h-4 w-4" fill="white" />
                                        <span>
                                            {moment(event.startDate).format("MMM D")} • {moment(event.startDate).format("hh:mm a")}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Icons.LocationPin className="h-4 w-4 text-purple-400" />
                                        <span className="capitalize">{event.venue}</span>
                                    </div>
                                    <div className="mt-3 text-xs">
                                        {/* <span className="text-yellow-400">{event.tickets.reduce((acc: number, ticket: TicketResponse) => acc + ticket.price, 0)} tickets</span> remaining */}
                                        <span className="text-yellow-400">120 tickets</span> remaining
                                    </div>
                                </div>

                                <Link href={`/event/${event.id}`} className="p-4 pt-0 block">
                                    <button className="primaryButton !w-full !justify-center">View details</button>
                                </Link>
                            </div>
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
                {!isFetchingEvents && featuredEvents.length == 0 && (
                    <div className='text-center w-fit mx-auto'>
                        <br />
                        <br />
                        <p className='text-sm opacity-40'>No events found.</p>
                    </div>
                )}
            </div>

            {!isNotHomepage && !isFetchingEvents && featuredEvents.length > 0 && (
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
