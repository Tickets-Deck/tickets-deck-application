import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './styles/globals.scss'
import NextTopLoader from 'nextjs-toploader'
import Layout from './components/Layout'
import { Provider } from './components/Provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Tickets Deck',
    description: 'The website application for Tickets Deck',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
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
                <Provider>
                    <Layout children={children} />
                </Provider>
            </body>
        </html>
    )
}
