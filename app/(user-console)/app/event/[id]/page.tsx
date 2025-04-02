import React from 'react'
import PublisherEventInformation from './PublisherEventInformation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

type Props = {
    params: { id: string };
}

export default async function page({ params }: Props) {
    
    const session = await getServerSession(authOptions);

    return (
        <PublisherEventInformation
            id={params.id}
            session={session}
        />
    )
}