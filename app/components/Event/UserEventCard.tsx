import Link from "next/link";
import { FunctionComponent, ReactElement, useContext } from "react";
import { Icons } from "../ui/icons";
import Image from "next/image";
import moment from "moment";
import { EventResponse } from "@/app/models/IEvents";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";
import { ToastContext } from "@/app/context/ToastCardContext";

interface UserEventCardProps {
    event: EventResponse;
}

const UserEventCard: FunctionComponent<UserEventCardProps> = ({ event }): ReactElement => {

    const toast = useContext(ToastContext);

    function shareEvent(eventUrl: string) {
        navigator.clipboard
            .writeText(`${event.title} - Ticketsdeck Events: ${eventUrl}`)
            .then(() => {
                toast?.logSuccess(`Success`, `The link to ${event.title} has been copied.`);
            })
            .catch((error) => {
                toast?.logError(`Error`, `Failed to copy event link. Please try again.`);
            });
    };

    return (
        <div className={`flex flex-col relative w-full overflow-x-auto snap-center md:w-full px-[10px] pt-[20px] pb-[10px] rounded-xl min-[520px]:overflow-hidden h-[300px] max-h-full bg-dark-grey-2`}>
            <div className='z-[2] h-32 w-full rounded-xl overflow-hidden mb-2 relative after:bg-[linear-gradient(180deg,_rgba(0,0,0,0)_4.17%,_rgba(#000,_0.2)_100%)] after:size-full after:top-0 after:left-0 after:absolute after:opacity-100 after:pointer-events-none hover:after:opacity-0 [&_img]:hover:scale-110 hover:brightness-110'>
                {event.isArchived ? (
                    <Image src={event.mainImageUrl} alt='Event flyer' fill />
                ) : (
                    <Link
                        className="size-full"
                        href={`/event/${event.id}`}>
                        <Image src={event.mainImageUrl} alt='Event flyer' fill className="object-cover transition-all" />
                    </Link>
                )}
            </div>
            <div className='flex items-start z-[2]'>
                <div className='basis-[85%] w-[76%] flex flex-col gap-1'>
                    <h3 className='text-left max-w-full whitespace-nowrap text-ellipsis overflow-hidden text-base font-Mona-Sans-Wide font-medium w-fit'>
                        {event.title}
                    </h3>
                    <div className='flex items-center gap-1'>
                        <span className='text-sm text-white/80 font-medium'>
                            {moment(event.startDate).format("MMM DD")}
                        </span>
                        <span className='size-[0.188rem] bg-white rounded-full block'></span>
                        <span className='text-sm text-white/80 opacity-80'>{moment(event.startDate).format("hh:mm a")}</span>
                    </div>
                    <div className='inline-flex items-center gap-0.5 w-full'>
                        <Icons.LocationPin className='w-4 min-w-4 h-4' />
                        <p className='text-sm font-light max-w-full text-ellipsis overflow-hidden whitespace-nowrap capitalize'>
                            {event.venue}
                        </p>
                    </div>
                </div>
                <div className='basis-[15%] flex flex-col items-end justify-between h-full'>
                    <div className='flex gap-[0.45rem]'>
                        <button
                            className='size-[1.875rem] rounded-full grid place-items-center cursor-pointer bg-[#d5542a] hover:bg-[darken(#d5542a,_amount:10%)]'
                            onClick={() =>
                                shareEvent(
                                    `${window.location.origin +
                                    ApplicationRoutes.GeneralEvent +
                                    event.id
                                    }`
                                )
                            }
                        >
                            <Icons.Share className='size-[0.8rem]' />
                        </button>
                    </div>
                    <p className='text-xs text-grey-3'>{event.allowedGuestType}</p>
                </div>
            </div>

            <div className='flex flex-row gap-1 mt-auto'>
                <Link
                    className='z-[2] primaryButton !w-full justify-center hover:bg-white [&_button]:hover:text-primary-color transition-all'
                    href={ApplicationRoutes.UserEventDetails(event.id)}
                >
                    <button className='text-sm cursor-pointer bg-transparent text-white border-none outline-none mt-auto'>
                        View details
                    </button>
                </Link>
                <Link
                    className='z-[2] primaryButton !w-full justify-center !bg-white !text-primary-color hover:!bg-container-grey [&_button]:hover:!text-white transition-all'
                    href={ApplicationRoutes.UserEventDetails(event.id)}
                >
                    <button className='text-sm cursor-pointer bg-transparent border-none outline-none mt-auto'>
                        Check In
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default UserEventCard;
