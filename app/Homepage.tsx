"use client";
import { FunctionComponent, ReactElement, useEffect, useState } from "react";
import HeroSection from "./components/Homepage/HeroSection";
import FeaturedEvents from "./components/Homepage/FeaturedEvents";
import Services from "./components/Homepage/Services";
import CreateEvent from "./components/Homepage/CreateEvent";
import { useFetchEvents, useFetchFeaturedEvents } from "./api/apiClient";
import { EventResponse } from "./models/IEvents";
import BetaTestModal from "./components/Modal/BetaTestModal";
import { ImageWithPlaceholder } from "./models/IImage";

interface HomepageProps {
  imageWithPlaceholder: ImageWithPlaceholder[];
}

const Homepage: FunctionComponent<HomepageProps> = ({
  imageWithPlaceholder,
}): ReactElement => {
  const fetchFeaturedEvents = useFetchFeaturedEvents();
  const fetchEvents = useFetchEvents();

  const [featuredEvents, setFeaturedEvents] = useState<EventResponse[]>([]);
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [isFetchingFeaturedEvents, setIsFetchingFeaturedEvents] =
    useState(true);
  const [isFetchingEvents, setIsFetchingEvents] = useState(true);
  const [showBetaTestModal, setShowBetaTestModal] = useState(false);

  // function retrieveEventsFromDb() {
  //     const _retrievedEvents = sessionStorage.getItem(StorageKeys.Events);

  //     if (!_retrievedEvents || _retrievedEvents === 'undefined') {
  //         return;
  //     }

  //     const retrievedEvents = JSON.parse(_retrievedEvents);

  //     return retrievedEvents;
  // }

  async function handleFetchFeaturedEvents() {
    // Fetch events
    await fetchFeaturedEvents()
      .then((response) => {
        if (response) {
          // console.log(response.data);
          setFeaturedEvents(response.data);

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
        setIsFetchingFeaturedEvents(false);
      });
  }

  async function handleFetchEvents() {
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
  }

  useEffect(() => {
    handleFetchFeaturedEvents();
    handleFetchEvents();
  }, []);

  // Show beta test modal after 5 seconds, and only once
  // useEffect(() => {
  //     // Check if beta test modal has been viewed
  //     const viewed = localStorage.getItem(StorageKeys.BetaTestModalViewed);

  //     // If it has been viewed, stop execution
  //     if (viewed) {
  //         return;
  //     }

  //     // Show beta test modal after 5 seconds
  //     const timer = setTimeout(() => {
  //         setShowBetaTestModal(true);

  //         // Save to local storage
  //         localStorage.setItem(StorageKeys.BetaTestModalViewed, 'true');
  //     }, 5000);

  //     return () => clearTimeout(timer);
  // }, []);

  return (
    <>
      <BetaTestModal
        forGeneralMessage
        visibility={showBetaTestModal}
        setVisibility={setShowBetaTestModal}
      />
      <div className='bg-dark-grey text-white'>
        <HeroSection
          isFetchingEvents={isFetchingEvents}
          events={events}
          imageWithPlaceholder={imageWithPlaceholder}
        />
        <FeaturedEvents
          isFetchingEvents={isFetchingFeaturedEvents}
          featuredEvents={featuredEvents}
        />
        <Services />
        <CreateEvent />
      </div>
    </>
  );
};

export default Homepage;
