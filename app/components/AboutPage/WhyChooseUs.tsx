import { FunctionComponent, ReactElement } from "react";
import { motion } from "framer-motion";

interface WhyChooseUsProps {
}

const WhyChooseUs: FunctionComponent<WhyChooseUsProps> = (): ReactElement => {

    const services = [
        {
            title: "User Friendly Platform",
            description:
                "Our intuitive platform ensures a smooth and enjoyable booking experience, removing any barriers between attendees and their desired events.",
        },
        {
            title: "Dedicated Support",
            description:
                "Customer-focused service is at the heart of what we do. Our dedicated support team is always available to assist, ensuring that both organizers and attendees experience the highest level of satisfaction.",
        },
        {
            title: "Advanced Technology Integration",
            description:
                "We leverage cutting-edge technology to provide seamless event management solutions. Our platform is designed to simplify the planning process, allowing organizers to focus on creating unforgettable experiences.",
        },
        {
            title: "Personalized User Experience",
            description:
                "Leveraging big data and artificial intelligence, our system provides personalized recommendations and automated notifications, ensuring that attendees never miss out on the events that matter most to them.",
        },
        {
            title: "Comprehensive Management Tools",
            description:
                "From initial planning stages to post-event analysis, our suite of tools covers every detail. Ticket sales, event promotion, audience interaction, and data insights are seamlessly integrated, offering organizers a holistic solution to manage events effortlessly.",
        },
    ];

    return (
        <section className={"sectionPadding !py-10 md:!py-12 bg-dark-grey-2 text-white"}>
            <h2 className='w-fit mx-auto font-medium text-2xl'>Why Choose Us</h2>

            <motion.div
                className='grid grid-cols-none min-[350px]:[grid-template-columns:repeat(auto-fit,_minmax(300px,_1fr))] gap-6 mt-8'
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                viewport={{ once: true }}>
                {services.map((service, index) => {
                    return (
                        <motion.div
                            key={index}
                            className='flex flex-col items-center justify-center py-8 px-6 rounded-[20px] bg-dark-grey text-white transition-all duration-300 text-center hover:bg-primary-color hover:translate-y-[-5px]'
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.15 }}
                            viewport={{ once: true }}
                        >
                            <h3 className='text-base font-medium mb-2'>{service.title}</h3>
                            <p className='text-sm font-light leading-[24px] opacity-80'>
                                {service.description}
                            </p>
                        </motion.div>
                    );
                })}
            </motion.div>
        </section>
    );
};

export default WhyChooseUs;
