import { NextRequest, NextResponse } from "next/server";
import { ApplicationError } from "@/app/constants/applicationError";
import { StatusCodes } from "@/app/models/IStatusCodes";
import { fetchTicketSoldMetrics } from "@/app/api/services/user/dashboardService";
import { validateRequestMethod } from "@/app/api/services/reusable-services/requestMethodValidator";
import { customNextResponseError } from "@/app/api/utils/customNextResponseError";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // validate request method
  await validateRequestMethod(req, "GET");

  try {
    // Call the function to fetch the user dashboard data
    const operation = await fetchTicketSoldMetrics(req);

    // If operation fails, return the error
    if (operation.error) {
      return customNextResponseError(operation);
    }

    // Return the response
    return NextResponse.json(operation.data, { status: StatusCodes.Success });
  } catch(error) {
    console.log("🚀 ~ GET ~ error:", error)
    // Return an error if the operation fails
    return NextResponse.json(
      { error: ApplicationError.FailedToFetchUserDashboardData.Text },
      { status: StatusCodes.InternalServerError }
    );
  }
}
