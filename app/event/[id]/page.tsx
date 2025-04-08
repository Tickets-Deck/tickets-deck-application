import { FunctionComponent, ReactElement } from 'react';
import EventDetailsPage from './EventInfoPage';
import { EventResponse } from '@/app/models/IEvents';
import { useFetchEventById, useFetchEvents } from '@/app/api/apiClient';
import { Metadata, ResolvingMetadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

interface EventDetailsProps {
    params: { id: string }
}

type Props = {
    params: { id: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    // read route params
    const id = params.id

    const fetchEventInfo = useFetchEventById();

    // fetch data
    const event = await fetchEventInfo(id).then((response) => response.data as EventResponse);

    // optionally access and extend (rather than replace) parent metadata
    const previousImages = (await parent).openGraph?.images || []

    return {
        title: event.title,
        description: 'Come unlock your best experiences with Ticketsdeck Events!',
        openGraph: {
            images: [event.mainImageUrl, ...previousImages],
        },
    }
}


const EventDetails: FunctionComponent<EventDetailsProps> = async ({ params }) => {

    const session = await getServerSession(authOptions);

    return <EventDetailsPage
        id={params.id}
        session={session}
    />
}

export default EventDetails;