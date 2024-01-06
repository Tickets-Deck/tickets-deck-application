"use client"
import { FunctionComponent, ReactElement, useEffect, useState } from "react";
import styles from "../../styles/Events.module.scss";
import useResponsive from "../../hooks/useResponsiveness";
import EventsGroup from "../../components/events/EventsGroup";
import { useFetchEventsByPublisherId } from "@/app/api/apiClient";
import { useSession } from "next-auth/react";
import { catchError } from "@/app/constants/catchError";
import { useRouter } from "next/navigation";
import { EventResponse } from "@/app/models/IEvents";

interface AllEventsProps {

}

const AllEvents: FunctionComponent<AllEventsProps> = (): ReactElement => {

    const fetchEventsByPublisherId = useFetchEventsByPublisherId();

    const router = useRouter();
    const windowRes = useResponsive();
    const onMobile = windowRes.width && windowRes.width < 768;
    const {data: session} = useSession();
    
    const [isFetchingEvents, setIsFetchingEvents] = useState(true);
    const [events, setEvents] = useState<EventResponse[]>();

    async function handleFetchEventsByPublisherId() {

        // Start fetching events
        setIsFetchingEvents(true);

        await fetchEventsByPublisherId(session?.user.id as string)
        .then((response) => {
            setEvents(response.data);
            console.log(response.data)
        })
        .catch((error) => {
            catchError(error);
        })
        .finally(() => {
            // Stop fetching events
            setIsFetchingEvents(false);
        })
    };

    useEffect(() => {
        handleFetchEventsByPublisherId();
    }, [router])

    return (
        <div className={`${styles.allEventsPage} ${styles.allEventsPageConsole}`}>
            {/* <section className={styles.heroSection}>
                <div className={styles.video}>
                    <video
                        autoPlay
                        loop
                        muted
                        src="https://res.cloudinary.com/dvxqk1487/video/upload/v1704506218/videos/Pexels_Videos_2022395_1080P_po4ic2.mp4" />
                </div>
                <div className={styles.textContents}>
                    <h2>Escape the Ordinary: <br /><span>Dive into Event Paradise!</span></h2>
                    <p>Embark on a journey through events that'll transport you to a world of excitement and wonder. <span>Ready to be amazed?</span> 🚀</p>
                </div>
            </section> */}

            {/* <FeaturedEvents isNotHomepage /> */}

            <EventsGroup
                consoleDisplay
                eventsData={events}
                title="All Events"
                subText="Below is a list of all your events."
                isFetchingEvents={isFetchingEvents}
            />
        </div>
    );
}

export default AllEvents;