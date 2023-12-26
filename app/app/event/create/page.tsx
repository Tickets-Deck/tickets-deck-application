"use client"
import React, { FunctionComponent, ReactElement, useState } from "react";
import styles from '../../../styles/CreateEvent.module.scss';
import { EventRequest } from "../../../components/models/IEventRequest";
import CreateEventProgressBar from "../../../components/shared/CreateEventProgressBar";

interface CreateEventProps {

}

const CreateEvent: FunctionComponent<CreateEventProps> = (): ReactElement => {

    const [createEventRequest, setCreateEventRequest] = useState<EventRequest>();

    return (
        <div className={styles.main}>
            <div className={styles.topArea}>
                <h3>Create Event</h3>
                {/* <Link href="/app/event/create">
                    <button>New Event</button>
                </Link> */}
            </div>

            <CreateEventProgressBar />

            <div className={styles.formContainer}>
                <form>
                    <div className={styles.formField}>
                        <label htmlFor="title">Title</label>
                        <input type="text" name="title" id="title" placeholder="Event Title" />
                    </div>
                    <div className={styles.formField}>
                        <label htmlFor="description">Description</label>
                        <textarea name="description" id="description" placeholder="Event Description" />
                    </div>
                    <div className={styles.formField}>
                        <label htmlFor="venue">Location</label>
                        <input type="text" name="venue" id="venue" placeholder="Event Venue" />
                    </div>
                    <div className={styles.formRow}>
                        <div className={styles.formField}>
                            <label htmlFor="date">Date</label>
                            <input type="date" name="date" id="date" placeholder="Event Date" />
                        </div>
                        <div className={styles.formField}>
                            <label htmlFor="time">Time</label>
                            <input type="time" name="time" id="time" placeholder="Event Time" />
                        </div>
                    </div>
                    <div className={styles.formField}>
                        <label htmlFor="time">Category</label>
                        <input type="time" name="time" id="time" placeholder="Event Time" />
                    </div>
                    <div className={styles.formField}>
                        <label htmlFor="time">Tags</label>
                        <input type="time" name="time" id="time" placeholder="Event Time" />
                    </div>
                    <div className={styles.formField}>
                        <label htmlFor="time">Visibility</label>
                        <select name="visibility">
                            <option value="public">Public - Visible to everyone</option>
                            <option value="private">Private - Visible to only people that have the link</option>
                        </select>
                    </div>
                    <div className={styles.actionButtons}>
                        <button type="submit">Next</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateEvent;