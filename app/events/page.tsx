"use client";
import { FunctionComponent, ReactElement } from "react";
import styles from "../styles/Events.module.scss";
import FeaturedEvents from "../components/Homepage/FeaturedEvents";
import useResponsive from "../hooks/useResponsiveness";
import { events } from "../components/demoData/Events";
import EventsGroup from "../components/events/EventsGroup";

interface AllEventsProps {

}

const AllEvents: FunctionComponent<AllEventsProps> = (): ReactElement => {

    
    const windowRes = useResponsive();
    const onMobile = windowRes.width && windowRes.width < 768;

    return (
        <div className={styles.allEventsPage}>
            <section className={styles.heroSection}>
                <div className={styles.video}>
                    <video
                        autoPlay
                        loop
                        muted
                        src="https://res.cloudinary.com/dxwpajciu/video/upload/v1691936875/ticketwave/videos/people_waving_p9tni6.mp4" />
                </div>
                <div className={styles.textContents}>
                    <h2>Escape the Ordinary: <br /><span>Dive into Event Paradise!</span></h2>
                    <p>Embark on a journey through events that'll transport you to a world of excitement and wonder. <span>Ready to be amazed?</span> 🚀</p>
                </div>
            </section>

            <FeaturedEvents isNotHomepage />

            {/* <section className={styles.allEvents}>
                <div className={styles.topArea}>
                    <div className={styles.topArea__lhs}>
                        <div className={styles.main}>
                            <span>All Events</span>
                            <Image src={images.rocket} alt='Rocket' />
                        </div>
                        <p>Dear superstar, below is a list of all events available at the moment.</p>
                    </div>
                    <div className={styles.topArea__rhs}>
                        <button>Filter</button>
                    </div>
                </div>
                <div className={styles.eventsContainer}>
                    <div className={styles.eventsContainerCarousel}>
                        {events.map((event, index) =>
                            <div className={styles.event}>
                                <div className={styles.backgroundImage}>
                                    <Image src={images.ticketbg} alt='Ticket background' />
                                </div>
                                <span className={styles.event__tag}>Latest</span>
                                <div className={styles.event__image}>
                                    <Image src={images.event_flyer} alt='Event flyer' />
                                </div>
                                <span className={styles.hLine}>
                                    <HorizontalLineIcon />
                                </span>
                                <div className={styles.eventInfo}>
                                    <div className={styles.eventInfo__lhs}>
                                        <h3 className={styles.title}>Summer Curriculum</h3>
                                        <div className={styles.dateTime}>
                                            <span className={styles.dateTime__date}>Jan 20</span>
                                            <span className={styles.dateTime__dot}></span>
                                            <span className={styles.dateTime__time}>8:00PM</span>
                                        </div>
                                        <div className={styles.location}>
                                            <LocationPinIcon />
                                            <p>House 44A Lasisi, OgunlanaOgunlana</p>
                                        </div>
                                    </div>
                                    {!onMobile &&<div className={styles.eventInfo__rhs}>                                        
                                        <div className={styles.actions}>
                                            <button className={styles.actions__like}><LikeIcon /></button>
                                            <button className={styles.actions__share}><ShareIcon /></button>
                                        </div>
                                        <p className={styles.restriction}>Everyone</p>
                                    </div>}
                                </div>
                                <button>View details</button>
                            </div>)}
                    </div>
                </div>
            </section> */}
            <EventsGroup eventsData={events} title="All Events" subText="Dear superstar, below is a list of all events available at the moment." />
        </div>
    );
}

export default AllEvents;