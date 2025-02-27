import {
    FunctionComponent,
    ReactElement,
    Dispatch,
    SetStateAction,
} from "react";
import Image from "next/image";
import images from "../../../public/images";
import EventCard from "../Event/EventCard";
import { useRouter } from "next/navigation";
import { EventResponse } from "@/app/models/IEvents";
import ComponentLoader from "../Loader/ComponentLoader";
import Link from "next/link";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";

interface UserEventsGroupProps {
    title: string;
    subText: string;
    eventsData: EventResponse[] | undefined;
    consoleDisplay?: boolean;
    isFetchingEvents?: boolean;
    setIsDeleteConfirmationModalVisible?: Dispatch<SetStateAction<boolean>>;
    setSelectedEvent?: Dispatch<SetStateAction<EventResponse | undefined>>;
    forPastEvents?: boolean;
}

const UserEventsGroup: FunctionComponent<UserEventsGroupProps> = ({
    title,
    subText,
    eventsData,
    consoleDisplay,
    isFetchingEvents,
    setIsDeleteConfirmationModalVisible,
    setSelectedEvent,
    forPastEvents,
}): ReactElement => {

    const { push } = useRouter();

    return (
        <section
            className={`sectionPadding !py-[4.5rem] gap-8 flex-col sm:gap-6  flex bg-dark-grey relative items-start min-h-[calc(100vh-56px)] ${consoleDisplay ? "!px-6 !pt-5 !pb-2 h-full" : ""
                }`}
        >
            <div className='flex items-start justify-between w-full'>
                <div className='w-full sm:w-1/2'>
                    <div className='flex items-center gap-1'>
                        <span className='text-[20px] font-medium font-Mona-Sans-Wide min-[520px]:text-[30px]'>
                            {title}
                        </span>
                        <Image
                            className='h-[1.25rem] w-fit inline-flex'
                            src={images.rocket}
                            alt='Rocket'
                        />
                    </div>
                    <p className='min-[400px]:text-sm w-[80%] opacity-80 text-xs'>
                        {subText}
                    </p>
                </div>
                <div className='hidden min-[550px]:block'>
                    {
                        consoleDisplay ? (
                            <Link href={ApplicationRoutes.CreateEvent}>
                                <button
                                    className='py-[0.4rem] px-[0.8rem] bg-transparent border-none outline-none cursor-pointer rounded-[6px] opacity-80 text-sm text-white hover:bg-white/10 hover:opacity-100'
                                    onClick={() => {
                                        push("/app/event/create");
                                    }}
                                >
                                    Create event
                                </button>
                            </Link>
                        ) : (
                            <></>
                        )
                        // <button>Filter</button>
                    }
                </div>
            </div>
            <div
                className={`w-full overflow-x-auto relative overflow-hidden ${consoleDisplay
                    ? "min-h-[50vh] flex flex-col pr-2 h-full !overflow-y-auto"
                    : ""
                    }`}
            >
                <div
                    className="grid grid-cols-3 gap-4"
                    // "[grid-template-columns:_repeat(auto-fill,_minmax(200px,_1fr))] min-[550px]:[[grid-template-columns:_repeat(auto-fill,_minmax(250px,_1fr))]]"
                >
                    {!isFetchingEvents &&
                        eventsData &&
                        eventsData?.length > 0 &&
                        eventsData
                            .filter((event) =>
                                consoleDisplay
                                    ? event
                                    : forPastEvents
                                        ? new Date(event.startDate) < new Date()
                                        : new Date(event.startDate) >= new Date()
                            )
                            .map((event, index) => {
                                console.log("🚀 ~ .map ~ event:", event)
                                return (
                                    <EventCard
                                        event={event}
                                        // mobileAndActionButtonDismiss
                                        key={index}
                                        // gridDisplay={true}
                                        // consoleDisplay={consoleDisplay}
                                        // setIsDeleteConfirmationModalVisible={
                                        //     setIsDeleteConfirmationModalVisible
                                        // }
                                        // setSelectedEvent={setSelectedEvent}
                                    />
                                )
                            })}
                </div>
                {isFetchingEvents && (
                    <div className='min-[50vh] grid place-items-center'>
                        <ComponentLoader customLoaderColor='#fff' />
                    </div>
                )}
                {!isFetchingEvents && eventsData && eventsData?.length == 0 && (
                    <div className='w-fit mx-auto text-center flex flex-col gap-[0.125rem]'>
                        <br />
                        <br />
                        <p className='text-sm opacity-40'>No events found.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default UserEventsGroup;
