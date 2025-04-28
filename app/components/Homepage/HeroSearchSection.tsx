import {
    ChangeEvent,
    FunctionComponent,
    ReactElement,
    useEffect,
    useRef,
    useState,
} from "react";
import useOuterClick from "@/app/hooks/useOuterClick";
import { EventResponse } from "@/app/models/IEvents";
import Link from "next/link";
import moment from "moment";
import { Icons } from "../ui/icons";
import { scrollWindow } from "../PageScroll/ScrollWindow";
import Image from "next/image";
import images from "@/public/images";
import useResponsiveness from "@/app/hooks/useResponsiveness";
import { ITrendingEventCategory } from "@/app/models/IEventCategory";
import { formatStoredDate } from "@/utils/dateformatter";

interface HeroSearchSectionProps {
    events: EventResponse[];
    isFetchingEvents: boolean;
    trendingEventCategories: ITrendingEventCategory[] | undefined
}

const HeroSearchSection: FunctionComponent<HeroSearchSectionProps> = ({
    events: _events,
    isFetchingEvents,
    trendingEventCategories
}): ReactElement => {
    const events = _events.filter((event) => new Date(event.startDate) >= new Date());

    const windowRes = useResponsiveness();
    const isMobile = windowRes.width && windowRes.width < 768;
    const onMobile = typeof isMobile == "boolean" && isMobile;
    const onDesktop = typeof isMobile == "boolean" && !isMobile;

    const [eventName, setEventName] = useState<string>();
    const [eventNameErrorMsg, setEventNameErrorMsg] = useState(false);
    const [searchResults, setSearchResults] = useState<EventResponse[]>();
    const [searchResultsIsVisible, setSearchResultsIsVisible] = useState(false);

    const inputAreaContainerRef = useRef<HTMLDivElement>(null);

    async function handleEventSearch(e: ChangeEvent<HTMLInputElement>) {
        if (!searchResults || !eventName) {
            setSearchResultsIsVisible(false);
            return;
        }
        // if (!eventName) {
        //     setSearchResultsIsVisible(false);
        //     return;
        // }
        if (e.target.value.length == 0) {
            setSearchResults(undefined);
            setSearchResultsIsVisible(false);
            return;
        }

        setSearchResultsIsVisible(true);
        setSearchResults(
            events.filter((event) =>
                event.title.toLowerCase().includes(eventName.toLowerCase())
            )
        );
    }

    useEffect(() => {
        if (eventName) {
            setSearchResults(
                events.filter((event) =>
                    event.title.toLowerCase().includes(eventName.toLowerCase())
                )
            );
        }
    }, [eventName]);

    useEffect(() => {
        if (!searchResultsIsVisible) {
            setSearchResults(undefined);
            setEventName("");
        }
    }, [searchResultsIsVisible]);

    useOuterClick(inputAreaContainerRef, setSearchResultsIsVisible);

    return (
        <form className='after:absolute py-6 px-5 rounded-[1.5rem] bg-[#1111114d] backdrop-blur-[0.469rem] sm:p-5 border-t-[1.5px] border-white relative flex flex-col gap-4 items-center justify-center shadow-[0px_10px_24px_2px_rgba(83,215,255,0.15)] [&_button]:primaryButton [&_button]:w-full [&_button]:justify-center'>
            <div className='flex flex-col text-center sm:text-left gap-1'>
                <p className='text-base md:text-xl [&_span]:text-secondary-color'>
                    <span>Catch the train,</span> before those tickets get sold out.
                </p>
                <p className='text-[0.95rem] opacity-80 sm:text-sm [&_span]:text-secondary-color'>
                    You can quickly <span>search</span> for an event here.
                </p>
            </div>
            <div className={"w-full relative"} ref={inputAreaContainerRef}>
                <div className='flex flex-col gap-2 sm:gap-1 w-full'>
                    <div className="h-fit w-full relative">
                        <Icons.Search stroke="#fff" className="absolute left-3 top-1/2 -translate-y-1/2 size-6 pointer-events-none" />
                        <input
                            type='text'
                            value={eventName}
                            className='p-2 py-[0.65rem] md:py-[0.8rem] md:px-[0.65rem] !pl-11 w-full bg-black/30 border border-white/30 focus-within:border-white/60 rounded-xl outline-none text-white'
                            placeholder='Event name'
                            onClick={() => onMobile && scrollWindow(160)}
                            onChange={(e) => {
                                if (e.target.value.length == 1) {
                                    setEventName(e.target.value);
                                    setSearchResultsIsVisible(true);
                                    return;
                                }
                                setEventName(e.target.value);
                                handleEventSearch(e);
                            }}
                        />
                    </div>
                    {eventNameErrorMsg && (
                        <div className='flex items-center gap-[0.125rem]'>
                            <Icons.Info className='size-[0.8rem]' />{" "}
                            <p className='text-xs font-normal'>
                                Please type the name of the event
                            </p>
                        </div>
                    )}
                </div>
                {searchResultsIsVisible && (
                    <div className='absolute w-full top-10 md:top-[3.5rem] p-2 gap-[0.1rem] rounded-[0.625rem] flex flex-col bg-black/30 backdrop-blur-[10px] max-h-[160px] overflow-y-auto'>
                        {searchResults?.map((event, index) => (
                            <Link
                                href={`/event/${event.id}`}
                                onClick={() => setSearchResultsIsVisible(false)}
                            >
                                <div
                                    className='rounded-[0.375rem] cursor-pointer p-[10px] hover:bg-white/10'
                                    key={index}
                                >
                                    <div className='flex flex-row justify-between items-center gap-4'>
                                        <h4 className='text-sm font-medium w-full max-w-full overflow-hidden whitespace-nowrap text-ellipsis'>
                                            {event.title}
                                        </h4>
                                        <h4 className='min-w-fit opacity-80 text-xs font-medium'>
                                            {formatStoredDate(event?.startDate, "MMM. Do YYYY")}
                                        </h4>
                                    </div>
                                    {/* <p>Starting price: &#8358;{event.ticketPrice.amount.toLocaleString()}</p> */}
                                </div>
                            </Link>
                        ))}
                        {searchResults?.length == 0 && (
                            <div className='flex items-center gap-0.5 p-2'>
                                <span>
                                    <Image
                                        src={images.sad_face}
                                        alt='Sad face emoji'
                                        width={36}
                                        height={36}
                                    />
                                </span>
                                <p>There are no events based on your search keyword</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="mt-2 pt-4 w-full border-t border-gray-700">
                <p className="text-sm text-gray-400 mb-2">Popular searches:</p>
                <div className="flex flex-wrap gap-2">
                    {
                        trendingEventCategories?.map((category, index) => (
                            <span key={index} className="bg-gray-200/10 border-[1px] border-white/20 p-1 px-3 text-sm rounded-lg hover:bg-primary-color/30 cursor-pointer">
                                {category.name}
                            </span>
                        ))
                    }
                </div>
            </div>
            {/* <button type="submit" style={isLoading ? { opacity: 0.6, pointerEvents: 'none' } : {}} disabled={isLoading}>
                        {
                            isLoading ?
                                <span style={{ width: '16px', height: '16px', position: 'relative', scale: '2.2' }}><ComponentLoader /></span>
                                :
                                <span>Let's search</span>
                        }
                    </button> */}
        </form>
    );
};

export default HeroSearchSection;
