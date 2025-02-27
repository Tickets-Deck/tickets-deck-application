"use client"
import { FunctionComponent, ReactElement, useEffect, useState, useContext } from 'react';
import styles from "../../styles/EventDetails.module.scss";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import images from '../../../public/images';
import moment from 'moment';
import TicketDelivery from '../../components/Modal/TicketDelivery';
import SkeletonEventInfo from '../../components/Skeletons/SkeletonEventInfo';
import { EventResponse } from '@/app/models/IEvents';
import { RetrievedTicketResponse } from '@/app/models/ITicket';
import { useFetchEventById, useFetchEventsByTags } from '@/app/api/apiClient';
import { catchError } from '@/app/constants/catchError';
import TicketsSelectionContainer from '@/app/components/Event/TicketsSelection';
import TicketsFetchErrorContainer from '@/app/components/Event/TicketsFetchError';
import useResponsiveness from '../../hooks/useResponsiveness';
import EventMainInfo from '@/app/components/Event/EventInfo';
import { RootState } from '@/app/redux/store';
import { useSelector } from 'react-redux';
import ContactDetailsModal from '@/app/components/Modal/ContactDetailsModal';
import { CustomerContactDetails } from '@/app/models/IUser';
import { useApplicationContext } from '@/app/context/ApplicationContext';
import { ToastContext } from '@/app/context/ToastCardContext';

interface EventDetailsPageProps {
    params: { id: string }
}

export interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}


