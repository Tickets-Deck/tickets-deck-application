"use client";
import { FunctionComponent, ReactElement } from "react";
import Link from "next/link";
import images from "../../public/images";
import Image from "next/image";
import { InstagramIcon, LinkedInIcon, TwitterIcon } from "./SVGs/SVGicons";
import SubscriptionFormSection from "./Footer/SubscriptionFormSection";
import { useSession } from "next-auth/react";
import { ApplicationRoutes } from "../constants/applicationRoutes";

interface FooterProps {}

const Footer: FunctionComponent<FooterProps> = (): ReactElement => {

  const { data: session } = useSession();
  const user = session?.user;

  return (
    <section className={"sectionPadding !py-16 md:!py-12 bg-dark-grey flex flex-col md:flex-row items-start text-white gap-[3.25rem]"}>
      <div className='flex mb-4 sm:mb-8 md:mb-0 w-full md:w-[30%] flex-col gap-5'>
        <div className='flex items-center gap-1'>
          <div className='size-8'>
            <Image src={images.logoPurple} alt='logo' />
          </div>
          <p className='text-sm'>Ticketsdeck Events</p>
        </div>
        <div className={""}>
          <p className='text-[0.812rem] leading-[1.25rem] font-[100]'>
            Our goal is to provide a global self-service event ticketing
            platform for live experiences that allows anyone to create, share,
            find and attend events that fuel their passion and enrich their
            lives.
          </p>
        </div>
        <div className='flex gap-[0.625rem] items-center'>
          {/* <Link href='https://www.facebook.com/ticketsdeck0' target="_blank">
                        <span><FacebookIcon /></span>
                    </Link> */}
          <Link href='https://x.com/ticketsdeck_e' target='_blank'>
            <span className='inline-flex cursor-pointer group'>
              <TwitterIcon className='size-6 mx-auto group-hover:-translate-y-1' />
            </span>
          </Link>
          <Link href='https://www.instagram.com/ticketsdeck_e' target='_blank'>
            <span className='inline-flex cursor-pointer group'>
              <InstagramIcon className='size-6 mx-auto group-hover:-translate-y-1' />
            </span>
          </Link>
          <Link
            href='https://www.linkedin.com/company/theticketsdeck/?viewAsMember=true'
            target='_blank'
          >
            <span className='inline-flex cursor-pointer group'>
              <LinkedInIcon className='size-6 mx-auto group-hover:-translate-y-1' />
            </span>
          </Link>
        </div>
      </div>
      <div className='flex items-start w-full sm:w-fit flex-col md:flex-row gap-[2.625rem]'>
        <div className={`order-2 md:order-none`}>
          <h4 className='mb-5 whitespace-nowrap w-fit text-primary-color-sub font-medium'>
            Plan Events
          </h4>
          <div className='flex flex-col gap-2'>
            <Link
              href={
                user ? ApplicationRoutes.CreateEvent : ApplicationRoutes.SignIn
              }
            >
              <li className='text-sm sm:text-xs font-[200] mb-1 whitespace-nowrap list-none'>
                Create Events
              </li>
            </Link>
            <Link href={ApplicationRoutes.GeneralEvents}>
              <li className='text-sm sm:text-xs font-[200] mb-1 whitespace-nowrap list-none'>
                Buy Tickets
              </li>
            </Link>
          </div>
        </div>
        <div className={`order-3 md:order-none`}>
          <h4 className='mb-5 whitespace-nowrap w-fit text-primary-color-sub font-medium'>
            Company
          </h4>
          <div className='flex flex-col gap-2'>
            <Link href={ApplicationRoutes.About}>
              <li className='text-sm sm:text-xs font-[200] mb-1 whitespace-nowrap list-none'>
                About Us
              </li>
            </Link>
            <Link href={ApplicationRoutes.Contact}>
              <li className='text-sm sm:text-xs font-[200] mb-1 whitespace-nowrap list-none'>
                Contact Us
              </li>
            </Link>
            <Link href={ApplicationRoutes.TermsOfUse}>
              <li className='text-sm sm:text-xs font-[200] mb-1 whitespace-nowrap list-none'>
                Terms Of Use
              </li>
            </Link>
            <Link href={ApplicationRoutes.PrivacyPolicy}>
              <li className='text-sm sm:text-xs font-[200] mb-1 whitespace-nowrap list-none'>
                Privacy Policy
              </li>
            </Link>
          </div>
        </div>
        <div className={`order-1 md:order-none`}>
          <h4 className='mb-5 whitespace-nowrap w-fit text-primary-color-sub font-medium'>
            Stay Connected With Us
          </h4>
          <p className='w-full text-xs leading-[1.25rem] font-[200] mb-5'>
            Join our mailing list to stay in the loop with our newest update on
            Events and concerts
          </p>
          <SubscriptionFormSection />
        </div>
      </div>
    </section>
  );
};

export default Footer;
