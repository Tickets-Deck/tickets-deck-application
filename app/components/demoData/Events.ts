import { useFetchEvents } from "@/app/api/apiClient";
import { EventResponse } from "@/app/models/IEvents";

const fetchEvents = useFetchEvents();
let retrievedEvents: EventResponse[] = [];

async function handleFetchEvents() {
    const { data } = await fetchEvents();
    retrievedEvents = data; 
}

export const events: EventResponse[] = retrievedEvents;