"use client"
import { FunctionComponent, ReactElement, useEffect, useState, useContext } from 'react';
import styles from "../../../styles/EventDetails.module.scss";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import images from '../../../../public/images';
import { CalenderIcon, HeartIcon, ShareIcon } from '../../../components/SVGs/SVGicons';
import Tooltip from '../../../components/custom/Tooltip';
import { events } from '../../../components/demoData/Events';
import { ToastContext } from '../../../extensions/toast';
import moment from 'moment';
import useResponsive from '../../../hooks/useResponsiveness';
import Link from 'next/link';
import { Link as ScrollLink } from 'react-scroll';
import SkeletonEventInfo from '../../../components/Skeletons/SkeletonEventInfo';
import { RetrievedTicketResponse, TicketResponse } from '@/app/models/ITicket';
import { EventResponse } from '@/app/models/IEvents';
import { useFetchEventById } from '@/app/api/apiClient';
import { catchError } from '@/app/constants/catchError';

interface EventDetailsProps {
    params: { id: string }
}


const EventDetails: FunctionComponent<EventDetailsProps> = ({ params }): ReactElement => {

    const router = useRouter();

    const windowRes = useResponsive();
    const onMobile = windowRes.width && windowRes.width < 768;
    const id = params.id;

    const fetchEventInfo = useFetchEventById();
    const toasthandler = useContext(ToastContext);

    const [eventInfo, setEventInfo] = useState<EventResponse>();
    const [eventTicketTypes, setEventTicketTypes] = useState<RetrievedTicketResponse[]>();
    // const [selectedEventTicketTypes, setSelectedEventTicketTypes] = useState<RetrievedTicketType[]>();
    const [loader, setLoader] = useState(false);
    const [totalSelectedTicketsCount, setTotalSelectedTicketsCount] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [ticketsSelectionContainerIsVisible, setTicketsSelectionContainerIsVisible] = useState(false);

    const [ticketDeliveryModalIsVisible, setTicketDeliveryModalIsVisible] = useState(false);

    const eventLocation = eventInfo?.location?.address + ' ' + eventInfo?.location?.city + ', ' + eventInfo?.location?.state + ', ' + eventInfo?.location?.country;

    // useEffect hook to set total selected tickets count
    useEffect(() => {
        /**
         * the reduce function iterates through each ticket in the eventTicketTypes array and adds up the selectedTickets count for each ticket. 
         * The 0 passed as the second argument to reduce initializes the total variable to 0.
         */
        setTotalSelectedTicketsCount(eventTicketTypes?.reduce((total, ticket) => total + ticket.selectedTickets, 0) as number);
    }, [eventTicketTypes]);

    // useEffect hook to set total price 
    useEffect(() => {
        // Filter through event ticket types availableParallelism, then check for only the selected tickets 
        const selectedTickets = eventTicketTypes?.filter((ticket) => ticket.isSelected);
        // iterates through each ticket in the selected tickets array and adds up the multiplication of the ticket price and the selected tickets count for each ticket. 
        setTotalPrice(selectedTickets?.reduce((total, ticket) => total + ticket.price * ticket.selectedTickets, 0) as number);
    }, [eventTicketTypes]);

    function shareEvent() {
        const eventURL = window.location.href;
        // const tempInput = document.createElement("input");
        // document.body.appendChild(tempInput);
        // tempInput.value = eventURL;
        // tempInput.select();
        // document.execCommand("copy");
        // document.body.removeChild(tempInput);
        try {
            navigator.clipboard.writeText(eventURL);
            // alert("Event link copied to clipboard!");
            toasthandler?.logSuccess('Event link copied.', `The link to ${eventInfo?.title} has been copied.`)
        } catch (error) {
            console.error("Copying to clipboard failed:", error);
        }
    }
    function shareEventMobile() {
        const eventURL = window.location.href;
        if (navigator.share) {
            navigator.share({
                title: "Check out this event!",
                text: "I found this amazing event. You should check it out!",
                url: eventURL
            })
                .then(() => console.log("Shared successfully"))
                .catch(error => console.log("Sharing failed:", error));
        } else {
            console.log("Web Share API not supported");
        }
    }
    function addEventToGoogleCalender() {
        if (!eventInfo) {
            return;
        }
        const eventTitle = eventInfo?.title;
        const eventDate = moment(eventInfo.date).format('YYYY-MM-DD'); // Use the actual event date
        // const eventTime = moment(eventInfo?.eventDateTime).format('HH:MM');      // Use the actual event time
        const eventTime = moment(eventInfo.time);      // Use the actual event time
        const location = eventLocation;

        const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${eventDate}T${eventTime}%2F${eventDate}T${eventTime}&location=${encodeURIComponent(location)}`;

        window.open(googleCalendarUrl, "_blank");
    }

    function incrementTicket(selectedTicketType: RetrievedTicketResponse) {
        const updatedTicketsCount = eventTicketTypes?.map(ticketType => {
            if (ticketType === selectedTicketType) {
                return {
                    ...ticketType,
                    selectedTickets: ticketType.selectedTickets + 1,
                    isSelected: true
                };
            }
            return ticketType;
        })
        setEventTicketTypes(updatedTicketsCount);
    }
    function decrementTicket(selectedTicketType: RetrievedTicketResponse) {
        const updatedTicketsCount = eventTicketTypes?.map(ticketType => {
            if (ticketType === selectedTicketType) {
                if (selectedTicketType.selectedTickets == 1) {
                    return {
                        ...ticketType,
                        selectedTickets: ticketType.selectedTickets - 1,
                        isSelected: false
                    };
                }
                return {
                    ...ticketType,
                    selectedTickets: ticketType.selectedTickets - 1,
                    isSelected: true
                };
            }
            return ticketType;
        })
        setEventTicketTypes(updatedTicketsCount);
    }

    async function handleFetchEventInfo() {
        console.log('Fetching event info...');

        // Set running flag
        setLoader(true);

        await fetchEventInfo(id)
            .then((response) => { 

                // Log the result
                console.log('Result:', response.data);

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
                    'Error fetching results',
                    'We encountered an error while fetchng event offers. Please try again.'
                );

                catchError(error);

                // Unset running flag
                setLoader(false);
            })
    }

    useEffect(() => {
        // Clear previous info
        setEventInfo(undefined);
        setEventTicketTypes(undefined);
        setTicketsSelectionContainerIsVisible(false);

        if (params && params.id) {
            console.log('Fetching info based on Event ID:', id);
            handleFetchEventInfo();
        } else {
            // Route to flight not-found page
            router.push(`/event/not-found`);
        }
    }, [params]); 

    useEffect(() => {
        if (eventInfo && (eventInfo.tickets !== null)) {
            const updatedTicketTypes = eventInfo.tickets.map(ticket => ({
                ...ticket,
                isSelected: false,
                selectedTickets: 0
            }));
            setEventTicketTypes(updatedTicketTypes);
            console.log(eventTicketTypes);
        }
    }, [eventInfo]);


    return (
        <div className={styles.userEventDetailsPage}>
            <section className={styles.heroSection}>
                <div className={styles.video}>
                    <video
                        autoPlay
                        loop
                        muted
                        src="https://res.cloudinary.com/dvxqk1487/video/upload/v1704506218/videos/Pexels_Videos_2022395_1080P_po4ic2.mp4" />
                </div>
                <div className={styles.textContents}>
                    <span>Time to party! <span className={styles.img}><Image src={images.woman_dancing} alt='Woman dancing' /></span></span>
                    <h2>Event Information</h2>
                </div>
            </section>
            {eventInfo ?
                <section className={styles.eventInfoContainer}>
                    <div className={styles.mainSection}>
                        <div className={styles.eventImage}>
                            <Image src={eventInfo.mainImageUrl} alt='Event flyer' fill />
                        </div>
                        <span className={styles.tag}>Latest</span>
                        <div className={styles.eventDetails}>
                            <div className={styles.leftInfo}>
                                <h2 className={styles.title}>{eventInfo?.title}</h2>
                                <p className={styles.datePosted}>Posted on: {moment(eventInfo?.createdAt).format('Do MMMM YYYY')}</p>
                                <div className={styles.publisherInfo}>
                                    <div className={styles.publisherInfo__image}>
                                        <Image src={eventInfo.user.image ?? images.user_avatar} alt='Avatar' fill />
                                    </div>
                                    <div className={styles.publisherInfo__name}>{`${eventInfo.user.firstName} ${eventInfo.user.lastName}`}</div>
                                </div>
                                <div className={styles.dateTime}>
                                    <h4>{moment(eventInfo?.date).format("MMM. Do YYYY")}</h4>
                                    <h4>{eventInfo.time}</h4>
                                </div>
                                {/* <div className={styles.location}>
                                    <p>{eventInfo?.location.blockNumber + ' ' + eventInfo?.location.street + ' ' + eventInfo?.location.city + ', ' + eventInfo?.location.state + ', ' + eventInfo?.location.country}</p>
                                    <Link href={`https://www.google.com/maps/search/?api=1&query=${eventInfo?.location.blockNumber},+${eventInfo?.location.street},+${eventInfo?.location.city}+${eventInfo?.location.state}+${eventInfo?.location.country}`} target='_blank'>
                                        <button>Get directions on map</button>
                                    </Link>
                                </div> */}
                                <div className={styles.location}>
                                    <p>{eventInfo.venue}</p>
                                    <Link href={`https://www.google.com/maps/search/?api=1&query=${eventInfo.venue}`} target='_blank'>
                                        <button>Get directions on map</button>
                                    </Link>
                                </div>
                                <div className={styles.bottomArea}>
                                    {eventInfo && eventInfo?.tickets == null ?
                                        <>
                                            <div className={styles.priceArea}>
                                                <span>Ticket price:</span>
                                                {/* <h2>&#8358;{eventInfo?.ticket.amount.toLocaleString()}</h2> */}
                                            </div>
                                            <button>Purchase your ticket(s)</button>
                                        </>
                                        :
                                        <ScrollLink
                                            to="optionalSection"
                                            smooth={true}
                                            duration={200}
                                            offset={-100}
                                            onClick={() => setTicketsSelectionContainerIsVisible(true)}>
                                            <button>Get available tickets</button>
                                        </ScrollLink>
                                    }
                                </div>
                            </div>
                            <div className={styles.actionButtons}>
                                <Tooltip tooltipText='Add to calender'>
                                    <div className={styles.actionButton} onClick={() => addEventToGoogleCalender()}>
                                        <CalenderIcon />
                                    </div>
                                </Tooltip>
                                <Tooltip tooltipText='Like event'>
                                    <div className={styles.actionButton}>
                                        <HeartIcon />
                                    </div>
                                </Tooltip>
                                <Tooltip tooltipText='Share event'>
                                    <div className={styles.actionButton} style={{ backgroundColor: '#D5542A' }} onClick={() => typeof (onMobile) == "boolean" && onMobile ? shareEventMobile() : shareEvent()}>
                                        <ShareIcon />
                                    </div>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                    <div className={styles.optionalSection} id='optionalSection'>
                        {ticketsSelectionContainerIsVisible && eventTicketTypes && eventTicketTypes.length > 0 &&
                            <div className={styles.ticketsSelectionContainer}>
                                <div className={styles.topArea}>
                                    <h3>Select the tickets you would like to get, and the number for each.</h3>
                                    <p>By the way, you can select multiple ticket types.</p>
                                </div>
                                <div className={styles.ticketsContainer}>
                                    {eventTicketTypes?.map((ticketType, index) => {
                                        return (
                                            <div className={`${styles.ticket} ${ticketType.selectedTickets > 0 ? styles.active : ''}`} key={index}>
                                                <div className={styles.ticket__topArea}>
                                                    <p>{ticketType.role}</p>
                                                    <h4>&#8358;{ticketType.price.toLocaleString()}</h4>
                                                </div>
                                                <div className={styles.ticket__bottomArea}>
                                                    <span onClick={() => { ticketType.selectedTickets > 0 && decrementTicket(ticketType) }}>-</span>
                                                    <p>{ticketType.selectedTickets} ticket</p>
                                                    <span onClick={() => incrementTicket(ticketType)}>+</span>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className={styles.bottomContainer}>
                                    <div className={styles.left}>
                                        <p>{totalSelectedTicketsCount} {totalSelectedTicketsCount > 1 ? 'tickets' : 'ticket'} selected</p>
                                        <div className={styles.price}>
                                            <p>Total Price:</p>
                                            <h1>&#8358;{totalPrice?.toLocaleString()}</h1>
                                        </div>
                                    </div>
                                    <button onClick={() => setTicketDeliveryModalIsVisible(true)}>Purchase {totalSelectedTicketsCount > 1 ? 'tickets' : 'ticket'}</button>
                                </div>
                            </div>
                        }
                        {ticketsSelectionContainerIsVisible && (!eventTicketTypes || eventTicketTypes?.length == 0) &&
                            <div className={styles.ticketsFetchErrorMsgContainer}>
                                <div className={styles.topArea}>
                                    <h3>Oops!</h3>
                                    {/* <p>By the way, you can select multiple ticket types.</p> */}
                                </div>
                                <div className={styles.messageContent}>
                                    <div className={styles.messageContent__image}>
                                        <Image src={images.sad_face} alt='Sad face' />
                                    </div>
                                    <h4>We encountered an issue, while trying to get the available tickets.</h4>
                                    <p>Please <span onClick={() => router.refresh()}>reload</span> the page, and keep your fingers crossed while try our best again.</p>
                                </div>
                            </div>}
                    </div>
                </section> :
                <SkeletonEventInfo />
            }
            {/* <EventsGroup title='Similar Events' subText='Dear superstar, below is a list of all events available at the moment.' eventsData={events} /> */}
        </div>
    );
}

export default EventDetails;