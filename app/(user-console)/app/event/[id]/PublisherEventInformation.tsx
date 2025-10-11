"use client";
import {
  FunctionComponent,
  ReactElement,
  useEffect,
  useState,
  useContext,
} from "react";
import { useRouter } from "next/navigation";
import { Link as ScrollLink } from "react-scroll";
import { TicketResponse } from "@/app/models/ITicket";
import {
  EventRequest,
  EventResponse,
  UpdateEventRequest,
} from "@/app/models/IEvents";
import {
  useDeleteEvent,
  useDeleteTicket,
  useFetchEventTickets,
  useFetchEventViewsCount,
  useFetchPreviousEventAnalytics,
  useFetchPublisherEventById,
  useUpdateEventById,
} from "@/app/api/apiClient";
import { catchError } from "@/app/constants/catchError";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";
import { ToastContext } from "@/app/context/ToastCardContext";
import { EventInformationTab } from "@/app/enums/EventInformationTab";
import { serializeEventInformationTab } from "@/app/constants/serializer";
import OverviewSection from "@/app/components/Event/View/Publisher/OverviewSection";
import TicketsSection from "@/app/components/Event/View/Publisher/TicketsSection";
import SettingsSection from "@/app/components/Event/View/Publisher/SettingsSection";
import AnalyticsSection from "@/app/components/Event/View/Publisher/AnalyticsSection";
import CouponManager from "@/app/components/Event/View/Publisher/CouponManager";
import { Icons } from "@/app/components/ui/icons";
import Tooltip from "@/app/components/custom/Tooltip";
import { CheckInArea } from "@/app/components/Event/View/Publisher/CheckIn/CheckInArea";
import { FullPageLoader } from "@/app/components/Loader/ComponentLoader";
import TicketUpdateModal from "@/app/components/Event/Edit/TicketsUpdate/TicketUpdateModal";
import DeletionConfirmationModal from "@/app/components/Modal/DeletionConfirmation";
import moment from "moment";
import TicketCreationModal from "@/app/components/Event/Create/TicketsCreation/TicketCreationModal";
import SharePopup from "@/app/components/custom/SharePopup";
import { EditEventModal } from "@/app/components/Event/Edit/EventUpdateModal";
import { Session } from "next-auth";
import { compressImage } from "@/utils/imageCompress";
import EventUrlShortenerModal from "@/app/components/Modal/Console/EventUrlShortenerModal";
import { Copy, Link } from "lucide-react";
import { eventHelpers } from "@/helpers/event";

interface PublisherEventInformationProps {
  id: string;
  session: Session | null;
}

const PublisherEventInformation: FunctionComponent<
  PublisherEventInformationProps
