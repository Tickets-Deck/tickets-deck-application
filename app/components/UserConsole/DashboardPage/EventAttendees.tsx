import React from "react";
import ComponentLoader from "../../Loader/ComponentLoader";
import Link from "next/link";
import { ApplicationRoutes } from "@/app/constants/applicationRoutes";
import { EventAttendeeMetrics } from "@/app/models/IMetrics";

type Props = {
  isFetchingAttendeeMetrics: boolean;
  attendeeMetrics: EventAttendeeMetrics[];
};

export default function EventAttendees({
  isFetchingAttendeeMetrics,
  attendeeMetrics,
}: Props) {
  return (
    <div className="w-full order-1 md:order-2 md:basis-3/5">
      <div className="flex flex-row items-center justify-between mb-3">
        <h3 className="text-white">Event Attendees</h3>
        <Link
          href={`${ApplicationRoutes.EventTickets}?t=1`}
          className="text-sm p-1 px-3 rounded-full bg-white/10 text-white hover:bg-white/20"
        >
          See all
        </Link>
      </div>

      <div className="tableContainer">
        <table>
          <tbody>
            <tr>
              <th>Event name</th>
              <th>Attendees (Paid ✦ Free)</th>
              <th>Revenue</th>
              <th>Action</th>
            </tr>
            {!isFetchingAttendeeMetrics &&
              attendeeMetrics?.map((metric, index) => {
                return (
                  <tr key={index}>
                    <td>{metric.title}</td>
                    <td>
                      {metric.totalAttendees} ({metric.paidAttendees} ✦{" "}
                      {metric.freeAttendees})
                    </td>
                    <td>&#8358;{metric.totalRevenue.toLocaleString()}</td>
                    <td>
                      <Link
                        className="text-primary-color p-2 px-3 rounded-full bg-primary-color/5 hover:bg-primary-color/20"
                        href={`${ApplicationRoutes.EventTickets}/${metric.id}`}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        {attendeeMetrics.length == 0 && !isFetchingAttendeeMetrics && (
          <div className={"tableInfoUnavailable"}>
            <p>There is no data available</p>
          </div>
        )}
        {attendeeMetrics.length == 0 && isFetchingAttendeeMetrics && (
          <div className={"tableLoader"}>
            <ComponentLoader
              isSmallLoader
              customBackground="#fff"
              customLoaderColor="#111111"
            />
          </div>
        )}
      </div>
    </div>
  );
}
