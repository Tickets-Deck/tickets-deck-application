import React from 'react'
import EventTicketDetails from './EventTicketDetails'

type Props = {
    params: { eventId: string }
}

export default function page({ params }: Props) {
    return (
        <EventTicketDetails
            eventId={params.eventId}
        />
    )
}