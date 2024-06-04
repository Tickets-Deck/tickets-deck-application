import { FunctionComponent, ReactElement } from "react";
import styles from "@/app/styles/About.module.scss";

interface WhyChooseUsProps {

}

const WhyChooseUs: FunctionComponent<WhyChooseUsProps> = (): ReactElement => {

    const services = [
        {
            title: "User Friendly Platform",
            description: "Our intuitive platform ensures a smooth and enjoyable booking experience, removing any barriers between attendees and their desired events."
        },
        {
            title: "Dedicated Support",
            description: "Customer-focused service is at the heart of what we do. Our dedicated support team is always available to assist, ensuring that both organizers and attendees experience the highest level of satisfaction."
        },
        {
            title: "Advanced Technology Integration",
            description: "We leverage cutting-edge technology to provide seamless event management solutions. Our platform is designed to simplify the planning process, allowing organizers to focus on creating unforgettable experiences."
        },
        {
            title: "Personalized User Experience",
            description: "Leveraging big data and artificial intelligence, our system provides personalized recommendations and automated notifications, ensuring that attendees never miss out on the events that matter most to them."
        },
        {
            title: "Comprehensive Management Tools",
            description: "From initial planning stages to post-event analysis, our suite of tools covers every detail. Ticket sales, event promotion, audience interaction, and data insights are seamlessly integrated, offering organizers a holistic solution to manage events effortlessly."
        }
    ]
    
    return (
        <section className={styles.whyChooseUs}>
            <h2>Why Choose Us</h2>

            <div className={styles.services}>
                {
                    services.map((service, index) => {
                        return (
                            <div key={index} className={styles.service}>
                                <h3>{service.title}</h3>
                                <p>{service.description}</p>
                            </div>
                        )
                    })
                }
            </div>
        </section>
    );
}

export default WhyChooseUs;