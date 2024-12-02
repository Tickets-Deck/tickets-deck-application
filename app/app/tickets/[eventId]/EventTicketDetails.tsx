import React from 'react'

type Props = {
    eventId: string
}

export default function EventTicketDetails({ eventId }: Props) {
    return (
        <div>Tickets page for Event - {eventId}</div>
    )
}