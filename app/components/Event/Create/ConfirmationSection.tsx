import { ReactElement, FunctionComponent, Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from '../../../styles/CreateEvent.module.scss';
import { EventRequest } from "../../../models/IEvents";


interface ConfirmationSectionProps {
    eventRequest: EventRequest | undefined
    setEventRequest: Dispatch<SetStateAction<EventRequest | undefined>>
}

const ConfirmationSection: FunctionComponent<ConfirmationSectionProps> = ({ eventRequest, setEventRequest }): ReactElement => {

    /**
     * Function to generate a random string
     * @param length is the length of the string to generate
     * @returns the generated string
     */
    function generateRandomString(length: number) {
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            result += charset.charAt(randomIndex);
        }
        return result;
    }

    function generateEventCode() {
        const timestamp = new Date().getTime().toString(36);
        const randomString = generateRandomString(6); // Adjust the length as needed
        // const eventCode = timestamp + randomString;
        const eventCode = randomString;
        return eventCode.toUpperCase();
    }

    const [uniqueEventCode, setUniqueEventCode] = useState<string>();

    useEffect(() => {
        if (uniqueEventCode) {
            setEventRequest({ ...eventRequest as EventRequest, eventId: uniqueEventCode });
        }
    }, [uniqueEventCode]);

    useEffect(() => {
        if (eventRequest?.eventId) {
            return;
        }
        setUniqueEventCode(generateEventCode());
    }, [eventRequest?.eventId])

    return (
        <div className={styles.confirmationSection}>
            <h3>Please review your event's information below.</h3>
            <div className={styles.eventInformation}>
                <span>Event ID: {eventRequest?.eventId}</span>
            </div>
        </div>
    );
}

export default ConfirmationSection;