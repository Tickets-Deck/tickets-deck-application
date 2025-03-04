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
import { EventRequest, EventResponse, UpdateEventRequest } from "@/app/models/IEvents";
import { useDeleteEvent, useDeleteTicket, useFetchEventTickets, useFetchPublisherEventById, useUpdateEventById } from "@/app/api/apiClient";
import { catchError } from "@/app/constants/catchError";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";
import { ToastContext } from "@/app/context/ToastCardContext";
import { EventInformationTab } from "@/app/enums/EventInformationTab";
import { serializeEventInformationTab } from "@/app/constants/serializer";
import OverviewSection from "@/app/components/Event/View/Publisher/OverviewSection";
import TicketsSection from "@/app/components/Event/View/Publisher/TicketsSection";
import SettingsSection from "@/app/components/Event/View/Publisher/SettingsSection";
import AnalyticsSection from "@/app/components/Event/View/Publisher/AnalyticsSection";
import { Icons } from "@/app/components/ui/icons";
import Tooltip from "@/app/components/custom/Tooltip";
import { CheckInArea } from "@/app/components/Event/View/Publisher/CheckIn/CheckInArea";
import { FullPageLoader } from "@/app/components/Loader/ComponentLoader";
import { useSession } from "next-auth/react";
import TicketUpdateModal from "@/app/components/Event/Edit/TicketsUpdate/TicketUpdateModal";
import DeletionConfirmationModal from "@/app/components/Modal/DeletionConfirmation";
import moment from "moment";
import TicketCreationModal from "@/app/components/Event/Create/TicketsCreation/TicketCreationModal";
import SharePopup from "@/app/components/custom/SharePopup";
import { EditEventModal } from "@/app/components/Event/Edit/EventUpdateModal";

interface EventDetailsProps {
    params: { id: string };
}

