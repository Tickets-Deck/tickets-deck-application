"use client";
import {
  ReactElement,
  FunctionComponent,
  useEffect,
  useState,
  useRef,
} from "react";
import EventMainInfo from "../../components/Event/EventInfo";
import { EventResponse } from "../../models/IEvents";
import { useFetchOrderInformationById } from "@/app/api/apiClient";
import ComponentLoader from "@/app/components/Loader/ComponentLoader";
import { UserTicketOrderInfo } from "@/app/models/IUserTicketOrder";
import { UserTicketOrder } from "@/app/models/ITicketOrder";
import { TicketPass } from "@/app/models/ITicketPass";
import QRCode from "qrcode.react";
import ModalWrapper from "@/app/components/Modal/ModalWrapper";
import TicketUi from "@/app/components/Ticket/TicketUi";
import { Icons } from "@/app/components/ui/icons";
import { ImagePopup } from "@/app/components/custom/ImagePopup";

interface OrdersPageProps {
  orderId: string;
  hostUrl: string | undefined;
}

const OrdersPage: FunctionComponent<OrdersPageProps> = ({
  orderId,
  hostUrl,
}): ReactElement => {
  const fetchOrderInformationById = useFetchOrderInformationById();

  const [isFetchingOrderInformation, setIsFetchingOrderInformation] =
    useState(true);
  const [orderInformation, setOrderInformation] =
    useState<UserTicketOrderInfo | null>(null);
  const [selectedTicketOrderInfo, setSelectedTicketOrderInfo] =
    useState<TicketPass>();
  const [isTicketVisible, setIsTicketVisible] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  /**
   * Function to fetch order information
   */
  async function handleFetchOrderInformation() {
    await fetchOrderInformationById(orderId)
      .then((response) => {
        setOrderInformation(response.data);
      })
      .catch((error) => {
        setOrderInformation(null);
      })
      .finally(() => {
        // Fetch order information
        setIsFetchingOrderInformation(false);
      });
  }

  function showTicketUi(ticketOrder: UserTicketOrder) {
    setSelectedTicketOrderInfo({
      ticketType: ticketOrder.ticket.name,
      eventInfo: orderInformation?.event as EventResponse,
      qr: <QRCode value={ticketOrder?.orderId as string} />,
      orderId: ticketOrder?.orderId as string,
    });
  }

  useEffect(() => {
    handleFetchOrderInformation();
  }, []);

  useEffect(() => {
    if (selectedTicketOrderInfo) {
      setIsTicketVisible(true);
      return;
    }
  }, [selectedTicketOrderInfo]);

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
        {selectedTicketOrderInfo && (
          <TicketUi
            ticketInfo={selectedTicketOrderInfo}
            setIsTicketVisible={setIsTicketVisible}
          />
        )}
      </ModalWrapper>
      {orderInformation && orderInformation.event && (
        <ImagePopup
          imageUrl={orderInformation.event.mainImageUrl}
          alt={orderInformation.event.title}
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
        />
      )}

      <main className='text-white bg-dark-grey p-[1.25rem] md:px-[5rem] xl:px-[16%] lg:px-[10rem] pt-6 pb-20'>
        {isFetchingOrderInformation && !orderInformation && (
          <div className='flex flex-col items-center justify-center min-h-[80vh] text-center'>
            <div className='size-[100px] relative mb-4'>
              <ComponentLoader customLoaderColor='#fff' />
            </div>
            <h3 className='text-xl font-medium text-white mb-1'>
              Fetching ticket order information
            </h3>
            <p className='text-[0.85rem] text-white text-center'>
              Please wait while we fetch your ticket order information.
            </p>
          </div>
        )}

        {!isFetchingOrderInformation && !orderInformation && (
          <div className='flex flex-col items-center justify-center min-h-[80vh] text-center'>
            {/* <div className={styles.loaderArea}>
                        <ComponentLoader customLoaderColor="#fff" />
                    </div> */}
            <h3 className='text-xl font-medium text-white mb-1'>
              There was no ticket order found
            </h3>
            <p className='text-[0.85rem] text-white text-center'>
              It seems the ticket order you are looking for does not exist.
            </p>
          </div>
        )}

        {!isFetchingOrderInformation && orderInformation && (
          <>
            <div className='flex items-center mb-6'>
              {/* <span className={styles.closeIcon}><ArrowLeftIcon /></span> */}
              {/* <h2>Order <span>#{orderInformation?.orderId}</span> on {moment(orderInformation?.createdAt).format("MMM D, YYYY")}</h2> */}
              <h2 className='text-2xl font-medium m-0'>
                Order{" "}
                <span className='opacity-50'>#{orderInformation.orderId}</span>
              </h2>
            </div>
            <div className='flex flex-col md:flex-row'>
              <div className='w-full order-2 md:w-[35%] md:order-none mr-12'>
                <EventMainInfo
                  eventInfo={orderInformation.event}
                  forOrdersPage
                  hideStatusTag
                  hostUrl={hostUrl}
                  setIsPopupOpen={setIsPopupOpen}
                />
              </div>
              <div className='w-full order-1 md:order-none md:w-[calc(65%-3rem)] flex flex-col bg-container-grey mb-8 h-fit p-4 rounded-[20px]'>
                <h2 className='text-2xl font-medium mb-1'>Tickets</h2>
                <p className='text-sm text-white opacity-70 mb-4'>
                  Primary email: {orderInformation.contactEmail}
                </p>
                <div className='flex md:items-center justify-between py-4 border-b border-container-grey flex-col md:flex-row items-start'>
                  {orderInformation.orderedTickets.map(
                    (orderedTicket, index) => (
                      <div
                        className='flex flex-row items-center justify-between py-4 border-b-[1px] border-b-container-grey'
                        key={index}
                      >
                        <h3
                          className='text-lg font-medium
                          '
                        >
                          {orderedTicket.ticket.name}
                        </h3>
                        <p
                          className='m-0 md:ml-auto md:mr-4'
                          style={
                            orderedTicket.associatedEmail
                              ? {}
                              : {
                                  fontSize: "14px",
                                  fontStyle: "italic",
                                  opacity: 0.5,
                                }
                          }
                        >
                          {orderedTicket.associatedEmail ??
                            "Sent to primary email"}
                        </p>

                        <button
                          className='p-2 px-4 bg-white/10 hover:bg-white/30 rounded-full text-sm transition-all flex flex-row items-center gap-2'
                          onClick={() => showTicketUi(orderedTicket)}
                        >
                          <Icons.Ticket width={18} />
                          View Ticket
                        </button>
                      </div>
                    )
                  )}
                </div>
                {/* <div className={styles.actions}>
                        <button>Cancel order</button>
                        <button>Resend tickets to email</button>
                    </div> */}
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
};

export default OrdersPage;
