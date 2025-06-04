import { ApplicationRoutes } from "@/app/constants/applicationRoutes";
import Link from "next/link";
import React from "react";
import { Icons } from "../../ui/icons";
import { DashboardInfoResponse } from "@/app/models/IDashboardInfoResponse";

type Props = {
  dashboardInfo: DashboardInfoResponse;
};

export default function KpiSection({ dashboardInfo }: Props) {
  return (
    <div className="flex gap-4 flex-wrap flex-col md:flex-row md:flex-nowrap">
      <Link
        href={ApplicationRoutes.Events}
        className="w-full md:w-[25%] bg-dark-grey rounded-lg p-4 flex hover:opacity-65 items-start gap-2"
      >
        <span className="size-10 rounded bg-dark-grey-2 grid place-items-center [&_svg_path]:fill-white">
          <Icons.Event />
        </span>
        <div className="flex flex-col gap-2">
          <h4 className="text-2xl font-medium leading-[22px] text-white">
            {dashboardInfo.totalEvents}
          </h4>
          <p className="text-sm text-white/50">
            Total {dashboardInfo.totalEvents > 1 ? "Events" : "Event"}
          </p>
        </div>
      </Link>
      <Link
        href={`${ApplicationRoutes.EventTickets}?t=0`}
        className="w-full md:w-[25%] bg-dark-grey rounded-lg p-4 flex hover:opacity-65 items-start gap-2"
      >
        <span className="size-10 rounded bg-dark-grey-2 grid place-items-center [&_svg_path]:fill-white">
          <Icons.Event />
        </span>
        <div className="flex flex-col gap-2">
          <h4 className="text-2xl font-medium leading-[22px] text-white">
            {dashboardInfo.ticketsBought}
          </h4>
          <p className="text-sm text-white/50">Tickets Bought</p>
        </div>
      </Link>
      <Link
        href={`${ApplicationRoutes.EventTickets}?t=1`}
        className="w-full md:w-[25%] bg-dark-grey rounded-lg p-4 flex hover:opacity-65 items-start gap-2"
      >
        <span className="size-10 rounded bg-dark-grey-2 grid place-items-center [&_svg_path]:fill-white">
          <Icons.Event />
        </span>
        <div className="flex flex-col gap-2">
          <h4 className="text-2xl font-medium leading-[22px] text-white">
            {dashboardInfo.ticketsSold}
          </h4>
          <p className="text-sm text-white/50">Tickets Sold</p>
        </div>
      </Link>
      <Link
        href={ApplicationRoutes.Wallet}
        className="w-full md:w-[25%] bg-dark-grey rounded-lg p-4 flex hover:opacity-65 items-start gap-2"
      >
        <span className="size-10 rounded bg-dark-grey-2 grid place-items-center [&_svg_path]:fill-white">
          <Icons.Event />
        </span>
        <div className="flex flex-col gap-2">
          <h4 className="text-2xl font-medium leading-[22px] text-white">
            &#8358;{dashboardInfo.totalRevenue.toLocaleString()}
          </h4>
          <p className="text-sm text-white/50">Total Revenue</p>
        </div>
      </Link>
    </div>
  );
}
