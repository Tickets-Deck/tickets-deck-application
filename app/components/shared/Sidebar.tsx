"use client";
import {
  CSSProperties,
  Dispatch,
  FunctionComponent,
  ReactElement,
  SetStateAction,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import useResponsiveness from "@/app/hooks/useResponsiveness";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";
import { motion } from "framer-motion";
import { mobileMenuVariant } from "@/app/animations/navbarAnimations";
import { Icons } from "../ui/icons";

interface SidebarProps {
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

interface ReusableLinkProps {
  route: ApplicationRoutes;
  currentPageChecker: boolean;
  text: string;
  icon: ReactElement;
  className?: string;
}

const Sidebar: FunctionComponent<SidebarProps> = ({
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
}): ReactElement => {
  const pathname = usePathname();
  const [eventsSubLinksIsOpen, setEventsSubLinksIsOpen] = useState(false);

  const currentPageIsDashboard = pathname == ApplicationRoutes.Dashboard;
  const currentPageIsEvents = pathname == ApplicationRoutes.Events;
  const currentPageIsCreateEvent = pathname == ApplicationRoutes.CreateEvent;
  const currentPageIsEditEvent = pathname.startsWith(
    ApplicationRoutes.EditEvent
  );
  const currentPageIsProfile = pathname.includes(ApplicationRoutes.Profile);
  const currentPageIsWallet = pathname.includes(ApplicationRoutes.Wallet);
  const currentPageIsFavorites = pathname.includes(
    ApplicationRoutes.FavouriteEvents
  );

  function closeSidebar() {
    if (isMobileSidebarOpen) {
      setIsMobileSidebarOpen(false);
    }
  }

  const windowRes = useResponsiveness();
  const isMobile = windowRes.width && windowRes.width < 768;
  const onMobile = typeof isMobile == "boolean" && isMobile;
  const onDesktop = typeof isMobile == "boolean" && !isMobile;

  function ReusableLink({
    route,
    className,
    currentPageChecker,
    text,
    icon,
  }: ReusableLinkProps) {
    return (
      <Link href={route} onClick={closeSidebar}>
        <li
          className={`py-[0.8rem] px-4 flex items-center gap-[6px] text-sm cursor-pointer relative before:absolute before:left-[-0.25rem] before:top-0 before:bottom-0 before:w-[3px] before:[border-start-end-radius:8px] before:[border-end-end-radius:8px] before:bg-transparent before:transition-all before:[transition-timing-function:cubic-bezier(0.55,0.055,0.675,0.19)] before:duration-200  hover:bg-dark-grey/5 hover:text-primary-color-sub [&_:hover_svg_path]:fill-primary-color-sub hover:before:left-0 hover:before:bg-primary-color-sub [&_svg]:w-[22px] [&_svg_path]:fill-primary-color-sub ${
            className ? className : ""
          }
                    ${
                      currentPageChecker
                        ? "rotate-90 [transform-origin:center_center] bg-dark-grey text-primary-color-sub [&_svg_path]:fill-primary-color-sub before:left-0 before:bg-primary-color-sub"
                        : ""
                    }`}
        >
          {icon} {text}
        </li>
      </Link>
    );
  }

  return (
    <motion.div
      initial='closed'
      variants={
        onMobile
          ? mobileMenuVariant({
              direction: "fromRight",
              inDelay: 0,
              outDelay: 0.1,
            })
          : undefined
      }
      animate={isMobileSidebarOpen ? "opened" : "closed"}
      className='w-full md:w-[25%] fixed md:sticky top-0 bg-dark-grey text-white z-[999] h-full'
    >
      <div className='flex flex-col mt-5'>
        <ul>
          <ReusableLink
            route={ApplicationRoutes.Dashboard}
            currentPageChecker={currentPageIsDashboard}
            text='Dashboard'
            icon={<Icons.Dashboard />}
          />
          <li
            className={`py-[0.8rem] px-4 flex items-center gap-[6px] text-sm cursor-pointer relative before:absolute before:left-[-0.25rem] before:top-0 before:bottom-0 before:w-[3px] before:[border-start-end-radius:8px] before:[border-end-end-radius:8px] before:bg-transparent before:transition-all before:[transition-timing-function:cubic-bezier(0.55,0.055,0.675,0.19)] before:duration-200  hover:bg-dark-grey/5 hover:text-primary-color-sub [&_:hover_svg_path]:fill-primary-color-sub hover:before:left-0 hover:before:bg-primary-color-sub [&_svg]:w-[22px] [&_svg_path]:fill-primary-color-sub  ${
              currentPageIsEvents ||
              currentPageIsCreateEvent ||
              currentPageIsEditEvent
                ? "rotate-90 [transform-origin:center_center] bg-dark-grey text-primary-color-sub [&_svg_path]:fill-primary-color-sub before:left-0 before:bg-primary-color-sub"
                : ""
            }`}
            onClick={() => setEventsSubLinksIsOpen(!eventsSubLinksIsOpen)}
          >
            <Icons.Event /> Events{" "}
            <span
              className={
                eventsSubLinksIsOpen
                  ? "rotate-90 [transform-origin:center_center] bg-dark-grey text-primary-color-sub [&_svg_path]:fill-primary-color-sub before:left-0 before:bg-primary-color-sub"
                  : ""
              }
            >
              <Icons.CaretRight />
            </span>
          </li>
          <div
            className={`transition-all duration-300 h-0 overflow-hidden anima ${
              eventsSubLinksIsOpen
                ? "h-[calc(3.1rem*var(--multiplicant-value))]"
                : ""
            }`}
            style={{ "--multiplicant-value": `${3.1}` } as CSSProperties}
          >
            <ReusableLink
              route={ApplicationRoutes.Events}
              className='!text-sm before:!opacity-0 hover:!bg-dark-grey/5 hover:before:!opacity-0 [&_svg]:!scale-[0.8]'
              currentPageChecker={currentPageIsEvents}
              text='My Events'
              icon={<Icons.Event />}
            />
            <ReusableLink
              route={ApplicationRoutes.FavouriteEvents}
              className='!text-sm before:!opacity-0 hover:!bg-dark-grey/5 hover:before:!opacity-0 [&_svg]:!scale-[0.8]'
              currentPageChecker={currentPageIsFavorites}
              text='My Favorites'
              icon={<Icons.Event />}
            />
            <ReusableLink
              route={ApplicationRoutes.CreateEvent}
              className='!text-sm before:!opacity-0 hover:!bg-dark-grey/5 hover:before:!opacity-0 [&_svg]:!scale-[0.8]'
              currentPageChecker={currentPageIsCreateEvent}
              text='Create Event'
              icon={<Icons.AddEvent />}
            />
          </div>

          <ReusableLink
            route={ApplicationRoutes.Wallet}
            currentPageChecker={currentPageIsWallet}
            text='Wallet'
            icon={<Icons.Wallet />}
          />
          <ReusableLink
            route={ApplicationRoutes.Profile}
            currentPageChecker={currentPageIsProfile}
            text='Profile'
            icon={<Icons.Profile />}
          />
          <li
            className='py-[0.8rem] px-4 flex items-center gap-[6px] text-sm cursor-pointer relative before:absolute before:left-[-0.25rem] before:top-0 before:bottom-0 before:w-[3px] before:[border-start-end-radius:8px] before:[border-end-end-radius:8px] before:bg-transparent before:transition-all before:[transition-timing-function:cubic-bezier(0.55,0.055,0.675,0.19)] before:duration-200  hover:bg-dark-grey/5 hover:text-primary-color-sub [&_:hover_svg_path]:fill-primary-color-sub hover:before:left-0 hover:before:bg-primary-color-sub [&_svg]:w-[22px] [&_svg_path]:stroke-primary-color-sub'
            onClick={() => {
              signOut();
              closeSidebar();
            }}
          >
            <Icons.Logout /> Logout
          </li>
        </ul>
      </div>
    </motion.div>
  );
};

export default Sidebar;
