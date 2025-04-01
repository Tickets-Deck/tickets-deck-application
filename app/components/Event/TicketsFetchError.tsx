import images from "@/public/images";
import Image from "next/image";
import { FunctionComponent, ReactElement } from "react";
import { useRouter } from "next/navigation";

interface TicketsFetchErrorContainerProps {}

const TicketsFetchErrorContainer: FunctionComponent<
  TicketsFetchErrorContainerProps
> = (): ReactElement => {
  const router = useRouter();

  return (
    <div className='rounded-[1rem] bg-[linear-gradient(180deg,_rgba(49,49,49,0)_4.17%,_#313131_100%)] w-full pt-8 px-6 pb-[2.5px] sm:pt-10  sm:w-[80%]'>
      <div className='flex flex-col items-center gap-0.5 mb-6 text-center'>
        <h3 className='text-lg font-medium text-white'>Oops!</h3>
      </div>
      <div className='flex flex-col items-center w-full sm:w-[60%] mx-auto text-center pb-10'>
        <div className='size-[6.5rem] my-6'>
          <Image src={images.sad_face} alt='Sad face' />
        </div>
        <h4 className='text-xl text-purple-grey mb-2'>
          We encountered an issue, while trying to get the available tickets.
        </h4>
        <p className=''>
          Please{" "}
          <span
            className='underline cursor-pointer hover:text-purple-grey'
            onClick={() => router.refresh()}
          >
            reload
          </span>{" "}
          the page, and keep your fingers crossed while try our best again.
        </p>
      </div>
    </div>
  );
};

export default TicketsFetchErrorContainer;