> = ({ id, session }): ReactElement => {
  const fetchEventInfo = useFetchPublisherEventById();
  const fetchEventTickets = useFetchEventTickets();
  const updateEventById = useUpdateEventById();
  const deleteTicketById = useDeleteTicket();
  const fetchPreviousEventAnalytics = useFetchPreviousEventAnalytics();
  const deleteEvent = useDeleteEvent();
  const fetchEventViewsCount = useFetchEventViewsCount();
  const toasthandler = useContext(ToastContext);
  const router = useRouter();
  const { generateSlugOrId } = eventHelpers;

  const user = session?.user;

  const [eventInfo, setEventInfo] = useState<EventResponse>();
  const [previousEventInfo, setPreviousEventInfo] =
    useState<EventResponse | null>(null);
  const [eventTickets, setEventTickets] = useState<TicketResponse[]>();
  const [selectedTicket, setSelectedTicket] = useState<TicketResponse>();
  const [selectedInfoTab, setSelectedInfoTab] = useState(
    EventInformationTab.Overview
  );

  const [isEventUpdateModalVisible, setIsEventUpdateModalVisible] =
    useState(false);
  const [isTicketCreateModalVisible, setIsTicketCreateModalVisible] =
    useState(false);
  const [isTicketUpdateModalVisible, setIsTicketUpdateModalVisible] =
    useState(false);
  const [isTicketDeleteModalVisible, setIsTicketDeleteModalVisible] =
    useState(false);
  const [
    isEventDeletionConfirmationModalVisible,
    setIsEventDeletionConfirmationModalVisible,
  ] = useState(false);
  const [isUrlShortenerModalVisible, setIsUrlShortenerModalVisible] =
    useState(false);
  const [eventViewsCount, setEventViewsCount] = useState<number>();

  const [isFetchingEventInfo, setIsFetchingEventInfo] = useState(true);
  const [isFetchingEventTickets, setIsFetchingEventTickets] = useState(true);
  const [isDeletingEvent, setIsDeletingEvent] = useState(false);
  const [isDeletingTicket, setIsDeletingTicket] = useState(false);

  function shareEvent(copyLinkOnly?: boolean) {
    const eventUrl = `${
      window.location.origin +
      ApplicationRoutes.GeneralEvent +
      (eventInfo?.slug || eventInfo?.id)
    }`;

    if (copyLinkOnly) {
      // Simple URL-only copy to clipboard
      navigator.clipboard
        .writeText(eventUrl)
        .then(() => {
          toasthandler?.logSuccess(
            "Success",
            "Event link copied to clipboard!"
          );
        })
        .catch((error) => {
          toasthandler?.logError(
            "Error copying link",
            "Failed to copy event link. Please try again."
          );
        });
    } else {
      // Full share text with title
      navigator.clipboard
        .writeText(`${eventInfo?.title} - Ticketsdeck Events: ${eventUrl}`)
        .then(() => {
          toasthandler?.logSuccess(
            "Success",
            `The link to ${eventInfo?.title} has been copied.`
          );
        })
        .catch((error) => {
          toasthandler?.logError(
            "Error copying link",
            "Failed to copy event link. Please try again."
          );
        });
    }
  }

  // Check if event is currently live
  const isEventLive = () => {
    if (!eventInfo) return false;

    const now = new Date();
    const eventStart = new Date(eventInfo.startDate);
    const eventEnd = new Date(eventInfo.endDate);
    return now >= eventStart && now <= eventEnd;
  };

  // Handle slug update
  const handleSlugUpdate = (newSlug: string) => {
    toasthandler?.logSuccess(
      "URL Updated",
      `Your event URL has been updated to: /event/${newSlug}`
    );
    // refresh the event data
    handleFetchEventInfo();
  };

  async function handleFetchPreviousEventAnalytics(currentEventId: string) {
    try {
      const response = await fetchPreviousEventAnalytics(
        user?.token as string,
        currentEventId
      );
      setPreviousEventInfo(response.data);
    } catch (error) {
      // It's not critical if this fails, so we just log it and continue.
      // The analytics section will simply not show the comparison.
      console.error("Could not fetch previous event analytics.", error);
    }
  }

  async function handleFetchEventInfo() {
    // Set running flag
    setIsFetchingEventInfo(true);

    await fetchEventInfo(user?.token as string, id, user?.id as string)
      .then((response) => {
        // Set the event results
        let _eventInfo = response.data;

        if (!_eventInfo) {
          // Route to event not-found page
          router.push(`/event/not-found`);
        }

        // Update the event results
        setEventInfo(_eventInfo);

        if (_eventInfo) {
          handleFetchPreviousEventAnalytics(_eventInfo.id);
        }
      })
      .catch((error) => {
        // Display the error
        toasthandler?.logError(
          "Error fetching event information.",
          "We encountered an error while fetchng event information. Please try again."
        );

        catchError(error);
      })
      .finally(() => {
        // Unset running flag
        setIsFetchingEventInfo(false);
      });
  }

  async function handleFetchEventTickets() {
    await fetchEventTickets(user?.token as string, eventInfo?.id as string)
      .then((response) => {
        setEventTickets(response.data);
      })
      .catch((error) => {})
      .finally(() => {
        setIsFetchingEventTickets(false);
      });
  }

  async function handleFetchEventViewsCount(eventId: string) {
    await fetchEventViewsCount(eventId)
      .then((response) => {
        setEventViewsCount(response.data.viewsCount);
      })
      .catch((error) => {
        catchError(error);
      });
  }

  async function handleDeleteEvent(eventId: string) {
    // Start deleting event
    setIsDeletingEvent(true);

    await deleteEvent(user?.token as string, eventId, user?.id as string)
      .then((response) => {
        // Route to the events page
        router.push(ApplicationRoutes.Events);

        toasthandler?.logSuccess(
          "Successfully deleted",
          "Your event was successfully deleted."
        );

        // Close modal after deleting event
        setIsEventDeletionConfirmationModalVisible(false);
      })
      .catch((error) => {
        catchError(error);
        toasthandler?.logError(
          "Error deleting ticket",
          "Failed to delete event. Please try again later."
        );
      })
      .finally(() => {
        // Stop deleting event
        setIsDeletingEvent(false);
      });
  }

  async function handleDeleteTicket() {
    // Show loader
    setIsDeletingTicket(true);

    await deleteTicketById(
      user?.token as string,
      selectedTicket?.id as string,
      user?.id as string
    )
      .then(async () => {
        // Close the modal
        setIsTicketDeleteModalVisible(false);
        // Fetch event info
        await handleFetchEventTickets();

        // Display success
        toasthandler?.logSuccess("Success", "Ticket deleted successfully.");
      })
      .catch((error) => {
        // Display error
        toasthandler?.logError(
          "Error deleting ticket.",
          "We encountered an error while deleting the ticket. Please try again."
        );

        // Catch error
        catchError(error);
      })
      .finally(() => {
        setIsDeletingTicket(false);
      });
  }

  async function handleUpdateEventInfo(
    updatedEventInfo: UpdateEventRequest & { mainImageFile: File | undefined },
    toastMessage?: string
  ) {
    // add publisher id
    const eventData = {
      ...updatedEventInfo,
      publisherId: eventInfo?.publisherId as string,
      eventId: eventInfo?.eventId as string,
    };

    const mainImageFile = updatedEventInfo.mainImageFile;

    try {
      const formData = new FormData();

      // 3. Image Processing: Compress if necessary and append to FormData.
      if (mainImageFile) {
        // const isLargeFile = mainImageFile.size > 2 * 1024 * 1024; // 2MB threshold
        let fileToUpload = mainImageFile;

        const { compressedFile, compressedSize, reductionPercentage } =
          await compressImage(mainImageFile);
        fileToUpload = compressedFile;

        formData.append("mainImage", fileToUpload);
      }

      // 4. Populate FormData: Append all fields from the prepared data object.
      for (const [key, value] of Object.entries(eventData)) {
        // Skip the legacy Base64 field and the file object itself.
        if (key === "mainImageBase64Url" || key === "mainImageFile") {
          continue;
        }

        // Handle date fields explicitly to ensure they are in ISO 8601 format.
        if (
          [
            "startDate",
            "endDate",
            "purchaseStartDate",
            "purchaseEndDate",
          ].includes(key) &&
          value
        ) {
          const date = new Date(value as string);
          // Ensure the date is valid before appending
          if (!isNaN(date.getTime())) {
            formData.append(key, date.toISOString());
          } else {
            console.warn(`Skipping invalid date for ${key}:`, value);
          }
          // Continue to the next item in the loop
          continue;
        }

        // Stringify objects/arrays (like tags and tickets).
        if (typeof value === "object" && value !== null) {
          formData.append(key, JSON.stringify(value));
        }
        // Append all other defined, non-null values.
        else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      }

      // 5. API Call: Execute the event creation request.
      await updateEventById(
        user?.token as string,
        id,
        eventInfo?.publisherId as string,
        formData
      );

      // toasthandler?.logSuccess("Success", "Event information updated successfully.");
      await handleFetchEventInfo();

      // Display success
      toasthandler?.logSuccess(
        "Success",
        toastMessage ?? "Event information updated successfully."
      );
    } catch (error) {
      // --- Error Path ---
      // 6. Log the actual error for debugging and provide user feedback.
      console.error("💥 Failed to update event:", error);

      toasthandler?.logError(
        "Error updating event information.",
        "We encountered an error while updating event information. Please try again."
      );
      catchError(error);
    }
  }

  useEffect(() => {
    // Clear previous info
    setEventInfo(undefined);

    if (id) {
      handleFetchEventInfo();
    }
  }, [id, session]);

  useEffect(() => {
    if (eventInfo) {
      handleFetchEventTickets();
      handleFetchEventViewsCount(eventInfo.id);
    }
  }, [eventInfo]);

  return (
    <div className="text-white bg-dark-grey min-h-full h-fit">
      {eventInfo && (
        <EditEventModal
          initialData={eventInfo as UpdateEventRequest}
          modalVisibility={isEventUpdateModalVisible}
          setModalVisibility={setIsEventUpdateModalVisible}
          handleUpdateEventInfo={handleUpdateEventInfo}
        />
      )}

      <TicketUpdateModal
        modalVisibility={isTicketUpdateModalVisible}
        setModalVisibility={setIsTicketUpdateModalVisible}
        selectedTicket={selectedTicket}
        handleFetchEventTickets={handleFetchEventTickets}
      />

      <TicketCreationModal
        modalVisibility={isTicketCreateModalVisible}
        setModalVisibility={setIsTicketCreateModalVisible}
        handleFetchEventTickets={handleFetchEventTickets}
        forExistingEvent
        eventId={eventInfo?.id}
      />

      <DeletionConfirmationModal
        visibility={isTicketDeleteModalVisible}
        setVisibility={setIsTicketDeleteModalVisible}
        deleteFunction={handleDeleteTicket}
        isLoading={isDeletingTicket}
        title="Are you sure you want to delete this ticket?"
      />

      <DeletionConfirmationModal
        visibility={isEventDeletionConfirmationModalVisible}
        setVisibility={setIsEventDeletionConfirmationModalVisible}
        deleteFunction={() => handleDeleteEvent(id)}
        isLoading={isDeletingEvent}
      />

      {eventInfo && (
        <EventUrlShortenerModal
          isOpen={isUrlShortenerModalVisible}
          onClose={() => setIsUrlShortenerModalVisible(false)}
          currentSlug={eventInfo.slug || eventInfo.id}
          eventId={eventInfo.id}
          publisherId={eventInfo.publisherId}
          onSlugUpdate={handleSlugUpdate}
        />
      )}

      {!isFetchingEventInfo && eventInfo && (
        <section className="p-[1.25rem]">
          <div className="flex flex-row justify-between items-center gap-4 mb-8">
            <div>
              <h4 className="mb-1">Event Information</h4>
              <h2 className="text-3xl font-medium">{eventInfo.title}</h2>
              <div className="flex flex-row items-center gap-2">
                <p className="text-sm text-white/60">
                  Posted on:{" "}
                  {moment(eventInfo.createdAt).format(
                    "ddd, MMM Do, YYYY, hh:mm A"
                  )}
                </p>
                {eventViewsCount ? (
                  <>
                    <span>|</span>
                    <p className="text-sm text-white/60 flex flex-row items-center gap-1">
                      <Icons.Eye width={16} height={16} /> {eventViewsCount}
                    </p>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className="flex flex-row items-center gap-4">
              <SharePopup
                url={`${
                  window.location.origin +
                  ApplicationRoutes.GeneralEvent +
                  generateSlugOrId(eventInfo)
                }`}
              />
            </div>
          </div>

          {/* Event Link Section */}
          <div className="mt-3 p-4 bg-container-grey/50 rounded-lg border border-white/10 mb-8">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white/60 mb-1 font-medium">
                Event Link
              </p>
              <div className="flex flex-col md:flex-row items-center gap-2">
                <div className="flex-1 min-w-0 w-full bg-dark-grey-2 rounded-md px-3 py-2 border border-white/20">
                  <p
                    className="text-sm text-white font-mono truncate"
                    title={`${window.location.origin}${
                      ApplicationRoutes.GeneralEvent
                    }${eventInfo?.slug || eventInfo.id}`}
                  >
                    {`${window.location.origin}${
                      ApplicationRoutes.GeneralEvent
                    }${eventInfo?.slug || eventInfo.id}`}
                  </p>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  {/* Copy Button */}
                  <Tooltip position="top" tooltipText="Copy link">
                    <button
                      onClick={() => shareEvent(true)}
                      className="flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 rounded-md border border-white/20 transition-all duration-200 hover:scale-105"
                    >
                      <Copy width={16} height={16} className="text-white" />
                    </button>
                  </Tooltip>

                  {/* Shorten URL Button */}
                  <Tooltip position="top" tooltipText="Customize URL">
                    <button
                      onClick={() => setIsUrlShortenerModalVisible(true)}
                      className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-primary-color to-purple-700 rounded-md border border-purple-500/50 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
                    >
                      <Link
                        width={16}
                        height={16}
                        className="text-white mr-2"
                      />
                      <span className="text-sm font-medium text-white">
                        Customize
                      </span>
                    </button>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>

          {/* Tab section */}
          <div className="w-full flex flex-col space-y-6">
            {/* Check-in Area - Only shows when event is live */}
            {isEventLive() && (
              <div className="mb-8">
                <CheckInArea eventId={eventInfo.id} isLive={true} />
              </div>
            )}

            <div className="w-full overflow-x-auto md:overflow-auto bg-container-grey rounded-xl">
              <div className="flex flex-row justify-start items-center gap-3 p-4">
                {Object.values(EventInformationTab).map((tab) => {
                  if (isNaN(Number(tab))) {
                    return;
                  }
                  return (
                    <ScrollLink
                      to={tab as string}
                      smooth={true}
                      duration={500}
                      className={`cursor-pointer rounded-md hover:bg-white/10 ${
                        selectedInfoTab == tab
                          ? "bg-white text-black pointer-events-none"
                          : "text-white"
                      }`}
                      onClick={() => setSelectedInfoTab(Number(tab))}
                    >
                      <div className={`flex items-center gap-2 p-1 px-2`}>
                        <span>{serializeEventInformationTab(Number(tab))}</span>
                      </div>
                    </ScrollLink>
                  );
                })}
              </div>
            </div>

            {selectedInfoTab == EventInformationTab.Overview && (
              <OverviewSection
                eventInfo={eventInfo}
                handleUpdateEventInfo={handleUpdateEventInfo}
                setIsEventUpdateModalVisible={setIsEventUpdateModalVisible}
              />
            )}
            {selectedInfoTab == EventInformationTab.Tickets && (
              <TicketsSection
                eventInfo={eventInfo}
                setSelectedTicket={setSelectedTicket}
                setIsTicketUpdateModalVisible={setIsTicketUpdateModalVisible}
                eventTickets={eventTickets}
                isFetchingEventTickets={isFetchingEventTickets}
                setIsTicketCreateModalVisible={setIsTicketCreateModalVisible}
                setIsTicketDeleteModalVisible={setIsTicketDeleteModalVisible}
              />
            )}
            {selectedInfoTab == EventInformationTab.Coupons && (
              <CouponManager eventInfo={eventInfo} />
            )}
            {selectedInfoTab == EventInformationTab.Settings && (
              <SettingsSection
                eventInfo={eventInfo}
                handleUpdateEventInfo={handleUpdateEventInfo}
                setIsDeletionConfirmationModalVisible={
                  setIsEventDeletionConfirmationModalVisible
                }
              />
            )}
            {selectedInfoTab == EventInformationTab.Analytics && (
              <AnalyticsSection
                eventInfo={eventInfo}
                previousEventInfo={previousEventInfo}
              />
            )}
          </div>
        </section>
      )}
      {isFetchingEventInfo && !eventInfo && <FullPageLoader />}
      {!isFetchingEventInfo && !eventInfo && (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h2 className="text-2xl font-medium">Event not found</h2>
          <p className="text-white/60">
            The event you are looking for does not exist.
          </p>
        </div>
      )}
    </div>
  );
};

export default PublisherEventInformation;
