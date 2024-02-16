"use client"
import { FunctionComponent, ReactElement } from 'react';
import EventDetailsPage from './EventInfoPage';
import { EventResponse } from '@/app/models/IEvents';
import { useFetchEvents } from '@/app/api/apiClient';

interface EventDetailsProps {
    params: { id: string }
}


const EventDetails: FunctionComponent<EventDetailsProps> = ({ params }): ReactElement => {

    return <EventDetailsPage
        params={params}
    />
}

export default EventDetails;