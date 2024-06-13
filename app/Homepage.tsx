"use client"
import { FunctionComponent, ReactElement, useEffect, useState } from "react";
import HeroSection from "./components/Homepage/HeroSection";
import FeaturedEvents from "./components/Homepage/FeaturedEvents";
import Services from "./components/Homepage/Services";
import styles from './styles/Home.module.scss'; 
import CreateEvent from "./components/Homepage/CreateEvent";
import { useFetchEvents } from "./api/apiClient";
import { EventResponse } from "./models/IEvents";
import { StorageKeys } from "./constants/storageKeys";
 
interface HomepageProps {

}

const Homepage: FunctionComponent<HomepageProps> = (): ReactElement => {

    const fetchEvents = useFetchEvents();

    const [events, setEvents] = useState<EventResponse[]>([]);
    const [isFetchingEvents, setIsFetchingEvents] = useState(true);

    // function retrieveEventsFromDb() {
    //     const _retrievedEvents = sessionStorage.getItem(StorageKeys.Events);

    //     if (!_retrievedEvents || _retrievedEvents === 'undefined') {
    //         return;
    //     }

    //     const retrievedEvents = JSON.parse(_retrievedEvents);

    //     return retrievedEvents;
    // }

    async function handleFetchEvents() {
        // Start loader
        setIsFetchingEvents(true);

        // Check if events are in session storage
        // if (retrieveEventsFromDb()) {
        //     // Update events state
        //     setEvents(retrieveEventsFromDb());
        //     // Stop loader
        //     setIsFetchingEvents(false);
        //     // Stop function execution
        //     return;
        // }

        // Fetch events
        await fetchEvents()
            .then((response) => {
                if (response) {
                    // console.log(response.data);
                    setEvents(response.data);

                    // Save events to session storage
                    // sessionStorage.setItem(StorageKeys.Events, JSON.stringify(response.data));
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