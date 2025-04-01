"use client";
import { FunctionComponent, ReactElement, useEffect, useState } from "react";
import EventsGroup from "../../../components/events/EventsGroup";
import { useDeleteEvent, useFetchOrganizerEvents } from "@/app/api/apiClient";
import { catchError } from "@/app/constants/catchError";
import { useRouter } from "next/navigation";
import { EventResponse } from "@/app/models/IEvents";
import DeletionConfirmationModal from "@/app/components/Modal/DeletionConfirmation";
import { Session } from "next-auth";
import { useToast } from "@/app/context/ToastCardContext";

interface UserEventsPageProps {
  session: Session | null;
}

const UserEventsPage: FunctionComponent<UserEventsPageProps> = ({
  session,
}): ReactElement => {
  const toastHandler = useToast();

  const deleteEvent = useDeleteEvent();
  const fetchOrganizerEvents = useFetchOrganizerEvents();

  const user = session?.user;

  const router = useRouter();

  const [isFetchingEvents, setIsFetchingEvents] = useState(true);
  const [events, setEvents] = useState<EventResponse[]>();
  const [selectedEvent, setSelectedEvent] = useState<EventResponse>();
  const [
    isDeleteConfirmationModalVisible,
    setIsDeleteConfirmationModalVisible,
  ] = useState(false);
  const [isDeletingEvent, setIsDeletingEvent] = useState(false);
  const [isEventDeleted, setIsEventDeleted] = useState(false);

  async function handleFetchOrganizerEvents() {
    // Reset events
    setEvents(undefined);

    // Start fetching events
    setIsFetchingEvents(true);

    await fetchOrganizerEvents(user?.token as string, user?.id as string)
      .then((response) => {
        // Set events
        setEvents(response.data);
        // Reset event deleted state
        setIsEventDeleted(false);
      })
      .catch((error) => {
        catchError(error);
      })
      .finally(() => {
        // Stop fetching events
        setIsFetchingEvents(false);
      });
  }

  async function handleDeleteEvent() {
    // Start deleting event
    setIsDeletingEvent(true);

    await deleteEvent(user?.token as string, selectedEvent?.id as string)
      .then((response) => {
        console.log("🚀 ~ .then ~ response:", response);
        // Fetch events again
        handleFetchOrganizerEvents();
        // Set event deleted state
        setIsEventDeleted(true);
        // Close modal after deleting event
        setIsDeleteConfirmationModalVisible(false);
      })
      .catch((error) => {
        catchError(error);
        toastHandler.logError(
          "Error",
          "Failed to delete event. Please try again later."
        );
      })
      .finally(() => {
        // Stop deleting event
        setIsDeletingEvent(false);
      });
  }

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    handleFetchOrganizerEvents();
  }, [session]);

  useEffect(() => {
    if (isEventDeleted) handleFetchOrganizerEvents();
  }, [isEventDeleted]);

  return (
    <div className={`text-white h-full`}>
      <DeletionConfirmationModal
        visibility={isDeleteConfirmationModalVisible}
        setVisibility={setIsDeleteConfirmationModalVisible}
        deleteFunction={handleDeleteEvent}
        isLoading={isDeletingEvent}
        actionText='Delete Event'
      />

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
        title='All Events'
        subText='Below is a list of all your events.'
        isFetchingEvents={isFetchingEvents}
        setIsDeleteConfirmationModalVisible={
          setIsDeleteConfirmationModalVisible
        }
        setSelectedEvent={setSelectedEvent}
      />
    </div>
  );
};

export default UserEventsPage;
