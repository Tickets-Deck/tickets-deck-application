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
    title: 'Events@Ticketsdeck',
    description: 'Unlocking best experiences, easily.'
}

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {

    const session = await getServerSession(authOptions);

    return (
        <html lang="en">
            <body className={inter.className}>
                <NextTopLoader
                    color="#5419a7"
                    initialPosition={0.08}
                    crawlSpeed={200}
                    height={3}
                    crawl={true}
                    showSpinner={true}
                    easing="ease"
                    speed={200}
                    shadow="0 0 10px #d39efa,0 0 5px #5116a2"
                />
                <GlobalProvider>
                    <Layout children={children} session={session} />
                </GlobalProvider>
            </body>
        </html>
    )
}
