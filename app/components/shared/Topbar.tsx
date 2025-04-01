import {
  Dispatch,
  FunctionComponent,
  ReactElement,
  SetStateAction,
} from "react";
import Image from "next/image";
import images from "../../../public/images";
import { Icons } from "../ui/icons";
import Link from "next/link";
import useResponsiveness from "@/app/hooks/useResponsiveness";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";

interface TopbarProps {
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

const Topbar: FunctionComponent<TopbarProps> = ({
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
}): ReactElement => {
  const userInfo = useSelector(
    (state: RootState) => state.userCredentials.userInfo
  );

  const windowRes = useResponsiveness();
  const isMobile = windowRes.width && windowRes.width < 768;
  const onMobile = typeof isMobile == "boolean" && isMobile;
  const onDesktop = typeof isMobile == "boolean" && !isMobile;

  return (
    <div className='py-[0.65rem] md:h-[3.125rem] md:py-4 px-6 w-full flex justify-between drop-shadow-[0px_4px_4px_rgba(0,0,0,0.16)] bg-dark-grey-2 text-white'>
      <Link href={ApplicationRoutes.Home} className='inline-flex'>
        <div className='flex items-center gap-[0.625rem] relative'>
          <span className='w-8 inline-flex'>
            <Image className='size-full' src={images.logoPurple} alt='Logo' />
          </span>
          <p>Ticketsdeck</p>
        </div>
      </Link>
      <div className='flex items-center w-fit md:w-[81.2%] justify-end'>
        {/* <div className={styles.searchContainer}>
                    <SearchIcon />
                    <input type="text" placeholder="Search for event" />
                </div> */}
        <Link href={ApplicationRoutes.Profile} className='inline-flex'>
          <div className='hidden md:flex hover:opacity-65 items-center gap-2 cursor-pointer relative'>
            <div className='size-8 border border-grey/10 grid place-items-center rounded-full relative overflow-hidden'>
              <Image
                className='size-full object-cover'
                src={userInfo?.profilePhoto || images.user_avatar}
                fill
                alt='Profile'
              />
            </div>
            <h3 className='font-medium text-sm text-white'>
              {userInfo?.firstName ?? userInfo?.username}
            </h3>
          </div>
        </Link>
        {onMobile && (
          <motion.span
            whileTap={{ scale: 0.6 }}
            className='size-[36px] grid place-items-center bg-container-grey rounded-[0.35rem] cursor-pointer'
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          >
            <Icons.HamburgerMenu />
          </motion.span>
        )}
      </div>
    </div>
  );
};

export default Topbar;
