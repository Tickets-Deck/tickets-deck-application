"use client";
import { FunctionComponent, ReactElement } from "react";
import { Icons } from "../ui/icons";

interface ServicesProps { }

const Services: FunctionComponent<ServicesProps> = (): ReactElement => {

    const services = [
        {
            icon: Icons.Platform,
            title: "User Friendly Platform",
            subText:
                "We prioritize a swift and data-efficient experience for our users.",
        },
        {
            icon: Icons.QuickTicketBooking,
            title: "Quick Ticket Booking",
            subText: "Easily book tickets for your preferred events.",
        },
        {
            icon: Icons.CreateEvents,
            title: "Create / Publish Events",
            subText:
                "Create and publish events by entering the necessary information",
        },
        {
            icon: Icons.EasyManagement,
            title: "Easy Event Management",
            subText: "Easily manage events from anywhere on your dashboard.",
        },
        {
            icon: Icons.EfficientPayment,
            title: "Efficient Payment",
            subText: "Easily manage and track sales and commissions.",
        },
        {
            icon: Icons.TrackPerformance,
            title: "Track your Performance",
            subText:
                "We offer real-time reporting for tracking sales, and commissions.",
        },
    ];

    return (
        <section className='bg-dark-grey sectionPadding pt-8 mb-14'>
            <div className='flex flex-col items-center gap-2 mx-auto w-[80%] sm:w-[40%]'>
                <h2 className='relative text-[30px] font-Mona-Sans-Wide font-semibold flex items-center gap-0.5'>
                    Why Us?{" "}
                    {/* <span>
                        <Icons.ThinkingEmoji className='size-8' />
                    </span> */}
                </h2>
                <p className='text-sm w-fit text-center'>
                    Here is what you stand to gain when you work with us, amongst several other benefits.
                </p>
            </div>

            {/* <div className='mt-[4rem] gap-5 sm:gap-6 mb-[6rem] grid sm:[grid-template-columns:repeat(auto-fill,minmax(250px,1fr))] [grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));] mx-[0]'>
                {services.map((service, index) => (
                    <div
                        className={
                            `w-full min-w-[160px] sm:min-w-[250px] flex flex-col items-center text-center py-8 px-6 gap-4 rounded-3xl bg-[linear-gradient(180deg,_rgba(255,255,255,0.1)_0%,_rgba(255,255,255,0)_100%)] ${appTheme == Theme.Light
                                ? "bg-[linear-gradient(180deg,_#0000001a_0%,_#00000000_100%)] [&_span]:bg-black/20"
                                : ""
                            }`
                        }
                        key={index}
                    >
                        <span className='size-[100px] sm:size-[90px] rounded-[300px] bg-white/20 grid place-items-center'>
                            <service.icon className='size-[40px] sm:size-[36px]' />
                        </span>
                        <div className={"flex flex-col items-center gap-1"}>
                            <h2 className='text-[20px] font-medium text-center w-[95%] sm:w-[70%]'>
                                {service.title}
                            </h2>
                            <p className='text-sm font-light text-primary-color-sub-50 opacity-[0.65]'>
                                {service.subText}
                            </p>
                        </div>
                    </div>
                ))}
            </div> */}

            <div className="mt-[4rem] grid sm:grid-cols-2 md:grid-cols-3 gap-8">
                {services.map((service, index) => (
                    <div
                        key={index}
                        className="bg-gray-900/50 border-[1px] border-primary-color-sub/30 hover:border-purple-500/50 hover:-translate-y-2 transition-all duration-300 rounded-2xl p-5">
                        <div className="pb-2">
                            <div className="w-12 h-12 rounded-full bg-purple-900/50 flex items-center justify-center mb-4">
                                <service.icon width={24} height={24} />
                            </div>
                            <h3 className="text-xl font-medium">{service.title}</h3>
                        </div>
                        <div>
                            <p className="text-grey opacity-80">{service.subText}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Services;
