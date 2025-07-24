"use client";
import React, { useEffect, useState } from "react";
import { useFetchUserEventTicketsSold } from "@/app/api/apiClient";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { UserTicketOrder } from "@/app/models/ITicketOrder";
import { toast } from "sonner";
import ComponentLoader from "@/app/components/Loader/ComponentLoader";
import moment from "moment";
import { serializeOrderStatus } from "@/app/constants/serializer";
import Button from "@/app/components/ui/button";
import jsonexport from "jsonexport";
import { useSession } from "next-auth/react";
import { OrderStatus } from "@/app/enums/IOrderStatus";
import DownloadOptionsModal from "@/app/components/UserConsole/TicketsPage/DownloadOptionsModal";

type Props = {
  eventId: string;
};

export default function EventTicketDetails({ eventId }: Props) {
  const ticketsSold = useFetchUserEventTicketsSold();

  const userInfo = useSelector(
    (state: RootState) => state.userCredentials.userInfo
  );

  const { data: session, status } = useSession();
  const user = session?.user;

  const [isFetchingEventTickets, setIsFetchingEventTickets] = useState(true);
  const [ticketOrders, setTicketOrders] = useState<UserTicketOrder[]>([]);
  console.log("🚀 ~ EventTicketDetails ~ ticketOrders:", ticketOrders);
  const [isDownloadingTicketsSold, setIsDownloadingTicketsSold] =
    useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const availableFields = [
    "Ticket Name",
    "Amount",
    "Email Address",
    "Full Name",
    "Phone Number",
    "Purchase Date",
  ];
  const [selectedFields, setSelectedFields] =
    useState<string[]>(availableFields);

  const handleFetchEventTickets = async () => {
    setIsFetchingEventTickets(true);

    await ticketsSold(user?.token as string, userInfo?.id as string, eventId)
      .then((response) => {
        setTicketOrders(response.data);
      })
      .catch((error) => {
        toast.error("There was an error while fetching event tickets");
        console.error("Error fetching event tickets:" + error);
      })
      .finally(() => {
        setIsFetchingEventTickets(false);
      });
  };

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

  async function handleDownloadEventTicketsInfo(fieldsToDownload: string[]) {
    setIsDownloadingTicketsSold(true);

    try {
      if (fieldsToDownload.length === 0) {
        toast.error("Please select at least one field to download.");
        setIsDownloadingTicketsSold(false);
        return;
      }

      const formattedData = ticketOrders.map((eachData) => {
        const fullName =
          eachData.order.contactFirstName && eachData.order.contactLastName
            ? `${eachData.order.contactFirstName} ${eachData.order.contactLastName}`
            : "Not provided";

        const record: { [key: string]: any } = {};

        if (fieldsToDownload.includes("Ticket Name"))
          record["Ticket Name"] = eachData.ticket.name;
        if (fieldsToDownload.includes("Amount"))
          record["Amount"] = eachData.price;
        if (fieldsToDownload.includes("Email Address"))
          record["Email Address"] =
            eachData.associatedEmail || eachData.contactEmail;
        if (fieldsToDownload.includes("Full Name"))
          record["Full Name"] = fullName;
        if (fieldsToDownload.includes("Phone Number"))
          record["Phone Number"] = eachData.order.contactNumber;
        if (fieldsToDownload.includes("Date Created"))
          record["Date Created"] = moment(eachData.createdAt).format(
            "YYYY-MM-DD"
          );

        return record;
      });

      const csvData = await jsonexport(formattedData);
      const fileName = `${ticketOrders[0].ticket.event.title}_tickets_sold.csv`;
      const blob = new Blob([csvData], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setIsDownloadingTicketsSold(false);
      setIsModalOpen(false);
      toast(
        `${ticketOrders[0].ticket.event.title} tickets sold downloaded successfully.`
      );
    } catch (error) {
      console.error("Error exporting CSV:", error);
      setIsDownloadingTicketsSold(false);
      toast(
        `Error exporting ${ticketOrders[0].ticket.event.title} tickets sold.`
      );
    }
  }

  useEffect(() => {
    if (user && userInfo) {
      handleFetchEventTickets();
    }
  }, [user, userInfo]);

  return (
    <div className="h-screen w-full p-6 py-7">
      {ticketOrders.length > 0 ? (
        <div
          className={`flex flex-col items-start p-4 pt-10 md:flex-row md:items-center md:justify-between md:py-0`}
        >
          <h3 className="text-[30px] font-normal text-white leading-8 mb-3">
            Tickets sold for{" "}
            <span className="text-primary-color-sub">
              {ticketOrders[0].ticket.event.title}
            </span>
          </h3>

          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary-color text-white w-fit hover:!text-primary-color"
          >
            Download
          </Button>
        </div>
      ) : (
        <></>
      )}
      <div className={`tableContainer mt-8`}>
        <table>
          <tr>
            <th>Ticket name</th>
            <th>Amount</th>
            <th>Assigned email</th>
            <th>Customer number</th>
            <th>Transaction date</th>
            <th>Status</th>
          </tr>
          {ticketOrders.map((userTicketOrder, index) => {
            return (
              <tr key={index}>
                <td>{userTicketOrder.ticket.name}</td>
                <td>
                  &#8358;
                  {Number(userTicketOrder.price).toLocaleString()}
                </td>
                <td>
                  <a
                    href={`mailto:${
                      userTicketOrder.associatedEmail ||
                      userTicketOrder.contactEmail
                    }`}
                  >
                    {userTicketOrder.associatedEmail ||
                      userTicketOrder.contactEmail}
                  </a>
                </td>
                <td>{userTicketOrder.order.contactNumber || "Not provided"}</td>
                <td>
                  {moment(userTicketOrder.createdAt).format(
                    "ddd Do MMM, YYYY | hh:mma"
                  )}
                </td>
                <td>
                  <span className={showTagStyle(userTicketOrder.orderStatus)}>
                    {serializeOrderStatus(userTicketOrder.orderStatus)}
                  </span>
                </td>
              </tr>
            );
          })}
        </table>
        {ticketOrders.length == 0 && !isFetchingEventTickets && (
          <div className={"tableInfoUnavailable"}>
            <p>There is no data available</p>
          </div>
        )}
        {ticketOrders.length == 0 && isFetchingEventTickets && (
          <div className={"tableLoader"}>
            <ComponentLoader
              isSmallLoader
              customBackground="#fff"
              customLoaderColor="#111111"
            />
          </div>
        )}
      </div>
      <DownloadOptionsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDownload={handleDownloadEventTicketsInfo}
        availableFields={availableFields}
        selectedFields={selectedFields}
        setSelectedFields={setSelectedFields}
        isDownloading={isDownloadingTicketsSold}
      />
    </div>
  );
}
