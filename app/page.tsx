import { Metadata } from 'next'
import Homepage from './Homepage'

export const metadata: Metadata = {
    title: 'Homepage | Ticketsdeck Events',
    description: 'Unlocking best experiences, easily.'
}

export default function Home() {
    return (
        <Homepage />
    )
}