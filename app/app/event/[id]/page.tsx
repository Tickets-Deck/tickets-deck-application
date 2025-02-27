"use client";
import {
    FunctionComponent,
    ReactElement,
    useEffect,
    useState,
    useContext,
} from "react";
import { useRouter } from "next/navigation";
import moment from "moment";
import { Link as ScrollLink } from "react-scroll";
import SkeletonEventInfo from "../../../components/Skeletons/SkeletonEventInfo";
import { RetrievedTicketResponse } from "@/app/models/ITicket";
import { EventResponse } from "@/app/models/IEvents";
import { useFetchEventById } from "@/app/api/apiClient";
import { catchError } from "@/app/constants/catchError";
import { StorageKeys } from "@/app/constants/storageKeys";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";
import { toast } from "sonner";
import { ToastContext } from "@/app/context/ToastCardContext";
import { EventInformationTab } from "@/app/enums/EventInformationTab";
import { serializeEventInformationTab } from "@/app/constants/serializer";
import OverviewSection from "@/app/components/Event/View/Publisher/OverviewSection";

interface EventDetailsProps {
    params: { id: string };
}

const EventDetails: FunctionComponent<EventDetailsProps> = ({
    params,
}): ReactElement => {
    const router = useRouter();

    const id = params.id;

    const fetchEventInfo = useFetchEventById();
    const toasthandler = useContext(ToastContext);

    const [eventInfo, setEventInfo] = useState<EventResponse>(
        {
            "id": "f2731894-45fa-4900-a09a-544f7a3901b4",
            "eventId": "7EM80F",
            "publisherId": "71f2dd93-a405-410d-9e37-73ccefb764f1",
            "title": "Tour To Canada",
            "description": "<p>Description comes here</p>",
            "locationId": null,
            "venue": "45, Sheraton roaad, Ikoyi",
            "onlineLink": null,
            "startDate": "2025-02-27T15:30:00.000Z",
            "endDate": "2025-02-27T15:30:00.000Z",
            "categoryId": "f6701093-5ed1-4529-a6a1-d0d692e74d6d",
            "visibility": "PUBLIC",
            "mainImageUrl": "https://res.cloudinary.com/dnrczexeg/image/upload/v1740605227/event_images/7EM80F_xfu6s6.jpg",
            "currency": "NGN",
            "purchaseStartDate": "2025-02-28T12:00:00.000Z",
            "purchaseEndDate": "2025-02-28T16:00:00.000Z",
            "allowedGuestType": "Everyone",
            "bookmarksCount": 0,
            "favoritesCount": 0,
            // "ticketOrdersCount": 0,
            ticketsPurchased: [],
            ticketsPurchasedCount: 1,
            "isFeatured": false,
            "isArchived": false,
            "organizerPaysFee": false,
            "createdAt": "2025-02-26T21:27:07.547Z",
            "updatedAt": "2025-02-26T21:27:07.547Z",
            "tickets": [
              {
                "id": "efa4b782-1b92-432d-a841-18b0253831a1",
                "eventId": "f2731894-45fa-4900-a09a-544f7a3901b4",
                "name": "General",
                "price": 1500,
                "quantity": 15,
                "remainingTickets": 15,
                "numberOfUsers": 1,
                "description": "This is only a jolly ticket. General peeps only",
                ticketsPurchased: [],
                ticketsPurchasedCount: 1,
                "visibility": true,
                "createdAt": "2025-02-26T21:27:07.547Z",
                "updatedAt": "2025-02-26T21:27:07.547Z"
              },
              {
                "id": "51c53106-b00b-4332-8e28-589cc6857e40",
                "eventId": "f2731894-45fa-4900-a09a-544f7a3901b4",
                "name": "Couples",
                "price": 3500,
                "quantity": 10,
                "remainingTickets": 10,
                "numberOfUsers": 2,
                "description": "This is for all couples coming to the event. Come with your spouse",
                ticketsPurchased: [],
                ticketsPurchasedCount: 1,
                "visibility": true,
                "createdAt": "2025-02-26T21:27:07.547Z",
                "updatedAt": "2025-02-26T21:27:07.547Z"
              }
            ],
            "subImages": [],
            "tags": [
              "Canada",
              "Tour"
            ],
            "location": null,
            "category": "Bustic",
            "publisher": {
              "username": "afolabisimlex",
              "id": "71f2dd93-a405-410d-9e37-73ccefb764f1",
              "profilePhoto": "",
              "firstName": "Similoluwa",
              "lastName": "Afolabi"
            }
          }
    );
    const [eventTicketTypes, setEventTicketTypes] =
        useState<RetrievedTicketResponse[]>();
    // const [selectedEventTicketTypes, setSelectedEventTicketTypes] = useState<RetrievedTicketType[]>();
    const [loader, setLoader] = useState(false);
    const [totalSelectedTicketsCount, setTotalSelectedTicketsCount] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [selectedInfoTab, setSelectedInfoTab] = useState(EventInformationTab.Overview);
    const [
        ticketsSelectionContainerIsVisible,
        setTicketsSelectionContainerIsVisible,
    ] = useState(false);

    const [ticketDeliveryModalIsVisible, setTicketDeliveryModalIsVisible] =
        useState(false);

    const eventLocation =
        eventInfo?.location?.address +
        " " +
        eventInfo?.location?.city +
        ", " +
        eventInfo?.location?.state +
        ", " +
        eventInfo?.location?.country;

    // useEffect hook to set total selected tickets count
    useEffect(() => {
        /**
         * the reduce function iterates through each ticket in the eventTicketTypes array and adds up the selectedTickets count for each ticket.
         * The 0 passed as the second argument to reduce initializes the total variable to 0.
         */
        setTotalSelectedTicketsCount(
            eventTicketTypes?.reduce(
                (total, ticket) => total + ticket.selectedTickets,
                0
            ) as number
        );
    }, [eventTicketTypes]);

    // useEffect hook to set total price
    useEffect(() => {
        // Filter through event ticket types availableParallelism, then check for only the selected tickets
        const selectedTickets = eventTicketTypes?.filter(
            (ticket) => ticket.isSelected
        );
        // iterates through each ticket in the selected tickets array and adds up the multiplication of the ticket price and the selected tickets count for each ticket.
        setTotalPrice(
            selectedTickets?.reduce(
                (total, ticket) => total + ticket.price * ticket.selectedTickets,
                0
            ) as number
        );
    }, [eventTicketTypes]);

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

    function addEventToGoogleCalender() {
        if (!eventInfo) {
            return;
        }
        const eventTitle = eventInfo?.title;
        const eventDate = moment(eventInfo.startDate).format("YYYY-MM-DD"); // Use the actual event date
        // const eventTime = moment(eventInfo?.eventDateTime).format('HH:MM');      // Use the actual event time
        const eventTime = moment(eventInfo.startDate).format("hh:mm a");; // Use the actual event time
        const location = eventLocation;

        const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
            eventTitle
        )}&dates=${eventDate}T${eventTime}%2F${eventDate}T${eventTime}&location=${encodeURIComponent(
            location
        )}`;

        window.open(googleCalendarUrl, "_blank");
    }

    function incrementTicket(selectedTicketType: RetrievedTicketResponse) {
        const updatedTicketsCount = eventTicketTypes?.map((ticketType) => {
            if (ticketType === selectedTicketType) {
                return {
                    ...ticketType,
                    selectedTickets: ticketType.selectedTickets + 1,
                    isSelected: true,
                };
            }
            return ticketType;
        });
        setEventTicketTypes(updatedTicketsCount);
    }
    function decrementTicket(selectedTicketType: RetrievedTicketResponse) {
        const updatedTicketsCount = eventTicketTypes?.map((ticketType) => {
            if (ticketType === selectedTicketType) {
                if (selectedTicketType.selectedTickets == 1) {
                    return {
                        ...ticketType,
                        selectedTickets: ticketType.selectedTickets - 1,
                        isSelected: false,
                    };
                }
                return {
                    ...ticketType,
                    selectedTickets: ticketType.selectedTickets - 1,
                    isSelected: true,
                };
            }
            return ticketType;
        });
        setEventTicketTypes(updatedTicketsCount);
    }

    function retrieveNewlyCreatedEvent() {
        // Fetch the newly created event from  session storage
        const event = sessionStorage.getItem(StorageKeys.NewlyCreatedEvent);

        // Parse the event from string to object
        const newEvent = JSON.parse(event!);

        // Return the new event
        return newEvent;
    }

    async function handleFetchEventInfo() {
        return;

        // Set running flag
        setLoader(true);

        // Retrieve the event info
        // const retrievedEvent = retrieveNewlyCreatedEvent();

        // // Check if the ID of the retrieved event is the same as the ID in the URL
        // if (retrievedEvent && retrievedEvent.id == id) {
        //     // Update the event results
        //     setEventInfo(retrievedEvent);

        //     // Unset running flag
        //     setLoader(false);

        //     // Stop execution
        //     return;
        // }

        // If we get here, it means the event is not the newly created event
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
                    "Error fetching results",
                    "We encountered an error while fetchng event offers. Please try again."
                );

                catchError(error);

                // Unset running flag
                setLoader(false);
            });
    }

    // useEffect(() => {
    //     // Clear previous info
    //     setEventInfo(undefined);
    //     setEventTicketTypes(undefined);
    //     setTicketsSelectionContainerIsVisible(false);

    //     if (params && params.id) {
    //         console.log("Fetching info based on Event ID:", id);
    //         handleFetchEventInfo();
    //     } else {
    //         // Route to flight not-found page
    //         router.push(`/event/not-found`);
    //     }
    // }, [params]);

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
        <div className='text-white bg-dark-grey'>
            {eventInfo ? (
                <section className='p-[1.25rem]'>
                    <div className="flex flex-row justify-between items-center gap-4 mb-10">
                        <div>
                            <h4 className="mb-1">Event Information</h4>
                            <h2 className="text-3xl font-medium">Tour To Canada</h2>
                            <p className="text-sm text-white/60">Posted on: Thu, Feb 20, 2025, 11:15 AM | 143</p>
                        </div>
                        <div>
                            Actions here
                        </div>
                    </div>

                    {/* Tab section */}
                    <div className="w-full flex flex-col space-y-6">
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

                        <OverviewSection />
                    </div>

                    {/* <div className='flex items-center rounded-[1.5rem] bg-container-grey gap-4 relative min-h-[320px] h-fit p-4 min-[400px]:p-0 max-[550px]:flex-col'>
                        <div className='[&_img]:object-cover h-[180px] min-[350px]:w-full min-[550px]:w-[30%] min-[550px]:min-h-[100%] min-[550px]:h-[300px] rounded-2xl overflow-hidden relative inline-flex'>
                            <Image src={eventInfo.mainImageUrl} alt='Event flyer' fill />
                        </div>
                        <div className='flex flex-col min-[400px]:flex-row gap-1 items-end w-full min-h-full h-fit'>
                            <div className='w-full order-2 min-[400px]:order-1 flex flex-col gap-[0.85rem]'>
                                <h2 className='min-[400px]:text-[30px] text-[20px] font-semibold leading-none'>
                                    {eventInfo?.title}
                                </h2>
                                <p className='text-purple-grey text-xs'>
                                    Posted on:{" "}
                                    {moment(eventInfo?.createdAt).format("Do MMMM YYYY")}
                                </p>
                                <div className='flex items-center gap-[0.35rem] w-fit hover:opacity-65'>
                                    <div className='size-8 min-[400px]:size-10 relative rounded-full overflow-hidden'>
                                        <Image
                                            className='size-full object-cover'
                                            src={eventInfo.publisher.profilePhoto || images.user_avatar}
                                            alt='Avatar'
                                            fill
                                        />
                                    </div>
                                    <div className='text-white font-medium text-sm min-[400px]:text-base'>{`${eventInfo.publisher.firstName} ${eventInfo.publisher.lastName}`}</div>
                                </div>
                                <div className='flex items-center gap-3'>
                                    <h4 className='font-medium text-white'>
                                        {moment(eventInfo?.startDate).format("MMM. Do YYYY")}
                                    </h4>
                                    <h4 className='font-medium text-white'>{eventInfo.time}</h4>
                                </div>
                                <div className='w-full'>
                                    <p className='text-sm text-white capitalize'>{eventInfo.venue}</p>
                                    <Link
                                        href={`https://www.google.com/maps/search/?api=1&query=${eventInfo.venue}`}
                                        target='_blank'
                                    >
                                        <button className='text-purple-grey underline bg-transparent border-none outline-none cursor-pointer hover:opacity-80'>
                                            Get directions on map
                                        </button>
                                    </Link>
                                </div>
                                <div className='flex gap-3 mt-[0.8rem] flex-col min-[550px]:flex-row'>
                                    {
                                        eventInfo && eventInfo?.tickets == null ? (
                                            <>
                                                <div className=''>
                                                    <span className='text-purple-grey'>
                                                        Ticket price:
                                                    </span>
                                                </div>
                                                <button className='primaryButton !text-sm min-[400px]:!text-lg !font-medium !text-black !rounded-[2.5rem] !bg-white'>
                                                    Purchase your ticket(s)
                                                </button>
                                            </>
                                        ) : (
                                            <></>
                                        )
                                    }
                                </div>
                            </div>
                            <div className='w-full mb-2 gap-2 flex-row min-[400px]:flex-col min-[400px]:w-[8%] flex min-[400px]:gap-[0.85rem] '>
                                <Tooltip tooltipText='Add to calender'>
                                    <div
                                        className='ml-auto size-8 min-[400px]:size-10 [&_svg]:size-4 rounded-full bg-white grid place-items-center relative'
                                        onClick={() => addEventToGoogleCalender()}
                                    >
                                        <CalenderIcon />
                                    </div>
                                </Tooltip>
                                <Tooltip tooltipText='Like event'>
                                    <div className='ml-auto size-8 min-[400px]:size-10 [&_svg]:size-4 rounded-full bg-white grid place-items-center relative'>
                                        <HeartIcon />
                                    </div>
                                </Tooltip>
                                <Tooltip tooltipText='Share event'>
                                    <div
                                        className='ml-auto size-8 min-[400px]:size-10 [&_svg]:size-4 rounded-full bg-white grid place-items-center relative'
                                        style={{ backgroundColor: "#D5542A" }}
                                        onClick={() => shareEvent()}
                                    >
                                        <ShareIcon />
                                    </div>
                                </Tooltip>
                            </div>
                        </div>
                    </div> */}
                </section>
            ) : (
                <SkeletonEventInfo forConsole />
            )}
            {/* <EventsGroup title='Similar Events' subText='Dear superstar, below is a list of all events available at the moment.' eventsData={events} /> */}
        </div>
    );
};

export default EventDetails;
