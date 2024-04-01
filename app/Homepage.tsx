"use client"
import { FunctionComponent, ReactElement, useEffect, useState } from "react";
import HeroSection from "./components/Homepage/HeroSection";
import FeaturedEvents from "./components/Homepage/FeaturedEvents";
import Services from "./components/Homepage/Services";
import styles from './styles/Home.module.scss'
import CreateEvent from "./components/Homepage/CreateEvent";
import { useFetchEvents } from "./api/apiClient";
import { EventResponse } from "./models/IEvents";

interface HomepageProps {

}

const Homepage: FunctionComponent<HomepageProps> = (): ReactElement => {

    const fetchEvents = useFetchEvents();

    const [events, setEvents] = useState<EventResponse[]>([]);
    const [isFetchingEvents, setIsFetchingEvents] = useState(true);

    async function handleFetchEvents() {
        // Start loader
        setIsFetchingEvents(true);

        await fetchEvents()
            .then((response) => {
                if (response) {
                    console.log(response.data);
                    setEvents(response.data);
                }
            })
            .catch((err) => {
                console.log(err);
                // toasthandler?.logError('Error', 'An error occurred while fetching events.');
            })
            .finally(() => {
                // Stop loader
                setIsFetchingEvents(false);
            });
    };

    useEffect(() => {
        handleFetchEvents();
    }, []);

    return (
        <div className={styles.homepage}>
            <HeroSection
                isFetchingEvents={isFetchingEvents}
                events={events}
            />
            <FeaturedEvents
                isFetchingEvents={isFetchingEvents}
                events={events}
            />
            <Services />
            <CreateEvent />
        </div>
    );
}

export default Homepage;