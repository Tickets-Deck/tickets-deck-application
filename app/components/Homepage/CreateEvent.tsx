"use client";
import {
  Dispatch,
  FunctionComponent,
  ReactElement,
  SetStateAction,
} from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";

interface CreateEventProps {
  setEmailVerificationPromptIsVisible: Dispatch<SetStateAction<boolean>>;
  isEmailVerified: boolean | undefined;
}

const CreateEvent: FunctionComponent<CreateEventProps> = ({
  isEmailVerified,
  setEmailVerificationPromptIsVisible,
}): ReactElement => {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <>
      {/* <section className='sectionPadding flex justify-between items-center !pb-8 !pt-12 bg-white gap-6 sm:!py-0 border-t-4 border-primary-color flex-col sm:flex-row sm:gap-12'>
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
            </section> */}

      <section className="sectionPadding !py-14 bg-gradient-to-r from-purple-900 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 purple-gradient opacity-10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 shape-blob bg-white-color/10 -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 shape-circle bg-white-color/10 -ml-20 -mb-20"></div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="md:w-2/3">
            <h2 className="text-3xl font-semibold mb-4">
              Create your own Event
            </h2>
            <p className="text-gray-200 max-w-2xl">
              Time to enjoy seamless ticketing, and event creation process. Join
              thousands of event creators who trust Ticketsdeck Events for their
              events.
            </p>
          </div>

          {/* <Link
                        className='w-fit'
                        href={user ? ApplicationRoutes.CreateEvent : ApplicationRoutes.SignIn}
                    >
                        <button className='secondaryButton !bg-white !text-primary-color hover:shadow-[0px_10px_50px_0px_rgba(61,55,241,0.25)] w-fit'>
                            Create Event
                        </button>
                    </Link> */}

          {!user && (
            <Link href={ApplicationRoutes.SignIn}>
              <button className="secondaryButton !bg-white !text-primary-color hover:shadow-[0px_10px_50px_0px_rgba(61,55,241,0.25)] w-fit">
                Create Event
              </button>
            </Link>
          )}
          {user && !isEmailVerified && (
            <button
              onClick={() => setEmailVerificationPromptIsVisible(true)}
              className="secondaryButton !bg-white !text-primary-color hover:shadow-[0px_10px_50px_0px_rgba(61,55,241,0.25)] w-fit"
            >
              Create Event
            </button>
          )}
          {user && isEmailVerified && (
            <Link href={ApplicationRoutes.CreateEvent}>
              <button className="secondaryButton !bg-white !text-primary-color hover:shadow-[0px_10px_50px_0px_rgba(61,55,241,0.25)] w-fit">
                Create Event
              </button>
            </Link>
          )}
        </div>
      </section>
    </>
  );
};

export default CreateEvent;
