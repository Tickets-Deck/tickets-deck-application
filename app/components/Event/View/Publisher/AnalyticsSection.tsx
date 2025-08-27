import { useFetchDailyTicketSales } from "@/app/api/apiClient";
import EventSalesTrendChart, {
  DailyTicketSales,
  generateMockSalesData,
  generateSalesTrendData,
} from "@/app/components/charts/EventSalesTrend";
import TicketDistributionChart, {
  generateTicketDistributionData,
} from "@/app/components/charts/TicketDistribution";
import { EventResponse } from "@/app/models/IEvents";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

type Props = {
  eventInfo: EventResponse;
  previousEventInfo: EventResponse | null;
};

export default function AnalyticsSection({
  eventInfo,
  previousEventInfo,
}: Props) {
  const fetchDailyTicketSales = useFetchDailyTicketSales();
  const { data: session } = useSession();
  const user = session?.user;

  const [dailyTicketSales, setDailyTicketSales] = useState<DailyTicketSales[]>(
    []
  );
  const [isLoadingSalesTrend, setIsLoadingSalesTrend] = useState(true);

  const calculatePercentageChange = (
    current: number,
    previous: number
  ): { value: string; isPositive: boolean } | null => {
    if (previous === 0) {
      if (current > 0) {
        return { value: `+${current.toLocaleString()}`, isPositive: true }; // Or some other indicator for new growth
      }
      return null; // No change from zero
    }
    if (current === previous || isNaN(previous)) {
      return null;
    }
    const change = ((current - previous) / previous) * 100;
    if (Math.abs(change) < 0.01) return null; // Negligible change

    const sign = change > 0 ? "+" : "";
    return {
      value: `${sign}${change.toFixed(0)}%`,
      isPositive: change >= 0,
    };
  };

  const netEarningsChange = previousEventInfo
    ? calculatePercentageChange(
        Number(eventInfo.netEarnings ?? 0),
        Number(previousEventInfo.netEarnings)
      )
    : null;

  const ticketsSoldChange = previousEventInfo
    ? calculatePercentageChange(
        eventInfo.ticketOrdersCount ?? 0,
        previousEventInfo.ticketOrdersCount
      )
    : null;

  const engagementCount = eventInfo.bookmarksCount + eventInfo.favoritesCount;
  const prevEngagementCount =
    (previousEventInfo?.bookmarksCount ?? 0) +
    (previousEventInfo?.favoritesCount ?? 0);

  const engagementChange = previousEventInfo
    ? calculatePercentageChange(engagementCount, prevEngagementCount)
    : null;

  const handleFetchDailyTicketSales = async () => {
    setIsLoadingSalesTrend(true);
    await fetchDailyTicketSales(
      user?.token as string,
      eventInfo.id,
      eventInfo.publisherId
    )
      .then((response) => {
        setDailyTicketSales(response.data);
      })
      .catch((error) => {
        console.error("Error fetching daily ticket sales:", error);
      })
      .finally(() => {
        setIsLoadingSalesTrend(false);
      });
  };

  useEffect(() => {
    handleFetchDailyTicketSales();
  }, [user, eventInfo.id]);

  return (
    <div className="bg-[#1e1e1e] border-[2px] border-container-grey p-5 rounded-xl">
      <div className="mb-4">
        <h4 className="text-2xl font-medium">Event Analytics</h4>
        <p className="text-gray-400">
          Track performance and engagement metrics
        </p>
      </div>

      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* <div className="bg-[#252525] p-4 rounded-lg">
                        <p className="text-sm text-gray-400">Total Revenue</p>
                        <p className="text-2xl font-bold">
                            {eventInfo.currency}{" "}
                            {eventInfo.tickets
                                .reduce((acc, ticket) => acc + (ticket.price * ticket.ticketOrdersCount), 0)
                                .toLocaleString()}
                        </p>
                        <p className="text-xs text-green-400 mt-1">+12% from previous event</p>
                    </div> */}
          <div className="bg-[#252525] p-4 rounded-lg">
            <p className="text-sm text-gray-400">Net Earnings</p>
            <p className="text-2xl font-bold">
              {eventInfo.currency} {eventInfo.netEarnings}
            </p>
            {netEarningsChange && (
              <p
                className={`text-xs mt-1 ${
                  netEarningsChange.isPositive
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {netEarningsChange.value} from previous event
              </p>
            )}
          </div>
          <div className="bg-[#252525] p-4 rounded-lg">
            <p className="text-sm text-gray-400">Tickets Sold</p>
            <p className="text-2xl font-bold">{eventInfo.ticketOrdersCount}</p>
            {ticketsSoldChange && (
              <p
                className={`text-xs mt-1 ${
                  ticketsSoldChange.isPositive
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {ticketsSoldChange.value} from previous event
              </p>
            )}
          </div>
          <div className="bg-[#252525] p-4 rounded-lg">
            <p className="text-sm text-gray-400">Engagement</p>
            <p className="text-2xl font-bold">{engagementCount}</p>
            {engagementChange && (
              <p
                className={`text-xs mt-1 ${
                  engagementChange.isPositive
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {engagementChange.value} from previous event
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-6">
          <div className="bg-[#252525] rounded-lg p-4 md:col-span-4">
            <h3 className="text-lg font-medium">Ticket Sales Trend</h3>
            <p className="text-sm text-gray-400 mb-4">
              Daily ticket sales over the last 30 days
            </p>
            {isLoadingSalesTrend ? (
              <div className="h-[300px] flex items-center justify-center text-gray-400">
                Loading sales trend...
              </div>
            ) : (
              <EventSalesTrendChart
                data={generateSalesTrendData(
                  dailyTicketSales,
                  eventInfo.tickets
                )}
                height={300}
              />
            )}
          </div>

          <div className="bg-[#252525] rounded-lg p-4 md:col-span-2 h-fit">
            <h3 className="text-lg font-semibold mb-4">
              Ticket Type Distribution
            </h3>
            <TicketDistributionChart
              data={generateTicketDistributionData(eventInfo.tickets)}
              height={220}
            />
          </div>
        </div>

        {/* <div className="h-64 flex items-center justify-center bg-[#252525] rounded-lg mb-6">
                    <p className="text-gray-400">Sales trend chart would appear here</p>
                </div> */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 bg-[#252525] rounded-lg">
            <h3 className="text-lg font-semibold mb-4">
              Ticket Type Distribution
            </h3>
            <div className="space-y-4">
              {eventInfo.tickets.map((ticket) => (
                <div key={ticket.id}>
                  <div className="flex justify-between mb-1">
                    <span>{ticket.name}</span>
                    <span>{ticket.ticketOrdersCount} sold</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div
                      className="bg-purple-600 h-2.5 rounded-full"
                      style={{
                        width: `${
                          (ticket.ticketOrdersCount /
                            eventInfo.ticketOrdersCount) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 bg-[#252525] rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Engagement Metrics</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Bookmarks</span>
                  <span>{eventInfo.bookmarksCount}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{
                      width: `${
                        (eventInfo.bookmarksCount /
                          (eventInfo.bookmarksCount +
                            eventInfo.favoritesCount)) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Favorites</span>
                  <span>{eventInfo.favoritesCount}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-pink-600 h-2.5 rounded-full"
                    style={{
                      width: `${
                        (eventInfo.favoritesCount /
                          (eventInfo.bookmarksCount +
                            eventInfo.favoritesCount)) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
