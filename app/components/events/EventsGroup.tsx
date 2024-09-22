import { FunctionComponent, ReactElement, Dispatch, SetStateAction } from "react";
import { HorizontalLineIcon, LikeIcon, LocationPinIcon, ShareIcon } from "../SVGs/SVGicons";
import Image from "next/image";
import images from "../../../public/images";
import styles from '../../styles/EventGroupSection.module.scss';
import EventCard from "../Event/EventCard";
import { useRouter } from "next/navigation";
import { EventResponse } from "@/app/models/IEvents";
import ComponentLoader from "../Loader/ComponentLoader";
import useResponsiveness from "../../hooks/useResponsiveness";
import Link from "next/link";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";

interface EventsGroupProps {
    title: string
    subText: string
    eventsData: EventResponse[] | undefined
    consoleDisplay?: boolean
    isFetchingEvents?: boolean
    setIsDeleteConfirmationModalVisible?: Dispatch<SetStateAction<boolean>>
    setSelectedEvent?: Dispatch<SetStateAction<EventResponse | undefined>>
    forPastEvents?: boolean
}

const EventsGroup: FunctionComponent<EventsGroupProps> = (
    { title, subText, eventsData, consoleDisplay, isFetchingEvents,
        setIsDeleteConfirmationModalVisible, setSelectedEvent, forPastEvents }): ReactElement => {

    const windowRes = useResponsiveness();
    const isMobile = windowRes.width && windowRes.width < 768;
    const onMobile = typeof (isMobile) == "boolean" && isMobile;
    const onDesktop = typeof (isMobile) == "boolean" && !isMobile;

    const { push } = useRouter();

    return (
        <section className={consoleDisplay ? styles.allUserEvents : styles.allEvents}>
            <div className={styles.topArea}>
                <div className={styles.topArea__lhs}>
                    <div className={styles.main}>
                        <span>{title}</span>
                        <Image src={images.rocket} alt='Rocket' />
                    </div>
                    <p>{subText}</p>
                </div>
                <div className={styles.topArea__rhs}>
                    {
                        consoleDisplay ?
                            <Link href={ApplicationRoutes.CreateEvent}>
                                <button onClick={() => { push('/app/event/create') }}>Create event</button>
                            </Link> :
                            <></>
                        // <button>Filter</button>
                    }
                </div>
            </div>
            <div className={styles.eventsContainer}>
                <div className={styles.eventsContainerCarousel}>
                    {
                        !isFetchingEvents &&
                        (eventsData && eventsData?.length > 0) &&
                        eventsData.filter(event => consoleDisplay ? event : forPastEvents ? new Date(event.date) < new Date() : new Date(event.date) >= new Date()).map((event, index) =>
                            <EventCard
                                event={event}
                                mobileAndActionButtonDismiss
                                key={index}
                                gridDisplay={true}
                                consoleDisplay={consoleDisplay}
                                setIsDeleteConfirmationModalVisible={setIsDeleteConfirmationModalVisible}
                                setSelectedEvent={setSelectedEvent}
                            />
                        )
                    }
                    {/* {
                        ([...Array(10)]).map((_, index) =>
                            <EventCard
                            gridDisplay={true} event={eventsData?.[0] as EventResponse} key={index} />
                        )
                    } */}
                </div>
                {
                    isFetchingEvents &&
                    <div className={styles.eventsLoader}>
                        <ComponentLoader customLoaderColor="#fff" />
                    </div>
                }
                {
                    !isFetchingEvents && (eventsData && eventsData?.length == 0) &&
                    <div className={styles.noEvents}>
                        <br />
                        <br />
                        <p>No events found.</p>
                    </div>
                }
            </div>
        </section>
    );
}

export default EventsGroup;