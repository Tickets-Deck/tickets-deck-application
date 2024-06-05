import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './styles/globals.scss'
import NextTopLoader from 'nextjs-toploader'
import Layout from './components/Layout'
import { GlobalProvider } from './components/Provider'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Ticketsdeck Events',
    description: 'Unlocking best experiences, easily.'
}

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {

    const session = await getServerSession(authOptions);

    return (
        <GlobalProvider>
            <Layout children={children} session={session} />
        </GlobalProvider>
    )
}
