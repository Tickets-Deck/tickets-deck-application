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
import { RetrievedTicketResponse } from "@/app/models/ITicket";
import { EventRequest, EventResponse, UpdateEventRequest } from "@/app/models/IEvents";
import { useFetchEventById, useUpdateEventById } from "@/app/api/apiClient";
import { catchError } from "@/app/constants/catchError";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";
import { toast } from "sonner";
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

interface EventDetailsProps {
    params: { id: string };
}

const EventDetails: FunctionComponent<EventDetailsProps> = ({ params }): ReactElement => {

    const fetchEventInfo = useFetchEventById();
    const updateEventById = useUpdateEventById();
    const toasthandler = useContext(ToastContext);
    const router = useRouter();
    const { data: session } = useSession();

    const user = session?.user;

    const id = params.id;

    const [eventInfo, setEventInfo] = useState<EventResponse>();
    const [updatedEventInfo, setUpdatedEventInfo] = useState<UpdateEventRequest>();
    const [eventTicketTypes, setEventTicketTypes] = useState<RetrievedTicketResponse[]>();

    const [isFetchingEventInfo, setIsFetchingEventInfo] = useState(true);
    const [isUpdatingEventInfo, setIsUpdatingEventInfo] = useState(false);
    const [selectedInfoTab, setSelectedInfoTab] = useState(EventInformationTab.Overview);

    const [
        ticketsSelectionContainerIsVisible,
        setTicketsSelectionContainerIsVisible,
    ] = useState(false);

    function shareEvent() {
        const eventUrl = `${window.location.origin + ApplicationRoutes.GeneralEvent + eventInfo?.id
            }`;

        navigator.clipboard
            .writeText(`${eventInfo?.title} - Ticketsdeck Events: ${eventUrl}`)
            .then(() => {
                toast.success(`The link to ${eventInfo?.title} has been copied.`);
            })
            .catch((error) => {
                toast.error("Failed to copy event link. Please try again.");
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

        await fetchEventInfo(id)
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
    }

    async function handleUpdateEventInfo(updatedEventInfo: UpdateEventRequest) {
        await updateEventById(user?.token as string, id, updatedEventInfo)
            .then(async (response) => {
                // toasthandler?.logSuccess("Success", "Event information updated successfully.");
                await handleFetchEventInfo();
            })
            .catch((error) => { 
                toasthandler?.logError("Error updating event information.", "We encountered an error while updating event information. Please try again.");
                catchError(error);
            })
            // .finally(() => {

            // });
    };

    useEffect(() => {
        // Clear previous info
        setEventInfo(undefined);
        setEventTicketTypes(undefined);
        setTicketsSelectionContainerIsVisible(false);

        if (params && params.id) {
            console.log("Fetching info based on Event ID:", id);
            handleFetchEventInfo();
        } else {
            // Route to flight not-found page
            router.push(`/event/not-found`);
        }
    }, [params]);

    useEffect(() => {
        if (eventInfo && eventInfo.tickets !== null) {
            const updatedTicketTypes = eventInfo.tickets.map((ticket) => ({
                ...ticket,
                isSelected: false,
                selectedTickets: 0,
            }));
            setEventTicketTypes(updatedTicketTypes);
            console.log(eventTicketTypes);
        }
    }, [eventInfo]);

    return (
        <div className='text-white bg-dark-grey min-h-full h-fit'>
            {!isFetchingEventInfo && eventInfo &&
                <section className='p-[1.25rem]'>
                    <div className="flex flex-row justify-between items-center gap-4 mb-10">
                        <div>
                            <h4 className="mb-1">Event Information</h4>
                            <h2 className="text-3xl font-medium">Tour To Canada</h2>
                            <p className="text-sm text-white/60">Posted on: Thu, Feb 20, 2025, 11:15 AM | 143</p>
                        </div>
                        <div className="flex flex-row items-center gap-4">
                            <Tooltip
                                position={"left"}
                                tooltipText='Share event'>
                                <div
                                    className="w-10 h-10 rounded-full bg-[#D5542A] grid place-items-center cursor-pointer"
                                    onClick={() => shareEvent()}>
                                    <Icons.Share />
                                </div>
                            </Tooltip>
                            {/* <button className="primaryButton flex flex-row items-center">Edit Event</button>
                            <button className="primaryButton flex flex-row items-center !bg-white !text-black">Publish Updates</button> */}
                        </div>
                    </div>

                    {/* Tab section */}
                    <div className="w-full flex flex-col space-y-6">
                        {/* Check-in Area - Only shows when event is live */}
                        {isEventLive() && (
                            <div className="mb-8">
                                <CheckInArea
                                    eventId={eventInfo.eventId}
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
                            />
                        }
                        {
                            selectedInfoTab == EventInformationTab.Tickets &&
                            <TicketsSection
                                eventInfo={eventInfo}
                                handleUpdateEventInfo={handleUpdateEventInfo}
                            />
                        }
                        {
                            selectedInfoTab == EventInformationTab.Settings &&
                            <SettingsSection
                                eventInfo={eventInfo}
                                handleUpdateEventInfo={handleUpdateEventInfo}
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
