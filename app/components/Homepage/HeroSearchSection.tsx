import { ChangeEvent, FunctionComponent, ReactElement, useEffect, useRef, useState } from "react";
import styles from '../../styles/Home.module.scss';
import useOuterClick from "@/app/hooks/useOuterClick";
import { EventResponse } from "@/app/models/IEvents";
import Link from "next/link";
import moment from "moment";
import { InfoIcon } from "../SVGs/SVGicons";
import { scrollWindow } from "../PageScroll/ScrollWindow";
import Image from "next/image";
import images from "@/public/images";
import useResponsiveness from "@/app/hooks/useResponsiveness";

interface HeroSearchSectionProps {
    events: EventResponse[]
    isFetchingEvents: boolean
}

const HeroSearchSection: FunctionComponent<HeroSearchSectionProps> = ({ events: _events, isFetchingEvents }): ReactElement => {

    const events = _events.filter(event => new Date(event.date) >= new Date());

    const windowRes = useResponsiveness();
    const isMobile = windowRes.width && windowRes.width < 768;
    const onMobile = typeof (isMobile) == "boolean" && isMobile;
    const onDesktop = typeof (isMobile) == "boolean" && !isMobile;

    const [eventName, setEventName] = useState<string>();
    const [eventNameErrorMsg, setEventNameErrorMsg] = useState(false);
    const [searchResults, setSearchResults] = useState<EventResponse[]>();
    const [searchResultsIsVisible, setSearchResultsIsVisible] = useState(false);

    const inputAreaContainerRef = useRef<HTMLDivElement>(null);

    async function handleEventSearch(e: ChangeEvent<HTMLInputElement>) {

        if (!searchResults || !eventName) {
            setSearchResultsIsVisible(false);
            return;
        }
        // if (!eventName) {
        //     setSearchResultsIsVisible(false);
        //     return;
        // }
        if (e.target.value.length == 0) {
            setSearchResults(undefined);
            setSearchResultsIsVisible(false);
            return;
        }

        setSearchResultsIsVisible(true);
        setSearchResults(events.filter(event => event.title.toLowerCase().includes(eventName.toLowerCase())));
    };

    useEffect(() => {
        if (eventName) {
            setSearchResults(events.filter((event) => event.title.toLowerCase().includes(eventName.toLowerCase())));
        }
    }, [eventName]);

    useEffect(() => {
        if (!searchResultsIsVisible) {
            setSearchResults(undefined);
            setEventName('');
        }
    }, [searchResultsIsVisible]);

    useOuterClick(inputAreaContainerRef, setSearchResultsIsVisible);

    return (
        <form className={styles.searchContainer}>
            <div className={styles.textContents}>
                <p><span>Catch the train,</span> before those tickets get sold out.</p>
                <p>You can quickly <span>search</span> for an event here.</p>
            </div>
            <div className={styles.inputAreaContainer} ref={inputAreaContainerRef}>
                <div className={styles.inputArea}>
                    <input
                        type="text"
                        value={eventName}
                        placeholder='Event name'
                        onClick={() => onMobile && scrollWindow(160)}
                        onChange={(e) => {
                            if (e.target.value.length == 1) {
                                setEventName(e.target.value);
                                setSearchResultsIsVisible(true);
                                return;
                            }
                            setEventName(e.target.value);
                            handleEventSearch(e);
                        }} />
                    {eventNameErrorMsg && <div className={styles.searchErrorMsg}><InfoIcon /> <p>Please type the name of the event</p></div>}
                </div>
                {
                    searchResultsIsVisible &&
                    <div className={styles.resultsDropdown}>
                        {searchResults?.map((event, index) =>
                            <Link href={`/event/${event.id}`} onClick={() => setSearchResultsIsVisible(false)}>
                                <div className={styles.eachResult} key={index}>
                                    <div className={styles.eachResult__top}>
                                        <h4>{event.title}</h4>
                                        <h4>{moment(event?.date).format("MMM. Do YYYY")}</h4>
                                    </div>
                                    {/* <p>Starting price: &#8358;{event.ticketPrice.amount.toLocaleString()}</p> */}
                                </div>
                            </Link>
                        )}
                        {searchResults?.length == 0 &&
                            <div className={styles.resultNotFound}>
                                <span>
                                    <Image src={images.sad_face} alt='Sad face emoji' width={36} height={36} />
                                </span>
                                <p>There are no events based on your search keyword</p>
                            </div>
                        }
                    </div>
                }
            </div>
            {/* <button type="submit" style={isLoading ? { opacity: 0.6, pointerEvents: 'none' } : {}} disabled={isLoading}>
                        {
                            isLoading ?
                                <span style={{ width: '16px', height: '16px', position: 'relative', scale: '2.2' }}><ComponentLoader /></span>
                                :
                                <span>Let's search</span>
                        }
                    </button> */}
        </form>
    );
}

export default HeroSearchSection;