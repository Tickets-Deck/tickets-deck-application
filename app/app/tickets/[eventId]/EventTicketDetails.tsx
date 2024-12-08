"use client";
import React, { useEffect, useState } from "react";
import { useFetchUserEventTicketsSold } from "@/app/api/apiClient";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import styles from "@/app/styles/Tickets.module.scss";
import { UserTicketOrder } from "@/app/models/ITicketOrder";
import { toast } from "sonner";
import ComponentLoader from "@/app/components/Loader/ComponentLoader";
import moment from "moment";
import { OrderStatus } from "@prisma/client";
import { serializeOrderStatus } from "@/app/constants/serializer";

type Props = {
  eventId: string;
};

export default function EventTicketDetails({ eventId }: Props) {
  const ticketsSold = useFetchUserEventTicketsSold();
  const userInfo = useSelector(
    (state: RootState) => state.userCredentials.userInfo
  );

  const [isFetchingEventTickets, setIsFetchingEventTickets] = useState(true);
  const [displayedTickets, setDisplayedTickets] = useState<UserTicketOrder[]>(
    []
  );

  const fetchEventTickets = async () => {
    setIsFetchingEventTickets(true);

    await ticketsSold(userInfo?.id as string, eventId)
      .then((response) => {
        setDisplayedTickets(response.data);
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
        return styles.pendingTag;
      case OrderStatus.PaymentInitiated:
        return styles.initiatedTag;
      case OrderStatus.Confirmed:
        return styles.completedTag;
      case OrderStatus.Cancelled:
        return styles.cancelledTag;
      default:
        return styles.pendingTag;
    }
  }

  useEffect(() => {
    if (userInfo) {
      fetchEventTickets();
    }
  }, [userInfo]);

  return (
    <div className={styles.ticketsPage}>
      <div className={styles.topArea}>
        <h3>Tickets sold for Event - {eventId}</h3>
      </div>
      <div className={`${styles.tableContainer} mt-8`}>
        <table>
          <tr>
            <th>Event name</th>
            <th>Ticket name</th>
            <th>Amount</th>
            <th>Assigned email</th>
            <th>Transaction date</th>
            <th>Status</th>
            {displayedTickets.map((userTicketOrder, index) => {
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
                    <span className={showTagStyle(userTicketOrder.orderStatus)}>
                      {serializeOrderStatus(userTicketOrder.orderStatus)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tr>
        </table>
        {displayedTickets.length == 0 && !isFetchingEventTickets && (
          <div className={styles.tableInfoUnavailable}>
            <p>There is no data available</p>
          </div>
        )}
        {displayedTickets.length == 0 && isFetchingEventTickets && (
          <div className={styles.tableLoader}>
            <ComponentLoader
              isSmallLoader
              customBackground='#fff'
              customLoaderColor='#111111'
            />
          </div>
        )}
      </div>
    </div>
  );
}
