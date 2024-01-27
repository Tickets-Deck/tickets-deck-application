import { FunctionComponent, ReactElement, Dispatch, SetStateAction } from "react";
import { HorizontalLineIcon, LikeIcon, LocationPinIcon, ShareIcon } from "../SVGs/SVGicons";
import Image from "next/image";
import images from "../../../public/images";
import styles from '../../styles/EventGroupSection.module.scss';
import useResponsive from "../../hooks/useResponsiveness";
import EventCard from "../Event/EventCard";
import { useRouter } from "next/navigation";
import { EventResponse } from "@/app/models/IEvents";
import ComponentLoader from "../Loader/ComponentLoader";

interface EventsGroupProps {
    title: string
    subText: string
    eventsData: EventResponse[] | undefined
    consoleDisplay?: boolean
    isFetchingEvents?: boolean
    setIsDeleteConfirmationModalVisible?: Dispatch<SetStateAction<boolean>>
    setSelectedEvent?: Dispatch<SetStateAction<EventResponse | undefined>>
}

const EventsGroup: FunctionComponent<EventsGroupProps> = (
    { title, subText, eventsData, consoleDisplay, isFetchingEvents, 
        setIsDeleteConfirmationModalVisible, setSelectedEvent }): ReactElement => {

 
    const windowRes = useResponsive();
    const onMobile = windowRes.width && windowRes.width < 768;
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
                            <button onClick={() => { push('/app/event/create') }}>Create event</button> :
                            <button>Filter</button>
                    }
                </div>
            </div>
            <div className={styles.eventsContainer}>
                <div className={styles.eventsContainerCarousel}>
                    {
                        !isFetchingEvents && eventsData?.map((event, index) =>
                            <EventCard
                                event={event}
                                mobileAndActionButtonDismiss
                                key={index}
                                consoleDisplay={consoleDisplay}
                                setIsDeleteConfirmationModalVisible={setIsDeleteConfirmationModalVisible}
                                setSelectedEvent={setSelectedEvent}
                            />
                        )
                    }
                </div>
                {
                    isFetchingEvents &&
                    <>
                        <br />
                        <br />
                        <br />
                        <ComponentLoader customLoaderColor="#fff" />
                    </>
                }
                {
                    !isFetchingEvents && (!eventsData || eventsData?.length == 0) &&
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