const EventDetails: FunctionComponent<EventDetailsProps> = ({ params }): ReactElement => {

    const fetchEventInfo = useFetchPublisherEventById();
    const fetchEventTickets = useFetchEventTickets();
    const updateEventById = useUpdateEventById();
    const deleteTicketById = useDeleteTicket();
    const deleteEvent = useDeleteEvent();
    const toasthandler = useContext(ToastContext);
    const router = useRouter();
    const { data: session } = useSession();

    const user = session?.user;

    const id = params.id;

    const [eventInfo, setEventInfo] = useState<EventResponse>();
    const [eventTickets, setEventTickets] = useState<TicketResponse[]>();
    const [selectedTicket, setSelectedTicket] = useState<TicketResponse>();
    const [selectedInfoTab, setSelectedInfoTab] = useState(EventInformationTab.Overview);

    const [isEventUpdateModalVisible, setIsEventUpdateModalVisible] = useState(false);
    const [isTicketCreateModalVisible, setIsTicketCreateModalVisible] = useState(false);
    const [isTicketUpdateModalVisible, setIsTicketUpdateModalVisible] = useState(false);
    const [isTicketDeleteModalVisible, setIsTicketDeleteModalVisible] = useState(false);
    const [isEventDeletionConfirmationModalVisible, setIsEventDeletionConfirmationModalVisible] = useState(false);

    const [isFetchingEventInfo, setIsFetchingEventInfo] = useState(true);
    const [isFetchingEventTickets, setIsFetchingEventTickets] = useState(true);
    const [isDeletingEvent, setIsDeletingEvent] = useState(false);
    const [isDeletingTicket, setIsDeletingTicket] = useState(false);

    function shareEvent() {
        const eventUrl = `${window.location.origin + ApplicationRoutes.GeneralEvent + eventInfo?.id
            }`;

        navigator.clipboard
            .writeText(`${eventInfo?.title} - Ticketsdeck Events: ${eventUrl}`)
            .then(() => {
                toasthandler?.logSuccess("Success", `The link to ${eventInfo?.title} has been copied.`)
            })
            .catch((error) => {
                toasthandler?.logError("Error copying link", "Failed to copy event link. Please try again.")
            });
    }

    // Check if event is currently live
    const isEventLive = () => {
        if (!eventInfo) return false;

        const now = new Date()
        const eventStart = new Date(eventInfo.startDate)
        const eventEnd = new Date(eventInfo.endDate)
        return now >= eventStart && now <= eventEnd
    };

    async function handleFetchEventInfo() {

        // Set running flag
        setIsFetchingEventInfo(true);

        await fetchEventInfo(user?.token as string, id)
            .then((response) => {
                // Log the result
                console.log("🚀 ~ .then ~ event info response:", response)

                // Set the event results
                let _eventInfo = response.data;

                if (!_eventInfo) {
                    // Route to event not-found page
                    router.push(`/event/not-found`);
                }

                // Update the event results
                setEventInfo(_eventInfo);
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
            })
    };

    async function handleFetchEventTickets() {
        await fetchEventTickets(user?.token as string, eventInfo?.id as string)
            .then((response) => {
                setEventTickets(response.data);
            })
            .catch((error) => { })
            .finally(() => {
                setIsFetchingEventTickets(false);
            })
    }

    async function handleDeleteEvent(eventId: string) {
        // Start deleting event
        setIsDeletingEvent(true);

        await deleteEvent(user?.token as string, eventId)
            .then((response) => {
                console.log("🚀 ~ .then ~ response:", response);
                // Route to the events page
                router.push(ApplicationRoutes.Events);

                // Close modal after deleting event
                setIsEventDeletionConfirmationModalVisible(false);
            })
            .catch((error) => {
                catchError(error);
                toasthandler?.logError("Error deleting ticket", "Failed to delete event. Please try again later.")
            })
            .finally(() => {
                // Stop deleting event
                setIsDeletingEvent(false);
            });
    }

    async function handleDeleteTicket() {
        // Show loader
        setIsDeletingTicket(true);

        await deleteTicketById(user?.token as string, selectedTicket?.id as string)
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
                toasthandler?.logError("Error deleting ticket.", "We encountered an error while deleting the ticket. Please try again.");

                // Catch error
                catchError(error);
            })
            .finally(() => {
                setIsDeletingTicket(false);
            });
    }

    async function handleUpdateEventInfo(updatedEventInfo: UpdateEventRequest, toastMessage?: string) {
        await updateEventById(user?.token as string, id, updatedEventInfo)
            .then(async (response) => {
                // toasthandler?.logSuccess("Success", "Event information updated successfully.");
                await handleFetchEventInfo();

                // Display success
                toasthandler?.logSuccess("Success", toastMessage ?? "Event information updated successfully.");
            })
            .catch((error) => {
                toasthandler?.logError("Error updating event information.", "We encountered an error while updating event information. Please try again.");
                catchError(error);
            })
    };

    useEffect(() => {
        // Clear previous info
        setEventInfo(undefined);

        if (params && params.id) {
            console.log("Fetching info based on Event ID:", id);
            handleFetchEventInfo();
        }
    }, [params, session]);

    useEffect(() => {
        if (eventInfo) {
            handleFetchEventTickets()
        }
    }, [eventInfo])

    return (
        <div className='text-white bg-dark-grey min-h-full h-fit'>

            {
                eventInfo &&
                <EditEventModal
                    initialData={eventInfo as UpdateEventRequest}
                    modalVisibility={isEventUpdateModalVisible}
                    setModalVisibility={setIsEventUpdateModalVisible}
                    handleUpdateEventInfo={handleUpdateEventInfo}
                />
            }

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

            {!isFetchingEventInfo && eventInfo &&
                <section className='p-[1.25rem]'>
                    <div className="flex flex-row justify-between items-center gap-4 mb-10">
                        <div>
                            <h4 className="mb-1">Event Information</h4>
                            <h2 className="text-3xl font-medium">{eventInfo.title}</h2>
                            <p className="text-sm text-white/60">Posted on: {moment(eventInfo.createdAt).format("ddd, MMM Do, YYYY, hh:mm A")} | 143</p>
                        </div>
                        <div className="flex flex-row items-center gap-4">
                            <SharePopup
                                url={`${window.location.origin + ApplicationRoutes.GeneralEvent + eventInfo?.id
                                    }`}
                            />
                        </div>
                    </div>

                    {/* Tab section */}
                    <div className="w-full flex flex-col space-y-6">
                        {/* Check-in Area - Only shows when event is live */}
                        {isEventLive() && (
                            <div className="mb-8">
                                <CheckInArea
                                    eventId={eventInfo.id}
                                    isLive={true}
                                />
                            </div>
                        )}

                        <div className="flex flex-row justify-start items-center gap-3 bg-container-grey rounded-xl p-4">
                            {
                                Object.values(EventInformationTab).map((tab) => {
                                    if (isNaN(Number(tab))) {
                                        return;
                                    }
                                    return (
                                        <ScrollLink
                                            to={tab as string}
                                            smooth={true}
                                            duration={500}
                                            className={`cursor-pointer rounded-md hover:bg-white/10 ${selectedInfoTab == tab ? "bg-white text-black pointer-events-none" : "text-white"}`}
                                            onClick={() => setSelectedInfoTab(Number(tab))}
                                        >
                                            <div className={`flex items-center gap-2 p-1 px-2`}>
                                                <span>{serializeEventInformationTab(Number(tab))}</span>
                                            </div>
                                        </ScrollLink>
                                    )
                                })
                            }
                        </div>

                        {
                            selectedInfoTab == EventInformationTab.Overview &&
                            <OverviewSection
                                eventInfo={eventInfo}
                                handleUpdateEventInfo={handleUpdateEventInfo}
                                setIsEventUpdateModalVisible={setIsEventUpdateModalVisible}
                            />
                        }
                        {
                            selectedInfoTab == EventInformationTab.Tickets &&
                            <TicketsSection
                                eventInfo={eventInfo}
                                setSelectedTicket={setSelectedTicket}
                                setIsTicketUpdateModalVisible={setIsTicketUpdateModalVisible}
                                eventTickets={eventTickets}
                                isFetchingEventTickets={isFetchingEventTickets}
                                setIsTicketCreateModalVisible={setIsTicketCreateModalVisible}
                                setIsTicketDeleteModalVisible={setIsTicketDeleteModalVisible}
                            />
                        }
                        {
                            selectedInfoTab == EventInformationTab.Settings &&
                            <SettingsSection
                                eventInfo={eventInfo}
                                handleUpdateEventInfo={handleUpdateEventInfo}
                                setIsDeletionConfirmationModalVisible={setIsEventDeletionConfirmationModalVisible}
                            />
                        }
                        {
                            selectedInfoTab == EventInformationTab.Analytics &&
                            <AnalyticsSection
                                eventInfo={eventInfo}
                                handleUpdateEventInfo={handleUpdateEventInfo}
                            />
                        }
                    </div>
                </section>
            }
            {
                isFetchingEventInfo && !eventInfo &&
                <FullPageLoader />
            }
            {
                !isFetchingEventInfo && !eventInfo &&
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <h2 className="text-2xl font-medium">Event not found</h2>
                    <p className="text-white/60">The event you are looking for does not exist.</p>
                </div>
            }
        </div>
    );
};

export default EventDetails;
