"use client";
import { ReactElement, FunctionComponent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  useFetchDashboardInfo,
  useFetchTicketsSoldMetrics,
} from "@/app/api/apiClient";
import { DashboardInfoResponse } from "@/app/models/IDashboardInfoResponse";
import { catchError } from "@/app/constants/catchError";
import ComponentLoader from "@/app/components/Loader/ComponentLoader";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";
import moment from "moment";
import { RootState } from "@/app/redux/store";
import { useSelector } from "react-redux";
import KpiSection from "@/app/components/UserConsole/DashboardPage/KpiSection";
import RecentTransactions from "@/app/components/UserConsole/DashboardPage/RecentTransactions";
import TicketsSold from "@/app/components/UserConsole/DashboardPage/TicketsSold";
import { TicketsSoldMetrics } from "@/app/models/IMetrics";

interface DashboardPageProps {}

const DashboardPage: FunctionComponent<
  DashboardPageProps
> = (): ReactElement => {
  const fetchDashboardInfo = useFetchDashboardInfo();
  const fetchTicketsSoldMetrics = useFetchTicketsSoldMetrics();

  const { data: session, status } = useSession();
  const user = session?.user;
  const { push } = useRouter();

  const userInfo = useSelector(
    (state: RootState) => state.userCredentials.userInfo
  );

  const [dashboardInfo, setDashboardInfo] = useState<DashboardInfoResponse>();
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingTicketsSoldMetrics, setIsFetchingTicketsSoldMetrics] =
    useState(true);
  const [ticketsSoldMetrics, setTicketsSoldMetrics] = useState<
    TicketsSoldMetrics[]
  >([]);

  async function handleFetchDashboardInfo() {
    // Start loader
    setIsLoading(true);

    await fetchDashboardInfo(user?.token as string, user?.id as string)
      .then((response) => {
        setDashboardInfo(response.data);
      })
      .catch((error) => {
        catchError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  async function handleFetchTicketsSoldMetrics() {
    // show loader
    setIsFetchingTicketsSoldMetrics(true);

    await fetchTicketsSoldMetrics(user?.token as string, user?.id as string)
      .then((response) => {
        setTicketsSoldMetrics(response.data);
      })
      .catch((error) => {
        catchError(error);
      })
      .finally(() => {
        setIsFetchingTicketsSoldMetrics(false);
      });
  }

  function greeting() {
    const date = new Date();
    const hours = date.getHours();
    let greeting = "Good morning";

    if (hours >= 12 && hours < 17) {
      greeting = "Good afternoon";
    } else if (hours >= 17 && hours < 24) {
      greeting = "Good evening";
    }

    return greeting;
  }

  useEffect(() => {
    if (user) {
      handleFetchDashboardInfo();
      handleFetchTicketsSoldMetrics();
    }
  }, [user]);

  useEffect(() => {
    if (status === "unauthenticated") {
      push(ApplicationRoutes.SignIn);
    }
  }, [status]);

  return (
    <div className="h-screen w-full p-6 py-7">
      {userInfo && (
        <div className="mt-4 flex flex-col gap-1 bg-dark-grey-2 mb-6">
          <p className="text-sm text-white/50">
            {moment(new Date()).format("dddd, Do MMM YYYY")}
          </p>
          <h4 className="text-2xl text-white font-normal">
            {greeting()}, {userInfo?.firstName}!
          </h4>
        </div>
      )}

      {/* <div className={styles.topArea}>
                <h3>Dashboard</h3>
                <Link href={ApplicationRoutes.CreateEvent}>
                    <button>New Event</button>
                </Link>
            </div> */}

      {!isLoading && dashboardInfo && (
        <div>
          <h3 className="text-white mb-2 opacity-50">Dashboard</h3>
          <KpiSection dashboardInfo={dashboardInfo} />
        </div>
      )}
      {isLoading && (
        <div className="h-[40vh] md:h-[15vh] w-full relative mt-4 grid place-items-center">
          <ComponentLoader customLoaderColor="#fff" />
        </div>
      )}

      <div className="flex flex-col w-full items-start gap-4 mt-8 pb-10 md:pb-0 md:flex-row">
        <RecentTransactions session={session} />

        <TicketsSold
          isFetchingTicketsSoldMetrics={isFetchingTicketsSoldMetrics}
          ticketsSoldMetrics={ticketsSoldMetrics}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
