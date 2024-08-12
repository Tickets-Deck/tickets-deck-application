import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import "react-quill/dist/quill.snow.css";
import './styles/globals.scss'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
// import Layout from './components/Layout'
import dynamic from 'next/dynamic';
import GlobalProvider from './components/Provider';

const Layout = dynamic(() => import('./components/Layout'), { ssr: false })

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
            <html lang="en" data-theme={"dark"}>
                {/* <meta name="description" content="Elevating event experiences with next-level ticketing and management solutions." />

                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="image" content="https://res.cloudinary.com/doklhs4em/image/upload/v1711460397/External/bablo_meta_img.jpg" />

                <meta property="og:url" content="https://bablohomes.co.uk/" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Ticketsdeck Events | Unlocking best experiences, Easily." />
                <meta property="og:description" content="Elevating event experiences with next-level ticketing and management solutions." />
                <meta property="og:image" content="https://res.cloudinary.com/doklhs4em/image/upload/v1711460397/External/bablo_meta_img.jpg" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta property="twitter:domain" content="https://bablohomes.co.uk/" />
                <meta property="twitter:url" content="https://bablohomes.co.uk/" />
                <meta name="twitter:title" content="Ticketsdeck Events | Unlocking best experiences, Easily." />
                <meta name="twitter:description" content="Elevating event experiences with next-level ticketing and management solutions." />
                <meta name="twitter:image" content="https://res.cloudinary.com/doklhs4em/image/upload/v1711460397/External/bablo_meta_img.jpg" /> */}

                <body>
                    <Layout children={children} session={session} />
                </body>
            </html>
        </GlobalProvider>
    )
}
