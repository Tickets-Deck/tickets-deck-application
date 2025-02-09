"use client";
import { ReactElement, FunctionComponent, useEffect, useState } from "react";
import styles from "../styles/Dashboard.module.scss";
import { EventIcon } from "../components/SVGs/SVGicons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  useFetchDashboardInfo,
  useFetchUserRecentTransactions,
} from "../api/apiClient";
import { DashboardInfoResponse } from "../models/IDashboardInfoResponse";
import { catchError } from "../constants/catchError";
import ComponentLoader from "../components/Loader/ComponentLoader";
import { ApplicationRoutes } from "../constants/applicationRoutes";
import { UserRecentTransaction } from "../models/IUserRecentTransaction";
import moment from "moment";
import { serializeOrderStatus } from "../constants/serializer";
import { OrderStatus } from "../enums/IOrderStatus";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";

interface DashboardPageProps {}

const DashboardPage: FunctionComponent<
  DashboardPageProps
> = (): ReactElement => {
  const fetchDashboardInfo = useFetchDashboardInfo();
  const fetchUserRecentTransactions = useFetchUserRecentTransactions();
  const { data: session, status } = useSession();
  const user = session?.user;
  const { push } = useRouter();

  const userInfo = useSelector(
    (state: RootState) => state.userCredentials.userInfo
  );

  const [dashboardInfo, setDashboardInfo] = useState<DashboardInfoResponse>();
  const [isLoading, setIsLoading] = useState(true);
  const [userRecentTransactions, setUserRecentTransactionss] = useState<
    UserRecentTransaction[]
  >([]);
  const [
    isFetchingUserRecentTransactions,
    setIsFetchingUserRecentTransactions,
  ] = useState(true);

  function showTagStyle(orderStatus: OrderStatus) {
    switch (orderStatus) {
      case OrderStatus.Pending:
        return "pendingTag";
      case OrderStatus.PaymentInitiated:
        return "initiatedTag";
      case OrderStatus.Confirmed:
        return "completedTag";
      case OrderStatus.Cancelled:
        return "cancelledTag";
      default:
        return "pendingTag";
    }
  }

  async function handleFetchDashboardInfo() {
    // Start loader
    setIsLoading(true);

    await fetchDashboardInfo(user?.id as string)
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

  async function handleFetchUserRecentTransactions(duration?: string) {
    // Start loader
    setIsFetchingUserRecentTransactions(true);

    await fetchUserRecentTransactions(user?.id as string, duration)
      .then((response) => {
        setUserRecentTransactionss(response.data);
      })
      .catch((error) => {
        catchError(error);
      })
      .finally(() => {
        setIsFetchingUserRecentTransactions(false);
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
      handleFetchUserRecentTransactions("14");
    }
  }, [user]);

  useEffect(() => {
    if (status === "unauthenticated") {
      push(ApplicationRoutes.SignIn);
    }
  }, [status]);

  return (
    <div className='max-[768px]:h-screen max-[768px]:w-full max-[768px]:p-4 '>
      {userInfo && (
        <div className='mt-4 flex flex-col gap-1 bg-dark-grey-2 mb-6'>
          <p className='text-sm text-white/50'>
            {moment(new Date()).format("dddd, Do MMM YYYY")}
          </p>
          <h4 className='text-2xl text-white font-normal'>
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
          <h3 className='text-white mb-2 opacity-50'>Dashboard</h3>
          <div className='flex gap-4 flex-wrap flex-col md:flex-row md:flex-nowrap'>
            <Link
              href={ApplicationRoutes.Events}
              className='w-full md:w-[25%] bg-dark-grey rounded-lg p-4 flex hover:opacity-65 items-start gap-2'
            >
              <span className='size-10 rounded bg-dark-grey-2 grid place-items-center [&_svg_path]:fill-white'>
                <EventIcon />
              </span>
              <div className='flex flex-col gap-2'>
                <h4 className='text-2xl font-medium leading-[22px] text-white'>
                  {dashboardInfo.totalEvents}
                </h4>
                <p className='text-sm text-white/50'>
                  Total {dashboardInfo.totalEvents > 1 ? "Events" : "Event"}
                </p>
              </div>
            </Link>
            <Link
              href={`${ApplicationRoutes.EventTickets}?t=0`}
              className='w-full md:w-[25%] bg-dark-grey rounded-lg p-4 flex hover:opacity-65 items-start gap-2'
            >
              <span className='size-10 rounded bg-dark-grey-2 grid place-items-center [&_svg_path]:fill-white'>
                <EventIcon />
              </span>
              <div className='flex flex-col gap-2'>
                <h4 className='text-2xl font-medium leading-[22px] text-white'>
                  {dashboardInfo.ticketsBought}
                </h4>
                <p className='text-sm text-white/50'>Tickets Bought</p>
              </div>
            </Link>
            <Link
              href={`${ApplicationRoutes.EventTickets}?t=1`}
              className='w-full md:w-[25%] bg-dark-grey rounded-lg p-4 flex hover:opacity-65 items-start gap-2'
            >
              <span className='size-10 rounded bg-dark-grey-2 grid place-items-center [&_svg_path]:fill-white'>
                <EventIcon />
              </span>
              <div className='flex flex-col gap-2'>
                <h4 className='text-2xl font-medium leading-[22px] text-white'>
                  {dashboardInfo.ticketsSold}
                </h4>
                <p className='text-sm text-white/50'>Tickets Sold</p>
              </div>
            </Link>
            <Link
              href={ApplicationRoutes.Wallet}
              className='w-full md:w-[25%] bg-dark-grey rounded-lg p-4 flex hover:opacity-65 items-start gap-2'
            >
              <span className='size-10 rounded bg-dark-grey-2 grid place-items-center [&_svg_path]:fill-white'>
                <EventIcon />
              </span>
              <div className='flex flex-col gap-2'>
                <h4 className='text-2xl font-medium leading-[22px] text-white'>
                  &#8358;{dashboardInfo.totalRevenue.toLocaleString()}
                </h4>
                <p className='text-sm text-white/50'>Total Revenue</p>
              </div>
            </Link>
          </div>
        </div>
      )}
      {isLoading && (
        <div className='h-[40vh] md:h-[15vh] w-full relative mt-4 grid place-items-center'>
          <ComponentLoader customLoaderColor='#fff' />
        </div>
      )}

      <div className='mt-8'>
        <h3 className='text-base text-white mb-2 opacity-50'>
          Recent transactions&nbsp;
          <select
            className='italic text-xs cursor-pointer hover:underline bg-transparent border-none outline-none text-white appearance-none relative'
            onChange={(e) => handleFetchUserRecentTransactions(e.target.value)}
          >
            <option
              className='bg-dark-grey-2 text-white rounded-lg p-[10px]'
              value='14'
            >
              within the last 2 weeks
            </option>
            <option
              className='bg-dark-grey-2 text-white rounded-lg p-[10px]'
              value='30'
            >
              within the last 1 month
            </option>
            <option
              className='bg-dark-grey-2 text-white rounded-lg p-[10px]'
              value='60'
            >
              within the last 2 months
            </option>
            <option
              className='bg-dark-grey-2 text-white rounded-lg p-[10px]'
              value='90'
            >
              within the last 3 months
            </option>
          </select>
        </h3>

        <div className='tableContainer'>
          <table>
            <tbody>
              <tr>
                <th>Event name</th>
                <th>Order ID</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>

              {/* <tr>
                                <td>eventName</td>
                                <td>ticketName</td>
                                <td>&#8358;5,000</td>
                                <td>Mon 15th Jan, 2024 | 04:25pm</td>
                                <td>
                                    <span className={showTagStyle(OrderStatus.Pending)}>
                                        Pending
                                    </span>
                                </td>
                            </tr> */}
              {!isFetchingUserRecentTransactions &&
                userRecentTransactions.map((userRecentTransaction, index) => {
                  return (
                    <tr key={index}>
                      <td>{userRecentTransaction.eventName}</td>
                      <td>{userRecentTransaction.orderId}</td>
                      {userRecentTransaction.amount == "0" ? (
                        <td>Free</td>
                      ) : (
                        <td>
                          &#8358;
                          {Number(
                            userRecentTransaction.amount
                          ).toLocaleString()}
                        </td>
                      )}
                      <td>
                        {moment(userRecentTransaction.date).format(
                          "ddd Do MMM, YYYY | hh:mma"
                        )}
                      </td>
                      <td>
                        <span
                          className={showTagStyle(userRecentTransaction.status)}
                        >
                          {serializeOrderStatus(userRecentTransaction.status)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>

          {userRecentTransactions.length == 0 &&
            !isFetchingUserRecentTransactions && (
              <div className={"tableInfoUnavailable"}>
                <p>There is no data available</p>
              </div>
            )}
          {userRecentTransactions.length == 0 &&
            isFetchingUserRecentTransactions && (
              <div className={"tableLoader"}>
                <ComponentLoader
                  isSmallLoader
                  customBackground='#fff'
                  customLoaderColor='#111111'
                />
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
