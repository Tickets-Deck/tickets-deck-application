"use client";
import {
  FunctionComponent,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from "react";
import styles from "../styles/Events.module.scss";
import EventsGroup from "../components/events/EventsGroup";
import { useFetchEvents } from "../api/apiClient";
import { EventResponse } from "../models/IEvents";
import { ToastContext } from "../extensions/toast";
import useResponsiveness from "../hooks/useResponsiveness";
import PageHeroSection from "../components/shared/PageHeroSection";

interface AllEventsProps {}

const AllEvents: FunctionComponent<AllEventsProps> = (): ReactElement => {
  const fetchEvents = useFetchEvents();

  const toasthandler = useContext(ToastContext);

  const windowRes = useResponsiveness();
  const isMobile = windowRes.width && windowRes.width < 768;
  const onMobile = typeof isMobile == "boolean" && isMobile;
  const onDesktop = typeof isMobile == "boolean" && !isMobile;

  const [isFetchingEvents, setIsFetchingEvents] = useState(true);
  const [events, setEvents] = useState<EventResponse[]>([]);

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
        toasthandler?.logError(
          "Error",
          "An error occurred while fetching events."
        );
      })
      .finally(() => {
        // Stop loader
        setIsFetchingEvents(false);
      });
  }

  useEffect(() => {
    handleFetchEvents();
  }, []);

  return (
    <div className='text-white'>
      {/* <PageHeroSection 
                title="All Events"
                description="Dear superstar, below is a list of all events available at the moment."
            /> */}
      <PageHeroSection
        videoUrl='https://res.cloudinary.com/dvxqk1487/video/upload/v1704506218/videos/Pexels_Videos_2022395_1080P_po4ic2.mp4'
        title={
          <h2>
            Escape the Ordinary: <br />
            <span>Dive into Event Paradise!</span>
          </h2>
        }
        description={
          <p>
            Embark on a journey through events that'll transport you to a world
            of excitement and wonder. <span>Ready to be amazed?</span> 🚀
          </p>
        }
      />

      {/* <section>
                Category
            </section> */}

      {/* <FeaturedEvents
                isNotHomepage
                isFetchingEvents={isFetchingEvents}
                events={events}
            /> */}

      <EventsGroup
        eventsData={events}
        title='All Events'
        subText='Dear superstar, below is a list of all events available at the moment.'
        isFetchingEvents={isFetchingEvents}
      />

      {events.some((event) => new Date(event.date) < new Date()) && (
        <EventsGroup
          eventsData={events}
          title='Past Events'
          subText='Browse through our collection of past events.'
          isFetchingEvents={isFetchingEvents}
          forPastEvents
        />
      )}
    </div>
  );
};

export default AllEvents;
