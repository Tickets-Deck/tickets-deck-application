import { ReactElement, FunctionComponent, Dispatch, SetStateAction } from "react";
import styles from "../../styles/CreateEventProgressBar.module.scss"
import { EventCreationStage } from "@/app/enums/EventCreationStage";
import { EventRequest } from "@/app/models/IEvents";

interface CreateEventProgressBarProps {
    eventCreationStage: EventCreationStage
    setEventCreationStage: Dispatch<SetStateAction<EventCreationStage>>
    eventRequest: EventRequest | undefined
    disableAllTabs: boolean
}

const CreateEventProgressBar: FunctionComponent<CreateEventProgressBarProps> = (
    { eventCreationStage, setEventCreationStage, eventRequest, disableAllTabs }): ReactElement => {

    const imageUploadIsUndone = eventCreationStage === EventCreationStage.BasicInfo && !eventRequest?.mainImageBase64Url;
    const ticketDetailsIsUndone = eventCreationStage < EventCreationStage.TicketDetails && !eventRequest?.tickets;
    const reviewAndPublishIsUndone = eventCreationStage < EventCreationStage.Confirmation && !eventRequest?.tickets;

    const basicInfoIsCurrent = eventCreationStage === EventCreationStage.BasicInfo;
    const imageUploadIsCurrent = eventCreationStage === EventCreationStage.ImageUpload || eventRequest?.images;
    const ticketDetailsIsCurrent = eventCreationStage === EventCreationStage.TicketDetails || eventRequest?.tickets;
    const reviewAndPublishIsCurrent = eventCreationStage === EventCreationStage.Confirmation || eventRequest?.tickets;

    const basicInfoIsDone = eventCreationStage > EventCreationStage.BasicInfo;
    const imageUploadIsDone = eventCreationStage > EventCreationStage.ImageUpload;
    const ticketDetailsIsDone = eventCreationStage > EventCreationStage.TicketDetails;
    const reviewAndPublishIsDone = eventCreationStage > EventCreationStage.Confirmation;

    return (
        <div className={styles.progressBarContainer}>
            <span className={styles.indicator}></span>
            <div
                style={disableAllTabs ? { pointerEvents: 'none' } : {}}
                className={`${styles.stage} ${basicInfoIsCurrent ? styles.currentStage : ""} ${basicInfoIsDone ? styles.doneStage : ""} `}
                onClick={() => setEventCreationStage(EventCreationStage.BasicInfo)}>
                <span className={styles.stageNumber}>1</span>
                <p className={styles.stageTitle}>Event Details</p>
            </div>
            <div 
                style={disableAllTabs ? { pointerEvents: 'none' } : {}}
                className={`${styles.stage} ${imageUploadIsCurrent ? styles.currentStage : ''} ${imageUploadIsDone ? styles.doneStage : ''} ${imageUploadIsUndone ? styles.unDoneStage : ''} `}
                onClick={() => setEventCreationStage(EventCreationStage.ImageUpload)}>
                <span className={styles.stageNumber}>2</span>
                <p className={styles.stageTitle}>Image Upload</p>
            </div>
            <div
                style={disableAllTabs ? { pointerEvents: 'none' } : {}}
                className={`${styles.stage} ${ticketDetailsIsCurrent ? styles.currentStage : ''} ${ticketDetailsIsDone ? styles.doneStage : ''} ${ticketDetailsIsUndone ? styles.unDoneStage : ''} `}
                onClick={() => setEventCreationStage(EventCreationStage.TicketDetails)}>
                <span className={styles.stageNumber}>3</span>
                <p className={styles.stageTitle}>Ticket Details</p>
            </div>
            <div
                style={disableAllTabs ? { pointerEvents: 'none' } : {}}
                className={`${styles.stage} ${reviewAndPublishIsCurrent ? styles.currentStage : ''} ${reviewAndPublishIsDone ? styles.doneStage : ''} ${reviewAndPublishIsUndone ? styles.unDoneStage : ''} `}
                onClick={() => setEventCreationStage(EventCreationStage.Confirmation)}>
                <span className={styles.stageNumber}>4</span>
                <p className={styles.stageTitle}>Review & Publish</p>
            </div>
        </div>
    );
}

export default CreateEventProgressBar;