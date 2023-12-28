"use client"
import React, { FunctionComponent, ReactElement, useCallback, useRef, useState, FormEvent, ChangeEvent, Dispatch, SetStateAction, useEffect } from "react";
import styles from '../../../styles/CreateEvent.module.scss';
import CreateEventProgressBar from "../../../components/shared/CreateEventProgressBar";
import { AddEventIcon, AddIcon, CalenderIcon, CloseIcon, PhotoIcon } from "@/app/components/SVGs/SVGicons";
import { DatePicker, ITimeRange } from "@fluentui/react";
import { categories } from "@/app/constants/eventCategories";
import { EventRequest } from "@/app/models/IEvents";
import useOuterClick from "@/app/hooks/useOuterClick";
import { EventVisibility } from "@/app/enums/IEventVisibility";
import BasicInformationForm from "@/app/components/Event/Create/BasicInformationForm";
import { ValidationStatus } from "@/app/enums/BasicInfoFormValidationStatus";
import Image from "next/image";
import images from "@/public/images";
import { EventCreationStage } from "@/app/enums/EventCreationStage";
import ImageUploadSection from "@/app/components/Event/Create/ImageUploadSection";
import { Tickets } from "@/app/models/ITicket";
import TicketDetailsSection from "@/app/components/Event/Create/TicketDetailsSection";

interface CreateEventProps {

}

const CreateEvent: FunctionComponent<CreateEventProps> = (): ReactElement => {

    const [eventCreationStage, setEventCreationStage] = useState<EventCreationStage>(EventCreationStage.BasicInfo);
    const [eventRequest, setEventRequest] = useState<EventRequest>();
    const [validationStage, setValidationStage] = useState<{ status: ValidationStatus }>();

    function proceedToImageUpload() {

        // Set the validation stage to running
        setValidationStage({ status: ValidationStatus.Running });

        // Set visibility to public if it is undefined
        if (!eventRequest?.visibility) {
            setEventRequest({ ...eventRequest as EventRequest, visibility: EventVisibility.PUBLIC });
        }

        // Update the event creation stage
        // setEventCreationStage(EventCreationStage.ImageUpload);

        console.log(eventRequest);
    };

    function moveToNextStage(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        switch (eventCreationStage) {
            case EventCreationStage.BasicInfo:
                proceedToImageUpload();
                break;
            case EventCreationStage.ImageUpload:
                setEventCreationStage(EventCreationStage.TicketDetails);
                break;
            case EventCreationStage.TicketDetails:
                setEventCreationStage(EventCreationStage.Confirmation);
                break;
            case EventCreationStage.Confirmation:
                setEventCreationStage(EventCreationStage.BasicInfo);
                break;
        }
    };

    // useEffect(() => {
    //     console.log(eventRequest);
    // }, [eventCreationStage]); 


    return (
        <div className={styles.main}>
            <div className={styles.topArea}>
                <h3>Create Event</h3>
                {/* <Link href="/app/event/create">
                    <button>New Event</button>
                </Link> */}
            </div>

            <CreateEventProgressBar
                eventCreationStage={eventCreationStage}
                setEventCreationStage={setEventCreationStage}
                eventRequest={eventRequest}
            />

            <form onSubmit={moveToNextStage}>
                {eventCreationStage === EventCreationStage.BasicInfo &&
                    <BasicInformationForm
                        eventRequest={eventRequest}
                        setEventRequest={setEventRequest}
                        validationStage={validationStage}
                        setValidationStage={setValidationStage}
                        setEventCreationStage={setEventCreationStage}
                    />}

                {eventCreationStage === EventCreationStage.ImageUpload &&
                    <ImageUploadSection
                        eventRequest={eventRequest}
                        setEventRequest={setEventRequest}
                    />}

                {eventCreationStage === EventCreationStage.TicketDetails &&
                    <TicketDetailsSection
                        eventRequest={eventRequest}
                        setEventRequest={setEventRequest}
                    />
                }

                {eventCreationStage === EventCreationStage.Confirmation &&
                    <div>Confirmation</div>
                }

                <div className={styles.actionButtons}>
                    <div className={styles.tagSection}>
                        {
                            eventRequest?.tags?.map((tag, index) => {
                                return (
                                    <span className={styles.tag} key={index}> 
                                        {tag}
                                        <span><CloseIcon /></span>
                                    </span>
                                )
                            })
                        }
                    </div>
                    <button type="submit">Next</button>
                </div>
            </form>
        </div>
    );
}

export default CreateEvent;