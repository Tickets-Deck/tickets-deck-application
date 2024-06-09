"use client"
import { FunctionComponent, ReactElement, useEffect, useState, useContext } from 'react';
import styles from "../../styles/EventDetails.module.scss";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import images from '../../../public/images';
import { ToastContext } from '../../extensions/toast';
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

interface EventDetailsPageProps {
    params: { id: string }
}


const EventDetailsPage: FunctionComponent<EventDetailsPageProps> = ({ params }): ReactElement => {
    const router = useRouter();
    const appTheme = useSelector((state: RootState) => state.theme.appTheme);

    const windowRes = useResponsiveness();
    const isMobile = windowRes.width && windowRes.width < 768;
    const onMobile = typeof (isMobile) == "boolean" && isMobile;
    const onDesktop = typeof (isMobile) == "boolean" && !isMobile;

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
    };

    async function handleFetchEventInfo() {

        // Set running flag
        setLoader(true);

        await fetchEventInfo(id)
            .then((response) => {

                // Log the result
                console.log("Events: ", response.data);

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
            <TicketDelivery
                appTheme={appTheme}
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
                            playsInline
                            src="https://res.cloudinary.com/dvxqk1487/video/upload/v1704506218/videos/Pexels_Videos_2022395_1080P_po4ic2.mp4" />
                    </div>
                    <div className={styles.textContents}>
                        <span>Time to grab those tickets! <span className={styles.img}><Image src={images.woman_dancing} alt='Woman dancing' /></span></span>
                        <h2>Event Information</h2>
                    </div>
                </section>

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