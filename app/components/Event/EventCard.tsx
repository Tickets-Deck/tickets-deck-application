"use client";
import { EventResponse, FeaturedEvent } from "@/app/models/IEvents";
import Image from "next/image";
import Link from "next/link";
import { Icons } from "../ui/icons";
import moment from "moment";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";
import { ToastContext } from "@/app/context/ToastCardContext";
import { useContext } from "react";
import { NairaPrice } from "@/app/constants/priceFormatter";
import { buildCloudinaryImageUrl } from "@/utils/getCloudinaryImageUrl";
import { formatStoredDate } from "@/utils/dateformatter";

function isFeaturedEvent(event: EventResponse | FeaturedEvent): event is FeaturedEvent {
    return "startingPrice" in event && "remainingTickets" in event;
}

const EventCard = ({ event, consoleDisplay }: { event: EventResponse | FeaturedEvent; consoleDisplay?: boolean; }) => {
    const isFeatured = isFeaturedEvent(event);

    const toast = useContext(ToastContext);

    function shareEvent(eventUrl: string) {
        navigator.clipboard
            .writeText(`${event.title} - Ticketsdeck Events: ${eventUrl}`)
            .then(() => {
                toast?.logSuccess(
                    `Success`,
                    `The link to ${event.title} has been copied.`
                );
            })
            .catch((error) => {
                toast?.logError(
                    `Error`,
                    `Failed to copy event link. Please try again.`
                );
            });
    }
    
    return (
        <div className='bg-gray-900 border-gray-800 overflow-hidden flex flex-col group hover:border-purple-500/50 rounded-xl transition-all duration-300'>
            <div className='relative after:bg-[linear-gradient(180deg,_rgba(0,0,0,0)_4.17%,_rgba(0,0,0,0.4)_100%)] after:size-full after:top-0 after:left-0 after:absolute after:opacity-100 after:pointer-events-none after:content-[""] group-hover:after:opacity-0'>
                {event.isArchived ? (
                    <Image
                        src={buildCloudinaryImageUrl(event.mainImageUrl) || "/placeholder.svg"}
                        alt={event.title}
                        width={400}
                        height={200}
                        className='h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105'
                    />
                ) : (
                    <Link href={consoleDisplay ? ApplicationRoutes.UserEventDetails(event.id) : `/event/${event.id}`}>
                        <Image
                            src={buildCloudinaryImageUrl(event.mainImageUrl) || "/placeholder.svg"}
                            alt={event.title}
                            width={400}
                            height={200}
                            className='h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105'
                        />
                    </Link>
                )}
                {isFeatured && event.isTrending && (
                    <span className='absolute top-2 right-2 flex flex-row items-center space-x-1 text-sm p-1 px-2 rounded-lg bg-primary-color/70'>
                        <Icons.Fire className='h-4 w-4 mr-1' />
                        Trending
                    </span>
                )}
                {isFeatured && Number(event.startingPrice) ? (
                    <div className='absolute bottom-2 right-2 text-sm flex flex-col items-end'>
                        <span className='text-[10px] text-white mix-blend-difference shadow-md'>
                            Starting Price:
                        </span>
                        <p className='bg-black/70 backdrop-blur-sm px-2 py-1 rounded z-10'>{`${NairaPrice.format(
                            Number(event.startingPrice)
                        )}`}</p>
                    </div>
                ) : (
                    <></>
                )}
            </div>

            <div className='p-4 pb-2'>
                <div className='flex justify-between items-start'>
                    <h3 className='font-medium text-lg whitespace-nowrap text-ellipsis overflow-hidden w-full'>
                        {event.title}
                    </h3>
                    {event.category && (
                        <span className='bg-gray-800 text-xs border-[1px] border-white/30 p-1 px-2 rounded-xl'>
                            {event.category}
                        </span>
                    )}
                </div>
            </div>

            <div className=' flex justify-between p-4 pt-0'>
                <div className=' text-gray-400 text-sm'>
                    <div className='flex items-center gap-2 mt-2'>
                        <Icons.Calender className='h-4 w-4' fill='white' />
                        <span>
                            {formatStoredDate(event.startDate, "LL")} •{" "}
                            {formatStoredDate(event.startDate, "hh:mm a")}
                        </span>
                    </div>
                    <div className='flex items-center gap-2 mt-1'>
                        <Icons.LocationPin className='h-4 w-4 min-h-4 min-w-4 text-purple-400' />
                        <span className='capitalize text-xs'>{event.venue}</span>
                    </div>
                    {isFeatured ? (
                        event.remainingTickets > 0 && (
                            <div className='mt-3 text-xs'>
                                <span className='text-yellow-400'>
                                    {event.remainingTickets} tickets
                                </span>{" "}
                                remaining
                            </div>
                        )
                    ) : (
                        <></>
                        // <p className='text-xs mt-3 text-grey-3'>{event.allowedGuestType}</p>
                    )}
                </div>
                {!isFeatured && (
                    <button
                        className='size-[1.875rem] min-h-[1.875rem] min-w-[1.875rem] rounded-full grid place-items-center cursor-pointer bg-[#d5542a] hover:bg-[darken(#d5542a,_amount:10%)]'
                        onClick={() =>
                            shareEvent(
                                `${window.location.origin +
                                ApplicationRoutes.GeneralEvent +
                                event.id
                                }`
                            )
                        }
                    >
                        {" "}
                        <Icons.Share className='size-[0.8rem]' />
                    </button>
                )}
            </div>

            {
                consoleDisplay ?
                    <Link
                        className='p-4 pt-0 block !mt-auto'
                        href={ApplicationRoutes.UserEventDetails(event.id)}
                    >
                        <button className='primaryButton !w-full !justify-center'>
                            View details
                        </button>
                    </Link> :
                    <Link href={`/event/${event.id}`} className='p-4 pt-0 block !mt-auto'>
                        <button className='primaryButton !w-full !justify-center'>
                            View details
                        </button>
                    </Link>
            }
        </div>
    );
};
export default EventCard;
