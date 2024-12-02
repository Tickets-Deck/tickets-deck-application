import React from 'react'

type Props = {
    params: { eventId: string }
}

export default function page({ params }: Props) {
    return (
        <div>Tickets page for Event - {params.eventId}</div>
    )
}