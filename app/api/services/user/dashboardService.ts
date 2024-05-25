import { ApplicationError } from "@/app/constants/applicationError";
import { DashboardInfoResponse } from "@/app/models/IDashboardInfoResponse";
import { StatusCodes } from "@/app/models/IStatusCodes";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function fetchDashboardData(req: NextRequest) {
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
      return { data: dashboardData };
    } else {
      // If the user is not found, return 404
      return {
        error: ApplicationError.UserWithIdNotFound.Text,
        errorCode: ApplicationError.UserWithIdNotFound.Code,
        statusCode: StatusCodes.BadRequest,
      };
    }
  } else {
    // If no userId is provided, return 400
    return {
      error: ApplicationError.UserIdIsRequired.Text,
      errorCode: ApplicationError.UserIdIsRequired.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }
}
