"use client";
import { FunctionComponent, ReactElement } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";

interface CreateEventProps {}

const CreateEvent: FunctionComponent<CreateEventProps> = (): ReactElement => {

  const { data: session } = useSession();
  const user = session?.user;

  return (
    <section className='sectionPadding flex justify-between items-center !pb-8 !pt-12 bg-white gap-6 sm:!py-0 border-t-4 border-primary-color flex-col sm:flex-row sm:gap-12'>
      <div className='basis-[100%] sm:basis-[80%] w-full relative text-dark-grey flex-col gap-2 justify-center'>
        <h3 className='text-[35px] sm:text-[30px] font-semibold'>
          Create your own Event
        </h3>
        <p className='w-full sm:w-[60%] font-light'>
          Time to enjoy seamless ticketing, and event creation process.
        </p>
      </div>
      <div className='flex items-center text-center p-0 sm:py-8 gap-2 sm:items-start justify-center sm:flex-col basis-[20%]'>
        <Link
          className='w-fit'
          href={user ? ApplicationRoutes.CreateEvent : ApplicationRoutes.SignIn}
        >
          <button className='secondaryButton hover:shadow-[0px_10px_50px_0px_rgba(61,55,241,0.25)] w-fit'>
            Create Events
          </button>
        </Link>
      </div>
    </section>
  );
};

export default CreateEvent;
