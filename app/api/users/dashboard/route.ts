import { DashboardInfoResponse } from "@/app/models/IDashboardInfoResponse";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  if (req.method === "GET") {
    // Get the search params from the request url
    const searchParams = new URLSearchParams(req.url.split("?")[1]);

    // Get the userId from the search params
    const userId = searchParams.get("userId");

    // If a userId is provided, find the user with that id
    if (userId) {
      const user = await prisma.users.findUnique({
        where: {
          id: userId,
        },
      });

      // If the user is found, return the user
      if (user) {

        // Construct the dashboard data
        const dashboardData: DashboardInfoResponse = {
          ticketsBought: user?.ticketsBought,
          ticketsSold: user?.ticketsSold,
          totalRevenue: Number(user?.totalRevenue),
          totalEvents: user.eventsCount,
          totalEventLikes: user.favoritesCount,
          totalEventShares: 0,
          totalEventViews: 0,
        };

        // Return the dashboard data
        return NextResponse.json(dashboardData);
      } else {
        // If the user is not found, return 404
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
    } else {
      // If no userId is provided, return 400
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
  }
}
