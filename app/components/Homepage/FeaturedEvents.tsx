"use client"

import { FunctionComponent, ReactElement, useContext, useEffect, useState } from 'react';
import styles from '../../styles/FeaturedEvents.module.scss';
import Image from 'next/image';
import images from '../../../public/images';
import { CaretLeftIcon, CaretRightIcon } from '../SVGs/SVGicons';
import Link from 'next/link';
import Tooltip from '../custom/Tooltip';
import { ToastContext } from '../../extensions/toast';
import EventCard from '../Event/EventCard';
import { useFetchEvents } from '@/app/api/apiClient';
import { EventResponse } from '@/app/models/IEvents';
import ComponentLoader from '../Loader/ComponentLoader';
import useResponsiveness from '../../hooks/useResponsiveness';

interface FeaturedEventsProps {
    isNotHomepage?: boolean
    events: EventResponse[]
    isFetchingEvents: boolean
}

const FeaturedEvents: FunctionComponent<FeaturedEventsProps> = ({ isNotHomepage, events, isFetchingEvents }): ReactElement => {

    const toasthandler = useContext(ToastContext);
    // const [events, setEvents] = useState<EventResponse[]>([]);
    // const [isFetchingEvents, setIsFetchingEvents] = useState(true);

    const windowRes = useResponsiveness();
    const isMobile = windowRes.width && windowRes.width < 768;
    const onMobile = typeof (isMobile) == "boolean" && isMobile;
    const onDesktop = typeof (isMobile) == "boolean" && !isMobile;

    function shareEvent(eventInfo: EventResponse) {
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
            toasthandler?.logSuccess('Event link copied.', `The link to ${eventInfo.title} has been copied.`)
        } catch (error) {
            console.error("Copying to clipboard failed:", error);
        }
    };
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
    };

    return (
        <section className={styles.featuredEvents}>
            <div className={styles.topArea}>
                <div className={styles.topArea__lhs}>
                    <div className={styles.main}>
                        <span>Featured Events</span>
                        <Image src={images.rocket} alt='Rocket' />
                    </div>
                    <p>Based on the superstar that you are, we have carefully gathered top events for you. </p>
                </div>
                <div className={styles.topArea__rhs}>
                    {!isNotHomepage &&
                        <Link href='/events'>
                            <button>See all events</button>
                        </Link>}
                    {isNotHomepage &&
                        <Tooltip tooltipText='More Info'>
                            <button className={styles.moreInfoButton}>
                                <svg width="12" height="17" viewBox="0 0 12 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5.09071 12.4729V12.1915C5.09071 11.6719 5.19175 11.21 5.39382 10.8058C5.61033 10.4017 5.87736 10.0264 6.1949 9.67997C6.52688 9.33356 6.88051 8.99436 7.2558 8.66238C7.63108 8.3304 7.97749 7.98399 8.29504 7.62314C8.62702 7.26229 8.89405 6.86536 9.09612 6.43234C9.31263 5.99932 9.42088 5.50857 9.42088 4.96008C9.42088 4.32499 9.27654 3.79815 8.98787 3.37957C8.71362 2.94655 8.32391 2.62179 7.81872 2.40528C7.31353 2.17433 6.70731 2.05886 6.00004 2.05886C4.90307 2.05886 4.04425 2.32589 3.42359 2.85995C2.80293 3.394 2.46373 4.10126 2.406 4.98173H0.565674C0.62341 4.02909 0.88322 3.22079 1.34511 2.55683C1.82142 1.87844 2.46373 1.36603 3.27203 1.01962C4.09477 0.673207 5.04019 0.5 6.1083 0.5C6.94547 0.5 7.68881 0.601037 8.33834 0.803112C9.0023 1.00519 9.55801 1.30108 10.0055 1.6908C10.4673 2.06608 10.821 2.52075 11.0664 3.0548C11.3117 3.57442 11.4344 4.16622 11.4344 4.83018C11.4344 5.49414 11.3189 6.08593 11.088 6.60555C10.8715 7.12517 10.59 7.59427 10.2436 8.01286C9.8972 8.41701 9.52914 8.79229 9.13942 9.1387C8.76414 9.48512 8.40329 9.82431 8.05688 10.1563C7.71046 10.4738 7.42179 10.8058 7.19084 11.1522C6.97433 11.4842 6.86608 11.8523 6.86608 12.2564V12.4729H5.09071ZM5.02575 16.5V14.4865H6.97433V16.5H5.02575Z" fill="#ADADBC" />
                                </svg>
                            </button>
                        </Tooltip>
                    }
                </div>
            </div>
            <div className={styles.eventsContainer}>
                {
                    !isFetchingEvents && events.length > 0 &&
                    <div className={styles.eventsContainerCarousel}>
                        {
                            events.slice(0, 3).map((event, index) =>
                                <EventCard event={event} key={index} />
                            )
                        }
                    </div>
                }
                {
                    isFetchingEvents &&
                    <>
                        <br />
                        <br />
                        <ComponentLoader customLoaderColor="#fff" />
                    </>
                }
                {
                    !isFetchingEvents && events.length == 0 &&
                    <div className={styles.noEvents}>
                        <br />
                        <br />
                        <p>No events found.</p>
                    </div>
                }
            </div>

            {!isNotHomepage &&
                <Link href="/events">
                    See all events
                </Link>
            }
            {/* {
                events.length > 3 &&
                <>
                    <span className={styles.controller}><CaretLeftIcon /></span>
                    <span className={styles.controller}><CaretRightIcon /></span>
                </>
            } */}
        </section>
    );
}

export default FeaturedEvents;