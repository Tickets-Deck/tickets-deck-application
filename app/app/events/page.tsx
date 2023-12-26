"use client"
import { FunctionComponent, ReactElement } from "react";
import styles from "../../styles/Events.module.scss";
import useResponsive from "../../hooks/useResponsiveness";
import { events } from "../../components/demoData/Events";
import EventsGroup from "../../components/events/EventsGroup";

interface AllEventsProps {

}

const AllEvents: FunctionComponent<AllEventsProps> = (): ReactElement => {

    
    const windowRes = useResponsive();
    const onMobile = windowRes.width && windowRes.width < 768;

    return (
        <div className={`${styles.allEventsPage} ${styles.allEventsPageConsole}`}>
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

            {/* <FeaturedEvents isNotHomepage /> */}

            <EventsGroup
                consoleDisplay
                eventsData={events}
                title="All Events"
                subText="Below is a list of all your events."
            />
        </div>
    );
}

export default AllEvents;