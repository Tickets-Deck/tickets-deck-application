"use client"
import { ReactElement, FunctionComponent, useEffect } from "react";
import styles from "@/app/styles/OrdersPage.module.scss";
import { ArrowLeftIcon, DownloadIcon } from "../components/SVGs/SVGicons";
import EventMainInfo from "../components/Event/EventInfo";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { EventResponse } from "../models/IEvents";

interface OrdersPageProps {

}

const OrdersPage: FunctionComponent<OrdersPageProps> = (): ReactElement => {

    const { data: session, status } = useSession();
    const router = useRouter();

    const eventInfo: EventResponse = {
        id: "3a96fa65-380b-4d83-bfcf-ce3fbd1d267c",
        eventId: "UNP68K",
        publisherId: "b8d9774c-d9e6-4f21-bdac-bc18bd09df39",
        title: "Food Fest 2.0",
        description: "This is a description of food fest 2.0 now",
        locationId: null,
        venue: "7, Jumbo street, beside chrisland school",
        date: "2024-03-23T23:00:00.000Z",
        time: "8pm",
        category: "Food Festivals",
        visibility: "PUBLIC",
        mainImageUrl:
            "https://res.cloudinary.com/dvxqk1487/image/upload/v1710199089/event_images/bjejgsdsyvj9n9wiq9vz.jpg",
        currency: "NGN",
        purchaseStartDate: "2024-03-14T23:00:00.000Z",
        purchaseEndDate: "2024-03-19T23:00:00.000Z",
        allowedGuestType: "Everyone",
        bookmarksCount: 0,
        favoritesCount: 0,
        bookmarks: [],
        favorites: [],
        ticketsPurchasedCount: 1,
        ticketsPurchased: [],
        createdAt: "2024-03-11T23:18:09.065Z",
        updatedAt: "2024-03-11T23:25:09.126Z",
        user: {
            id: "b8d9774c-d9e6-4f21-bdac-bc18bd09df39",
            email: "simlexafol@gmail.com",
            //   emailVerified: false,
            firstName: "Similoluwa",
            lastName: "Afolabi",
            username: "",
            profilePhoto:
                "https://lh3.googleusercontent.com/a/ACg8ocKi5I4HXVCPgUCE1yMxl4NPci6RYaRFSVtHwyyHIefNlMU=s96-c",
            events: [],
            bookmarks: [],
            favorites: [],
            ticketsPurchased: [],
            profilePhotoId: "",
            coverPhoto: "",
            coverPhotoId: "",
            phone: "",
            password: "google-signup-no-password",
            occupation: "",
            bio: "",
            facebookUrl: "",
            twitterUrl: "",
            instagramUrl: "",
            linkedinUrl: "",
            followersCount: 0,
            followingCount: 0,
            eventsCount: 2,
            bookmarksCount: 0,
            favoritesCount: 0,
            isVerified: false,
            isBlocked: false,
            isSuspended: false,
            isDeleted: false,
            isSuperAdmin: false,
            isSubscribed: false,
            isNewsletterSubscribed: false,
            ticketsBought: 1,
            ticketsSold: 2,
            totalRevenue: 10400,
            createdAt: new Date("2024-03-11T06:59:26.888Z"),
            updatedAt: new Date("2024-03-12T14:36:40.833Z"),
        },
        tickets: [
            {
                id: "118f85b2-5c04-4e75-84f1-7cf87d634b45",
                eventId: "3a96fa65-380b-4d83-bfcf-ce3fbd1d267c",
                name: "Regular",
                price: 2400,
                quantity: 20,
                remainingTickets: 19,
                numberOfUsers: 1,
                description: "",
                ticketsPurchased: [],
                ticketsPurchasedCount: 1,
                createdAt: "2024-03-11T23:18:09.065Z",
                updatedAt: "2024-03-11T23:25:09.161Z",
            },
            {
                id: "808a5b20-f5bb-40dc-93b2-b30883440c17",
                eventId: "3a96fa65-380b-4d83-bfcf-ce3fbd1d267c",
                name: "Duo Pack",
                price: 3500,
                quantity: 35,
                remainingTickets: 34,
                numberOfUsers: 2,
                description: "",
                ticketsPurchased: [],
                ticketsPurchasedCount: 1,
                createdAt: "2024-03-11T23:18:09.065Z",
                updatedAt: "2024-03-11T23:25:09.161Z",
            },
        ],
        images: [],
        tags: ["Food", "Fest"],
        location: null,
    };

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin');
        }
    }, [status])

    return (
        <main className={styles.orderspage}>
            <div className={styles.topArea}>
                {/* <span className={styles.closeIcon}><ArrowLeftIcon /></span> */}
                <h2>Order <span>#734RUD</span> on Mar 10, 2024</h2>
            </div>
            <div className={styles.orderInformationContainer}>
                <div className={styles.eventContainer}>
                    <EventMainInfo
                        eventInfo={eventInfo}
                        forOrdersPage
                    />
                </div>
                <div className={styles.ticketsContainer}>
                    <div className={styles.tickets}>
                        <div className={styles.ticket}>
                            <h3>Regular</h3>
                            <p>simlexafol@gmail.com</p>
                            <button><DownloadIcon /></button>
                        </div>
                        <div className={styles.ticket}>
                            <h3>Regular</h3>
                            <p>simlexafol@gmail.com</p>
                            <button><DownloadIcon /></button>
                        </div>
                    </div>
                    {/* <div className={styles.actions}>
                        <button>Cancel order</button>
                        <button>Resend tickets to email</button>
                    </div> */}
                </div>
            </div>
        </main>
    );
}

export default OrdersPage;