"use client"
import { FunctionComponent, ReactElement, useEffect, useState, useContext } from 'react';
import styles from "../../styles/EventDetails.module.scss";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import images from '../../../public/images';
import { CalenderIcon, HeartIcon, ShareIcon } from '../../components/SVGs/SVGicons';
import Tooltip from '../../components/custom/Tooltip';
import { events } from '../../components/demoData/Events';
import { ToastContext } from '../../extensions/toast';
import moment from 'moment';
import EventsGroup from '../../components/events/EventsGroup';
import useResponsive from '../../hooks/useResponsiveness';
import Link from 'next/link';
import { Link as ScrollLink } from 'react-scroll';
import TicketDelivery from '../../components/Modal/TicketDelivery';
import SkeletonEventInfo from '../../components/Skeletons/SkeletonEventInfo';
import { EventResponse } from '@/app/models/IEvents';
import { RetrievedTicketResponse } from '@/app/models/ITicket';
import { useFetchEventById } from '@/app/api/apiClient';
import { catchError } from '@/app/constants/catchError';
import TicketsSelectionContainer from '@/app/components/Event/TicketsSelection';
import TicketsFetchErrorContainer from '@/app/components/Event/TicketsFetchError';

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
    const [eventTickets, setEventTickets] = useState<RetrievedTicketResponse[]>();

    const [loader, setLoader] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [ticketsSelectionContainerIsVisible, setTicketsSelectionContainerIsVisible] = useState(false);

    const [ticketDeliveryModalIsVisible, setTicketDeliveryModalIsVisible] = useState(false);

    const eventLocation = eventInfo?.location?.address + ' ' + eventInfo?.location?.city + ', ' + eventInfo?.location?.state + ', ' + eventInfo?.location?.country;


    // useEffect hook to set total price 
    useEffect(() => {
        // Filter through event ticket types availableParallelism, then check for only the selected tickets 
        const selectedTickets = eventTickets?.filter((ticket) => ticket.isSelected);
        // iterates through each ticket in the selected tickets array and adds up the multiplication of the ticket price and the selected tickets count for each ticket. 
        setTotalPrice(selectedTickets?.reduce((total, ticket) => total + ticket.price * ticket.selectedTickets, 0) as number);
    }, [eventTickets]);

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
                // title: "Check out this event!",
                title: `${eventInfo?.title} - Events@TicketsDeck`,
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
        const eventDate = moment(eventInfo?.date).format('YYYY-MM-DD');
        const eventTime = eventInfo.time;
        const location = eventLocation;

        const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${eventDate}T${eventTime}%2F${eventDate}T${eventTime}&location=${encodeURIComponent(location)}`;

        window.open(googleCalendarUrl, "_blank");
    }

    async function handleFetchEventInfo() {

        // Set running flag
        setLoader(true);

        await fetchEventInfo(id)
            .then((response) => {

                // Log the result
                // console.log('Result:', response.data);

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
        setEventTickets(undefined);
        setTicketsSelectionContainerIsVisible(false);

        if (id) {
            handleFetchEventInfo();
        }
    }, [id]);

    useEffect(() => {
        if (eventInfo && (eventInfo.tickets !== null)) {
            const updatedTicketTypes = eventInfo.tickets.map(ticket => ({
                ...ticket,
                isSelected: false,
                selectedTickets: 0
            }));
            setEventTickets(updatedTicketTypes);
            // console.log(eventTickets);
        }
    }, [eventInfo]);


    return (
        <>
            <TicketDelivery
                visibility={ticketDeliveryModalIsVisible}
                setVisibility={setTicketDeliveryModalIsVisible}
                eventTickets={eventTickets}
                eventInfo={eventInfo}
                totalPrice={totalPrice}
            />
            <div className={styles.eventDetailsPage}>
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
                                    <p className={styles.datePosted}>Posted on: {moment(eventInfo.createdAt).format('Do MMMM YYYY')}</p>
                                    <Link className={styles.publisherInfo} href={`/u/${eventInfo.user.username ?? eventInfo.user.id}`}>
                                        <div className={styles.publisherInfo__image}>
                                            <Image src={eventInfo.user.profilePhoto ?? images.user_avatar} alt='Avatar' fill />
                                        </div>
                                        <div className={styles.publisherInfo__name}>{`${eventInfo?.user.firstName} ${eventInfo?.user.lastName}`}</div>
                                    </Link>
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
                                                    {/* <h2>&#8358;{eventInfo?.ticketPrice.amount.toLocaleString()}</h2> */}
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
                                        <div
                                            className={styles.actionButton}
                                            style={{ backgroundColor: '#D5542A' }}
                                            onClick={() => {
                                                shareEventMobile()
                                                // if (typeof (onMobile) == "boolean" && onMobile) {
                                                //     shareEventMobile();
                                                //     return;
                                                // } else if (typeof (onMobile) == "boolean" && !onMobile) {
                                                //     shareEvent()
                                                // }
                                            }}>
                                            <ShareIcon />
                                        </div>
                                    </Tooltip>
                                </div>
                            </div>
                        </div>
                        <div className={styles.optionalSection} id='optionalSection'>
                            {ticketsSelectionContainerIsVisible && eventTickets && eventTickets.length > 0 &&
                                <TicketsSelectionContainer
                                    eventTickets={eventTickets}
                                    setEventTickets={setEventTickets}
                                    totalPrice={totalPrice}
                                    setTicketDeliveryModalIsVisible={setTicketDeliveryModalIsVisible}
                                />
                            }
                            {ticketsSelectionContainerIsVisible && (!eventTickets || eventTickets?.length == 0) &&
                                <TicketsFetchErrorContainer />
                            }
                        </div>
                    </section> :
                    <SkeletonEventInfo />
                }
                <EventsGroup
                    title='Similar Events'
                    subText='Dear superstar, below is a list of all events available at the moment.'
                    eventsData={events}
                />
            </div>
        </>
    );
}

export default EventDetails;