const EventDetailsPage: FunctionComponent<EventDetailsPageProps> = ({ params }): ReactElement => {
    const router = useRouter();
    const appTheme = useSelector((state: RootState) => state.theme.appTheme);

    const id = params.id;

    const fetchEventInfo = useFetchEventById();
    const toasthandler = useContext(ToastContext);
    const { handleFetchTransactionFee } = useApplicationContext();

    const [eventInfo, setEventInfo] = useState<EventResponse>();
    const [eventTickets, setEventTickets] = useState<RetrievedTicketResponse[]>();
    const [contactDetails, setContactDetails] = useState<CustomerContactDetails>();

    const [loader, setLoader] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [ticketsSelectionContainerIsVisible, setTicketsSelectionContainerIsVisible] = useState(false);

    const [ticketDeliveryModalIsVisible, setTicketDeliveryModalIsVisible] = useState(false);
    const [contactDetailsModalIsVisible, setContactDetailsModalIsVisible] = useState(false);

    const eventLocation = eventInfo?.location?.address + ' ' + eventInfo?.location?.city + ', ' + eventInfo?.location?.state + ', ' + eventInfo?.location?.country;

    const isPurchaseStartDateInFuture = eventInfo ? new Date(eventInfo?.purchaseStartDate) > new Date() : false;
    const [timeLeftTillPurchaseStarts, setTimeLeftTillPurchaseStarts] = useState<string | null>(null);

    useEffect(() => {
        if (isPurchaseStartDateInFuture) {
            // const interval = setInterval(() => {
            //     const daysLeft = moment(eventInfo?.purchaseStartDate).diff(moment(), 'days');
            //     const hoursLeft = moment(eventInfo?.purchaseStartDate).diff(moment(), 'hours');
            //     const minutesLeft = moment(eventInfo?.purchaseStartDate).diff(moment(), 'minutes');
            //     const secondsLeft = moment(eventInfo?.purchaseStartDate).diff(moment(), 'seconds');
                
            //     if (daysLeft > 0) {
            //         setTimeLeftTillPurchaseStarts(`${daysLeft} days, ${hoursLeft} hrs, ${minutesLeft} mins, ${(secondsLeft / 1000) % 60} secs`);
            //         return;
            //     } 
            //     if (hoursLeft > 0) {
            //         setTimeLeftTillPurchaseStarts(`${hoursLeft} hrs, ${minutesLeft % 60} mins, ${(secondsLeft / 1000) % 60} secs`);
            //         return;
            //     }
            //     // if (minutesLeft > 0) {
            //     //     setTimeLeftTillPurchaseStarts(`${minutesLeft} mins, ${secondsLeft} secs`);
            //     //     return;
            //     // }
            //     // setTimeLeftTillPurchaseStarts(`${secondsLeft} secs`);
            // }, 1000);
            
            // return () => clearInterval(interval);
            setTimeLeftTillPurchaseStarts(moment(eventInfo?.purchaseStartDate).fromNow());
        }
    }, [timeLeftTillPurchaseStarts, eventInfo]);

    // useEffect hook to set total price 
    useEffect(() => {
        // Filter through event ticket types availableParallelism, then check for only the selected tickets 
        const selectedTickets = eventTickets?.filter((ticket) => ticket.isSelected);
        // iterates through each ticket in the selected tickets array and adds up the multiplication of the ticket price and the selected tickets count for each ticket. 
        setTotalPrice(selectedTickets?.reduce((total, ticket) => total + ticket.price * ticket.selectedTickets, 0) as number);
    }, [eventTickets]);

    function addEventToGoogleCalender() {
        if (!eventInfo) {
            return;
        }
        const eventTitle = eventInfo?.title;
        const eventDate = moment(eventInfo?.startDate).format('YYYY-MM-DD');
        const eventTime = moment(eventInfo?.startDate).format('hh:mm a');
        const location = eventLocation;

        const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${eventDate}T${eventTime}%2F${eventDate}T${eventTime}&location=${encodeURIComponent(location)}`;

        window.open(googleCalendarUrl, "_blank");
    };

    async function handleFetchEventInfo() {

        // Set running flag
        setLoader(true);

        await fetchEventInfo(id)
            .then((response) => {

                // Log the result
                console.log("Event: ", response.data);

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

                // if(error.response.data.error === "Event not found") {
                //     // Route to event not-found page
                //     router.push(`/event/not-found`);
                // }

                // Display the error
                toasthandler?.logError(
                    'Error fetching results',
                    'We encountered an error while fetchng event offers. Please try again.'
                );

                catchError(error);
                console.log("Error fetching info: ", error);

                // Unset running flag
                setLoader(false);
            })
    };

    // async function handleFetchSimilarEvents() {
    //     try {
    //         await fetchEventsByTags(eventInfo?.tags ?? [], eventInfo?.eventId as string)
    //             .then((response) => {
    //                 // Log the result
    //                 console.log('Result:', response.data);

    //                 // Set the event results
    //                 setEvents(response.data);
    //             })
    //             .catch((error) => {

    //                 // Display the error
    //                 toasthandler?.logError(
    //                     'Error fetching results',
    //                     'We encountered an error while fetchng event offers. Please try again.'
    //                 );

    //                 catchError(error);
    //             })
    //             .finally(() => {
    //                 setIsFetchingSimilarEvents(false);
    //             });
    //     } catch (error) {
    //         console.error('Error fetching data:', error);
    //     }
    // };

    useEffect(() => {
        // Clear previous info
        setEventInfo(undefined);
        setEventTickets(undefined);
        setTicketsSelectionContainerIsVisible(false);

        if (id) {
            handleFetchTransactionFee(id);
            handleFetchEventInfo();
        }
    }, [id]);

    // useEffect(() => {
    //     if(eventInfo) {
    //         handleFetchSimilarEvents();
    //     }
    // }, [eventInfo]);

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
            <ContactDetailsModal
                visibility={contactDetailsModalIsVisible}
                setVisibility={setContactDetailsModalIsVisible}
                setTicketDeliveryModalIsVisible={setTicketDeliveryModalIsVisible}
                setContactDetails={setContactDetails}
                contactDetails={contactDetails}
            />
            <TicketDelivery
                appTheme={appTheme}
                visibility={ticketDeliveryModalIsVisible}
                setVisibility={setTicketDeliveryModalIsVisible}
                eventTickets={eventTickets}
                eventInfo={eventInfo}
                totalPrice={totalPrice}
                contactDetails={contactDetails}
            />
            <div className={styles.eventDetailsPage}>
                {
                    eventInfo?.purchaseEndDate && new Date(eventInfo?.purchaseEndDate) < new Date() ?
                        <section className={styles.heroSection}>
                            <div className={styles.video}>
                                <video
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    onLoadStart={(e) => e.currentTarget.playbackRate = 0.05}
                                    onLoadedData={(e) => e.currentTarget.playbackRate = 0.05}
                                    onPlay={(e) => e.currentTarget.playbackRate = 0.05}
                                    src="https://res.cloudinary.com/dvxqk1487/video/upload/v1704506218/videos/Pexels_Videos_2022395_1080P_po4ic2.mp4" />
                            </div>
                            <div className={styles.textContents}><span>
                                Ouch! Seems like you missed this event.
                                <span className={styles.img}><Image src={images.sad_face} alt='Sad face' /></span>
                            </span>
                                <h2>Event Information</h2>
                            </div>
                        </section> :
                        <section className={styles.heroSection}>
                            <div className={styles.video}>
                                <video
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    src="https://res.cloudinary.com/dvxqk1487/video/upload/v1704506218/videos/Pexels_Videos_2022395_1080P_po4ic2.mp4" />
                            </div>
                            <div className={styles.textContents}>
                                <span>
                                    Time to grab those tickets!
                                    <span className={styles.img}><Image src={images.woman_dancing} alt='Woman dancing' /></span>
                                </span>
                                <h2>Event Information</h2>
                            </div>
                        </section>
                }

                {eventInfo ?
                    <section className={styles.eventInfoContainer}>
                        <EventMainInfo
                            appTheme={appTheme}
                            eventInfo={eventInfo}
                            setTicketsSelectionContainerIsVisible={setTicketsSelectionContainerIsVisible}
                            addEventToGoogleCalender={addEventToGoogleCalender}
                        />
                        <div className={styles.optionalSection} id='optionalSection'>
                            {ticketsSelectionContainerIsVisible && eventTickets && eventTickets.length > 0 &&
                                <TicketsSelectionContainer
                                    appTheme={appTheme}
                                    eventTickets={eventTickets}
                                    setEventTickets={setEventTickets}
                                    totalPrice={totalPrice}
                                    setContactDetailsModalIsVisible={setContactDetailsModalIsVisible}
                                    setTicketDeliveryModalIsVisible={setTicketDeliveryModalIsVisible}
                                    setTicketsSelectionContainerIsVisible={setTicketsSelectionContainerIsVisible}
                                    timeLeftTillPurchaseStarts={timeLeftTillPurchaseStarts}
                                />
                            }
                            {ticketsSelectionContainerIsVisible && (!eventTickets || eventTickets?.length == 0) &&
                                <TicketsFetchErrorContainer />
                            }
                        </div>
                        {
                            !ticketsSelectionContainerIsVisible &&
                            <>
                                <div className="mt-8 px-5">
                                    <h3 className='text-2xl font-medium text-gray-400 mb-2'>More details about event</h3>
                                    <p
                                        className={`'text-sm text-gray-200' ${styles.eventDescription}`}
                                        dangerouslySetInnerHTML={{ __html: eventInfo.description }} />
                                </div>
                                {/* <div className="mt-8 px-5">
                                    <h3 className='text-2xl font-medium text-gray-400 mb-2'>Event Highlights</h3>
                                </div> */}
                            </>
                        }
                    </section> :
                    <SkeletonEventInfo />
                }

                {/* <EventsGroup
                    title='Similar Events'
                    subText='Dear superstar, below is a list of all events available at the moment.'
                    eventsData={events}
                    isFetchingEvents={isFetchingSimilarEvents}
                /> */}
            </div>
        </>
    );
}

export default EventDetailsPage;