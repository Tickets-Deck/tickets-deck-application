"use client"
import { ReactElement, FunctionComponent, useState, useEffect } from "react";
import styles from "@/app/styles/UserInformationPage.module.scss";
import { UserCredentialsResponse } from "@/app/models/IUser";
import { useFetchEventsByPublisherId } from "@/app/api/apiClient";
import { EventResponse } from "@/app/models/IEvents";
import { catchError } from "@/app/constants/catchError";
import EventCard from "../Event/EventCard";
import ComponentLoader from "../Loader/ComponentLoader";

interface UserHighlightsProps {
    userInformation: UserCredentialsResponse
}

const UserHighlights: FunctionComponent<UserHighlightsProps> = ({ userInformation }): ReactElement => {

    const fetchUserEventsByPublisherId = useFetchEventsByPublisherId();

    const [userEvents, setUserEvents] = useState<EventResponse[]>([]);
    const [isFetchingUserEvents, setIsFetchingUserEvents] = useState(true);

    async function handleFetchUserEventsByPublisherId() {

        await fetchUserEventsByPublisherId(userInformation.id)
            .then((response) => {
                // console.log(response.data);
                // Update the state
                setUserEvents(response.data);
            })
            .catch((error) => {
                // Log the error
                // console.log(error);
                catchError(error);
            })
            .finally(() => {
                // Close the loader indicator
                setIsFetchingUserEvents(false);
            })
    };

    useEffect(() => {
        if (userInformation) {
            handleFetchUserEventsByPublisherId();
        }
    }, [userInformation]);

    return (
        <div className={styles.userHighlights}>
            <h3>Recent Events</h3>
            <div className={styles.userEvents}>
                {
                    userEvents && userEvents.length > 0 && userEvents.map((event, index) =>
                        <EventCard
                            event={event}
                            // mobileAndActionButtonDismiss
                            key={index}
                            skipLikeStatusFetch
                            // gridDisplay={true}
                        />
                    )
                }
                {
                    isFetchingUserEvents &&
                    <div className={styles.loaderContainer}>
                        <ComponentLoader customLoaderColor="#111111" />
                    </div>
                }
            </div>
            {
                !isFetchingUserEvents && userEvents.length === 0 &&
                <div className={styles.noHighlightsContainer}>
                    <p>No events yet</p>
                </div>
            }
        </div>
    );
}

export default UserHighlights;