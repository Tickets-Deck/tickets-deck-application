"use client";
import { FunctionComponent, ReactElement, useEffect } from "react";
import {
  CreateEventsIcon,
  EasyManagementIcon,
  EfficientPaymentIcon,
  PlatformIcon,
  QuickTicketBookingIcon,
  ThinkingEmojiIcon,
  TrackPerformanceIcon,
} from "../SVGs/SVGicons";
import { RootState } from "@/app/redux/store";
import { useSelector } from "react-redux";
import { Theme } from "@/app/enums/Theme";

interface ServicesProps {}

const Services: FunctionComponent<ServicesProps> = (): ReactElement => {
  const appTheme = useSelector((state: RootState) => state.theme.appTheme);

  const services = [
    {
      icon: PlatformIcon,
      title: "User Friendly Platform",
      subText:
        "We prioritize a swift and data-efficient experience for our users.",
    },
    {
      icon: QuickTicketBookingIcon,
      title: "Quick Ticket Booking",
      subText: "Easily book tickets for your preferred events.",
    },
    {
      icon: CreateEventsIcon,
      title: "Create / Publish Events",
      subText:
        "Create and publish events by entering the necessary information",
    },
    {
      icon: EasyManagementIcon,
      title: "Easy Event Management",
      subText: "Easily manage events from anywhere on your dashboard.",
    },
    {
      icon: EfficientPaymentIcon,
      title: "Efficient Payment",
      subText: "Easily manage and track sales and commissions.",
    },
    {
      icon: TrackPerformanceIcon,
      title: "Track your Performance",
      subText:
        "We offer real-time reporting for tracking sales, and commissions.",
    },
  ];

  return (
    <section className='bg-dark-grey sectionPadding pt-8'>
      <div className='flex flex-col items-center gap-2 mx-auto w-[80%] sm:w-[40%]'>
        <h2 className='relative text-[30px] font-Mona-Sans-Wide font-semibold flex items-center gap-0.5'>
          Why Us?{" "}
          <span>
            <ThinkingEmojiIcon className='size-8' />
          </span>
        </h2>
        <p className='text-sm w-fit text-center'>
          We know you trust us, but just so you are wondering why you should
          keep using our service... 👀
        </p>
      </div>
      <div className='mt-[4rem] gap-5 sm:gap-6 mb-[6rem] grid sm:[grid-template-columns:repeat(auto-fill,minmax(250px,1fr))] [grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));] mx-[0]'>
        {services.map((service, index) => (
          <div
            className={
              `w-full min-w-[160px] sm:min-w-[250px] flex flex-col items-center text-center py-8 px-6 gap-4 rounded-3xl bg-[linear-gradient(180deg,_rgba(255,255,255,0.1)_0%,_rgba(255,255,255,0)_100%)] ${
                appTheme == Theme.Light
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
      </div>
    </section>
  );
};

export default Services;
