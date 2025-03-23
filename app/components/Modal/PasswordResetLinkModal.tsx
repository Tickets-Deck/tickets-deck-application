import {
  Dispatch,
  FunctionComponent,
  ReactElement,
  SetStateAction,
} from "react";
import ModalWrapper from "./ModalWrapper";
import { Icons } from "../ui/icons";
import Link from "next/link";

interface PasswordResetLinkModalProps {
  visibility: boolean;
  setVisibility: Dispatch<SetStateAction<boolean>>;
  moreInfo?: JSX.Element;
}

const PasswordResetLinkModal: FunctionComponent<
  PasswordResetLinkModalProps
> = ({ visibility, setVisibility, moreInfo }): ReactElement => {
  return (
    <ModalWrapper
      disallowOverlayFunction
      visibility={visibility}
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
            <h3 className='mb-1'>Check your mailbox</h3>
            <p className='text-grey text-[0.8rem] font-light opacity-80'>
              We&apos;ve sent you an email with instructions to reset your
              password.
            </p>
          </div>
          <span
            className='ml-auto size-8 rounded-full grid place-items-center cursor-pointer hover:bg-white/10 [&_svg_path]:stroke-[#fff] [&_svg_path]:fill-[#fff]'
            onClick={() => setVisibility(false)}
          >
            <Icons.Close />
          </span>
        </div>
        {moreInfo && (
          <div className='mt-4 *:text-sm *::font-light *:leading-5 *:text-grey *:opacity-80 *:mb-1'>
            {moreInfo}
          </div>
        )}
        <div className='flex justify-end mt-4 gap-2'>
          <Link
            href='mailto:'
            className='py-2 px-4 w-fit rounded-[3.125rem] cursor-pointer text-sm border-none bg-white text-dark-grey flex items-center gap-2'
            onClick={() => setVisibility(false)}
          >
            Open email
          </Link>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default PasswordResetLinkModal;
