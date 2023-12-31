import { FunctionComponent, ReactElement } from "react";
import { HorizontalLineIcon, LikeIcon, LocationPinIcon, ShareIcon } from "../SVGs/SVGicons";
import Image from "next/image";
import images from "../../../public/images";
import styles from '../../styles/EventGroupSection.module.scss';
import useResponsive from "../../hooks/useResponsiveness";
import EventCard from "../Event/EventCard";
import { useRouter } from "next/navigation";
import { EventResponse } from "@/app/models/IEvents";

interface EventsGroupProps {
    title: string
    subText: string
    eventsData: EventResponse[]
    consoleDisplay?: boolean
}

const EventsGroup: FunctionComponent<EventsGroupProps> = (
    { title, subText, eventsData, consoleDisplay }): ReactElement => {

    
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
                    {eventsData.map((event, index) =>
                        <EventCard
                            event={event}
                            mobileAndActionButtonDismiss
                            key={index}
                            consoleDisplay={consoleDisplay}
                        />
                    )}
                </div>
            </div>
        </section>
    );
}

export default EventsGroup;