"use client";
import {
  Dispatch,
  FunctionComponent,
  ReactElement,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "@/app/styles/Tickets.module.scss";
import DynamicTab from "@/app/components/custom/DynamicTab";
import { DownloadIcon } from "@/app/components/SVGs/SVGicons";
import { useFetchUserTicketOrders } from "@/app/api/apiClient";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { catchError } from "@/app/constants/catchError";
import { toast } from "sonner";
import ComponentLoader from "@/app/components/Loader/ComponentLoader";
import { TicketCategory } from "@/app/enums/ITicket";
import { UserTicketOrder } from "@/app/models/ITicketOrder";
import moment from "moment";
import { serializeOrderStatus } from "@/app/constants/serializer";
import { OrderStatus } from "@/app/enums/IOrderStatus";
import ModalWrapper from "@/app/components/Modal/ModalWrapper";
import TicketUi from "@/app/components/Ticket/TicketUi";
import { TicketPass } from "@/app/models/ITicketPass";
import QRCode from "qrcode.react";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import { useRouter, useSearchParams } from "next/navigation";

interface TicketsPageProps {}

export enum TicketTab {
  Bought = 0,
  Sold = 1,
}

const TicketsPage: FunctionComponent<TicketsPageProps> = (): ReactElement => {
  const fetchUserTicketOrders = useFetchUserTicketOrders();
  const params = useSearchParams();
  const tab = params.get("t");

  const userInfo = useSelector(
    (state: RootState) => state.userCredentials.userInfo
  );
  const [selectedTicketTab, setSelectedTicketTab] = useState<TicketTab>(
    tab == "0" ? TicketTab.Bought : TicketTab.Sold
  );
  const [isFetchingUserTicketOrders, setIsFetchingUserTicketOrders] =
    useState(true);
  const [userTicketOrders, setUserTicketOrders] = useState<UserTicketOrder[]>(
    []
  );

  // const [selectedTicketOrder, setSelectedTicketOrder] = useState<UserTicketOrder>();
  const [selectedTicketOrderInfo, setSelectedTicketOrderInfo] =
    useState<TicketPass>();
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const [isTicketVisible, setIsTicketVisible] = useState(false);

  const ticketTabOptions = [
    {
      tabName: "Tickets bought",
    },
    {
      tabName: "Tickets sold",
      isDisabled: false,
    },
  ];

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

  async function handleFetchUserTicketOrders() {
    // Start loader
    setIsFetchingUserTicketOrders(true);

    // Unset ticket orders
    setUserTicketOrders([]);

    await fetchUserTicketOrders(
      userInfo?.id as string,
      selectedTicketTab === TicketTab.Bought
        ? TicketCategory.Bought
        : TicketCategory.Sold
    )
      .then((response) => {
        // Log response
        // console.log(response);

        // Update state
        setUserTicketOrders(response.data);
      })
      .catch((error) => {
        // Display error
        toast.error("An error occurred while fetching your ticket orders");

        // Catch error
        catchError(error);
      })
      .finally(() => {
        // Close loader
        setIsFetchingUserTicketOrders(false);
      });
  }

  function showTicketUi(ticketOrder: UserTicketOrder) {
    setSelectedTicketOrderInfo({
      ticketType: ticketOrder.ticket.name,
      eventInfo: ticketOrder.ticket.event,
      qr: <QRCode value={ticketOrder?.orderId as string} />,
      orderId: ticketOrder?.orderId as string,
    });
  }

  const pdfRef = useRef<HTMLDivElement>(null);

  const getPdfForPrint = useReactToPrint({
    content: () => pdfRef.current,
    bodyClass: "printElement",
    documentTitle: selectedTicketOrderInfo
      ? `${selectedTicketOrderInfo.eventInfo.title}_${selectedTicketOrderInfo.ticketType}_Ticketsdeck_Event.pdf`
      : "Ticketsdeck_Event_Ticket.pdf",
    onBeforeGetContent: () => {
      setIsDownloadingPdf(true);
    },
    onAfterPrint: () => {
      setIsDownloadingPdf(false);
      setIsTicketVisible(false);
    },
  });

  function handleSelectPdfForDownload(ticketOrder: UserTicketOrder) {
    // Start downloading loader
    setIsDownloadingPdf(true);

    setSelectedTicketOrderInfo({
      ticketType: ticketOrder.ticket.name,
      eventInfo: ticketOrder.ticket.event,
      qr: <QRCode value={ticketOrder?.contactEmail as string} />,
      orderId: ticketOrder?.orderId as string,
    });
  }

  useEffect(() => {
    if (selectedTicketOrderInfo && !isDownloadingPdf) {
      setIsTicketVisible(true);
      return;
    }
    if (selectedTicketOrderInfo && isDownloadingPdf) {
      getPdfForPrint();
      return;
    }
  }, [selectedTicketOrderInfo, isDownloadingPdf]);

  useEffect(() => {
    if (userInfo) {
      handleFetchUserTicketOrders();
    }
  }, [userInfo, selectedTicketTab]);

  useEffect(() => {
    if (!isFetchingUserTicketOrders) {
      setTimeout(() => {
        toast.dismiss();
      }, 3000);
    }
  }, [isFetchingUserTicketOrders]);

  useEffect(() => {
    if (tab == "0") {
      setSelectedTicketTab(TicketTab.Bought);
      return;
    }
    if (tab == "1") {
      setSelectedTicketTab(TicketTab.Sold);
      return;
    }
  }, [tab]);

  return (
    <>
      <ModalWrapper
        visibility={isTicketVisible && selectedTicketOrderInfo !== undefined}
        setVisibility={setIsTicketVisible}
        styles={{
          backgroundColor: "transparent",
          color: "#fff",
          width: "fit-content",
          overflowY: "auto",
          maxHeight: "100vh",
          paddingTop: "50px",
          paddingBottom: "50px",
        }}
      >
        <div className='flex flex-col items-center' ref={pdfRef}>
          {selectedTicketOrderInfo && (
            <TicketUi
              ticketInfo={selectedTicketOrderInfo}
              setIsTicketVisible={setIsTicketVisible}
            />
          )}
          {/* {
                        !isDownloadingPdf &&
                        <button onClick={getPdfForPrint}>
                            Download
                            {isDownloadingPdf && <ComponentLoader isSmallLoader customBackground="#8133F1" lightTheme customLoaderColor="#fff" />}
                        </button>
                    } */}
        </div>
      </ModalWrapper>
      <div className='flex flex-col'>
        <div className='flex items-center justify-between'>
          <h3 className='text-[30px] text-white'>Tickets page</h3>
        </div>

        <div className='ml-auto mt-2 mb-8'>
          <DynamicTab
            currentTab={selectedTicketTab}
            setCurrentTab={
              setSelectedTicketTab as Dispatch<SetStateAction<TicketTab>>
            }
            arrayOfTabOptions={ticketTabOptions}
            tabCustomWidth={140}
            tabCustomHeight={44}
            indicatorColor='#8133F1'
            containerbackgroundColor='#fff'
          />
        </div>

        <div className='tableContainer'>
          <table>
            <tbody>
              <tr>
                <th>Event name</th>
                <th>Ticket name</th>
                <th>Amount</th>
                <th>Assigned email</th>
                <th>Transaction date</th>
                <th>Status</th>
                {selectedTicketTab === TicketTab.Bought && <th>Actions</th>}
              </tr>

              {userTicketOrders.map((userTicketOrder, index) => {
                return (
                  <tr key={index}>
                    <td>{userTicketOrder.ticket.event.title}</td>
                    <td>{userTicketOrder.ticket.name}</td>
                    <td>
                      &#8358;
                      {Number(userTicketOrder.ticket.price).toLocaleString()}
                    </td>
                    <td>
                      <a
                        href={`mailto:${
                          userTicketOrder.associatedEmail ??
                          userTicketOrder.contactEmail
                        }`}
                      >
                        {userTicketOrder.associatedEmail ??
                          userTicketOrder.contactEmail}
                      </a>
                    </td>
                    <td>
                      {moment(userTicketOrder.createdAt).format(
                        "ddd Do MMM, YYYY | hh:mma"
                      )}
                    </td>
                    <td>
                      <span
                        className={showTagStyle(userTicketOrder.orderStatus)}
                      >
                        {serializeOrderStatus(userTicketOrder.orderStatus)}
                      </span>
                    </td>
                    {selectedTicketTab === TicketTab.Bought && (
                      <>
                        {userTicketOrder.orderStatus ===
                        OrderStatus.Confirmed ? (
                          <td className={"actionsDropdownContainer"}>
                            <button
                              onClick={() => showTicketUi(userTicketOrder)}
                            >
                              View Info
                            </button>
                            {/* <span
                                                                onClick={() => {
                                                                    handleSelectPdfForDownload(userTicketOrder)
                                                                }}
                                                                style={isDownloadingPdf ? { opacity: 0.45, pointerEvents: 'none' } : {}}>
                                                                <DownloadIcon />
                                                            </span> */}
                          </td>
                        ) : (
                          <td></td>
                        )}
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>

          {userTicketOrders.length == 0 && !isFetchingUserTicketOrders && (
            <div className={"tableInfoUnavailable"}>
              <p>There is no data available</p>
            </div>
          )}
          {userTicketOrders.length == 0 && isFetchingUserTicketOrders && (
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
    </>
  );
};

export default TicketsPage;
