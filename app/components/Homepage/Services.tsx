"use client"
import { FunctionComponent, ReactElement, useEffect } from 'react';
import styles from '../../styles/Home.module.scss';
import { CreateEventsIcon, EasyManagementIcon, EfficientPaymentIcon, PlatformIcon, QuickTicketBookingIcon, ThinkingEmojiIcon, TrackPerformanceIcon } from '../SVGs/SVGicons';

interface ServicesProps {

}

const Services: FunctionComponent<ServicesProps> = (): ReactElement => {

    const services = [
        {
            icon: <PlatformIcon />,
            title: 'User Friendly Platform',
            subText: 'We prioritize a swift and data-efficient experience for our users.',
        },
        {
            icon: <QuickTicketBookingIcon />,
            title: 'Quick Ticket Booking',
            subText: 'Easily book tickets for your preferred events.',
        },
        {
            icon: <CreateEventsIcon />,
            title: 'Create / Publish Events',
            subText: 'Create and publish events by entering the necessary information',
        },
        {
            icon: <EasyManagementIcon />,
            title: 'Easy Event Management',
            subText: 'Easily manage events from anywhere on your dashboard.',
        },
        {
            icon: <EfficientPaymentIcon />,
            title: 'Efficient Payment',
            subText: 'Easily manage and track sales and commissions.',
        },
        {
            icon: <TrackPerformanceIcon />,
            title: 'Track your Performance',
            subText: 'We offer real-time reporting for tracking sales, and commissions.',
        },
    ];

    return (
        <section className={styles.servicesSection}>
            <div className={styles.topArea}>
                <h2>Why Us? <span><ThinkingEmojiIcon /></span></h2>
                <p>We know you trust us, but just so you are wondering why you should keep using our service... 👀</p>
            </div>
            <div className={styles.servicesContainer}>
                {services.map((service, index) =>
                    <div className={styles.service} key={index}>
                        <span>{service.icon}</span>
                        <div className={styles.service__textContents}>
                            <h2>{service.title}</h2>
                            <p>{service.subText}</p>
                        </div>
                    </div>)}
            </div>
        </section>
    );
}

export default Services;