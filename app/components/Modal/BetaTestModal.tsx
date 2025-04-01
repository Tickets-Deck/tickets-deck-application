import {
  Dispatch,
  FunctionComponent,
  ReactElement,
  SetStateAction,
} from "react";
import ModalWrapper from "./ModalWrapper";
import { Icons } from "../ui/icons";
import Link from "next/link";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";

interface BetaTestModalProps {
  visibility: boolean;
  setVisibility: Dispatch<SetStateAction<boolean>>;
  forGeneralMessage?: boolean;
}

const BetaTestModal: FunctionComponent<BetaTestModalProps> = ({
  visibility,
  setVisibility,
  forGeneralMessage,
}): ReactElement => {
  if (process.env.PUBLIC_NEXTAUTH_URL == "https://events.ticketsdeck.com") {
    return <></>;
  }
  return (
    <ModalWrapper
      visibility={false}
      setVisibility={setVisibility}
      styles={{
        backgroundColor: "transparent",
        color: "#fff",
        width: "fit-content",
      }}
    >
      <div className='w-full sm:w-[21.875rem] p-6 rounded-[20px] bg-[linear-gradient(180deg,_#464646_0%,_#313131_100%)]'>
        <div className='flex justify-between items-start'>
          <div className='flex flex-col items-start'>
            <h3 className='mb-1'>Hello there</h3>
            {forGeneralMessage ? (
              <div className='mt-4'>
                <p className='text-sm font-light leading-5 text-grey opacity-80 mb-1'>
                  We are glad to have you here. We are currently in beta testing
                  phase.
                </p>
                <p className='text-sm font-light leading-5 text-grey opacity-80 mb-1'>
                  Note that events shown here are for testing purposes only.
                </p>
                <p className='text-sm font-light leading-5 text-grey opacity-80 mb-1'>
                  If you would like to report a bug or have any feedback, please{" "}
                  <Link
                    href={ApplicationRoutes.Contact}
                    className='text-primary-color-sub underline'
                  >
                    contact us
                  </Link>
                  .
                </p>
              </div>
            ) : (
              <div className='mt-4'>
                <p className='text-sm font-light leading-5 text-grey opacity-80 mb-1'>
                  We are currently in beta testing phase. Some features may not
                  work as expected. We are working hard to make sure everything
                  is perfect. Thank you for your patience.
                </p>
                <p className='text-sm font-light leading-5 text-grey opacity-80 mb-1'>
                  If you would like to report a bug or have any feedback, please
                  click&nbsp;
                  <Link
                    href={ApplicationRoutes.Contact}
                    className='text-primary-color-sub underline'
                  >
                    here
                  </Link>{" "}
                  to contact us.
                </p>
              </div>
            )}
          </div>
          <span
            className='ml-auto size-8 rounded-full grid place-items-center cursor-pointer hover:bg-white/10 [&_svg_path]:stroke-[#fff] [&_svg_path]:fill-[#fff]'
            onClick={() => setVisibility(false)}
          >
            <Icons.Close />
          </span>
        </div>
        <div className='flex justify-end mt-4 gap-2'>
          <button
            className='py-2 px-4 w-fit rounded-[3.125rem] cursor-pointer text-sm border-none bg-white text-dark-grey flex items-center gap-2'
            onClick={() => setVisibility(false)}
          >
            Okay, Got it.
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default BetaTestModal;
