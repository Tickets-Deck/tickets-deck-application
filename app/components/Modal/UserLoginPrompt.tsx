import {
  Dispatch,
  FunctionComponent,
  ReactElement,
  SetStateAction,
  useState,
} from "react";
import ModalWrapper from "./ModalWrapper";
import { Icons } from "../ui/icons";
import Link from "next/link";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";

interface UserLoginPromptProps {
  visibility: boolean;
  setVisibility: Dispatch<SetStateAction<boolean>>;
}

const UserLoginPrompt: FunctionComponent<UserLoginPromptProps> = ({
  visibility,
  setVisibility,
}): ReactElement => {
  return (
    <ModalWrapper
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
            <h3 className='mb-1'>Hello there</h3>
            <p className='text-grey text-[0.8rem] font-light opacity-80'>
              You would need to login to perform this action
            </p>
          </div>
          <span
            className='ml-auto size-8 rounded-full grid place-items-center cursor-pointer hover:bg-white/10 [&_svg_path]:stroke-[#fff] [&_svg_path]:fill-[#fff]'
            onClick={() => setVisibility(false)}
          >
            <Icons.Close />
          </span>
        </div>
        <div className='flex justify-end mt-4 gap-2'>
          <Link
            className='py-2 px-4 w-fit rounded-[3.125rem] cursor-pointer text-sm border-none bg-white text-dark-grey flex items-center gap-2'
            href={ApplicationRoutes.SignIn}
            onClick={() => setVisibility(false)}
          >
            Login
          </Link>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default UserLoginPrompt;
