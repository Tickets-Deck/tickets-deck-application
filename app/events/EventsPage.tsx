"use client";
import {
    FunctionComponent,
    ReactElement,
    useContext,
    useEffect,
    useState,
} from "react";
import EventsGroup from "../components/events/EventsGroup";
import { useFetchEvents, useFetchPastEvents } from "../api/apiClient";
import { EventResponse } from "../models/IEvents";
import PageHeroSection from "../components/shared/PageHeroSection";
import { ToastContext } from "../context/ToastCardContext";

interface AllEventsProps { }

const AllEvents: FunctionComponent<AllEventsProps> = (): ReactElement => {
    const fetchEvents = useFetchEvents();
    const [currentPastEventsPage, setCurrentPastEventsPage] = useState(1);

    // const fetchPastEvents = useFetchPastEvents();

    // const toasthandler = useContext(ToastContext);

    const [isFetchingEvents, setIsFetchingEvents] = useState(true);
    const [isFetchingPastEvents, setIsFetchingPastEvents] = useState(true);
    const [events, setEvents] = useState<EventResponse[]>([]);
    const [pastEvents, setPastEvents] = useState<EventResponse[]>();

    async function handleFetchEvents() {
        // Start loader
        setIsFetchingEvents(true);

        await fetchEvents()
            .then((response) => {
                if (response) {
                    console.log("Events: ", response.data);
                    setEvents(response.data);
                }
            })
            .catch((err) => {
                console.log(err);
                // toasthandler?.logError(
                //     "Error",
                //     "An error occurred while fetching events."
                // );
            })
            .finally(() => {
                // Stop loader
                setIsFetchingEvents(false);
            });
    }

    async function handleFetchPastEvents() {
        // Start loader
        setIsFetchingPastEvents(true);

        await useFetchPastEvents(currentPastEventsPage)
            .then((response) => {
                if (response) {
                    console.log("Past events: ", response.data);

                    if (response?.data) {
                        // Use functional update to avoid stale closure issues
                        setPastEvents(prevEvents => pastEvents && currentPastEventsPage > 1 ? [...(prevEvents || []), ...response.data] : [...response.data]);    
                    }
                }
            })
            .catch((err) => {
                console.log(err);
                // toasthandler?.logError(
                //     "Error",
                //     "An error occurred while fetching events."
                // );
            })
            .finally(() => {
                // Stop loader
                setIsFetchingPastEvents(false);
            });
    }

    useEffect(() => {
        handleFetchEvents();
        // handleFetchPastEvents();
    }, []);

    useEffect(() => {
        handleFetchPastEvents();
    }, [currentPastEventsPage]);

    return (
        <div className='text-white'>
            {/* <PageHeroSection 
                title="All Events"
                description="Dear superstar, below is a list of all events available at the moment."
            /> */}
            <PageHeroSection
                videoUrl='https://res.cloudinary.com/dvxqk1487/video/upload/v1704506218/videos/Pexels_Videos_2022395_1080P_po4ic2.mp4'
                title={
                    <h2 className='font-medium text-4xl'>
                        Escape the Ordinary: <br />
                        <span className='font-Mona-Sans-Wide text-secondary-color'>
                            Dive into Event Paradise!
                        </span>
                    </h2>
                }
                description={
                    <p className='text-primary-color-sub'>
                        Embark on a journey through events that'll transport you to a world
                        of excitement and wonder.{" "}
                        <span className='text-white'>Ready to be amazed?</span> 🚀
                    </p>
                }
            />

            {/* 
            <section>
                Category
            </section> 
            */}


            <EventsGroup
                eventsData={events}
                title='All Events'
                subText='Dear superstar, below is a list of all events available at the moment.'
                isFetchingEvents={isFetchingEvents}
            />
            {pastEvents && pastEvents.length > 0 && (
                <>
                    <EventsGroup
                        eventsData={pastEvents}
                        title='Past Events'
                        subText='Browse through our collection of past events.'
                        isFetchingEvents={isFetchingPastEvents}
                        forPastEvents
                    />

                    <div className='py-5 grid place-items-center bg-dark-grey'>
                        <button
                            onClick={() =>
                                setCurrentPastEventsPage(currentPastEventsPage + 1)
                            }
                            className='w-fit rounded-[3.125rem] cursor-pointer text-sm py-[0.8rem] px-[1.6rem] border-none bg-white text-dark-grey flex items-center gap-2 hover:opacity-60'
                        >
                            See More
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default AllEvents;
