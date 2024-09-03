import { ApplicationError } from "@/app/constants/applicationError";
import { StatusCodes } from "@/app/models/IStatusCodes";
import { prisma } from "@/lib/prisma";

export async function fetchAllTransactionFees() {
  const allTransactionFees = await prisma.transactionFees.findMany({
    select: {
      id: true,
      flatFee: true,
      percentage: true,
      events: {
        select: {
          title: true,
        },
      },
    },
  });

  if (!allTransactionFees) {
    // if there was an error fetching the transaction fees, return the error
    return {
      error: ApplicationError.FailedToFetchTransactionFees.Text,
      errorCode: ApplicationError.FailedToFetchTransactionFees.Code,
      statusCode: StatusCodes.InternalServerError,
    };
  }

  return { data: allTransactionFees };
}