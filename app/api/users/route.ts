import { NextRequest, NextResponse } from "next/server";
import {
  createUser,
  fetchUsers,
  updateUser,
} from "../services/user/usersService";
import { customNextResponseError } from "../utils/customNextResponseError";
import { StatusCodes } from "@/app/models/IStatusCodes";
import { validateRequestMethod } from "../services/api-services/requestMethodValidator";
import { ApplicationError } from "@/app/constants/applicationError";

export async function GET(req: NextRequest) {
  // Call the request validation method
  await validateRequestMethod(req, "GET");

  try {
    // Call the function to fetch users
    const operation = await fetchUsers(req);

    // If the operation fails, return an error
    if (operation.error) {
      return customNextResponseError(operation);
    }

    // Return the response
    return NextResponse.json(operation.data, { status: StatusCodes.Success });
  } catch {
    // Return an error if the operation fails
    return NextResponse.json(
      { error: ApplicationError.FailedToFetchUsers.Text },
      { status: StatusCodes.InternalServerError }
    );
  }
}

export async function POST(req: NextRequest) {
  // Call the request validation method
  await validateRequestMethod(req, "POST");

  try {
    // Call the createUser function
    const operation = await createUser(req);

    // If the operation fails, return an error
    if (operation.error) {
      return customNextResponseError(operation);
    }

    // Return the response
    return NextResponse.json(operation.message, { status: StatusCodes.Created });
  } catch {
    // Return an error if the operation fails
    return NextResponse.json(
      { error: ApplicationError.FailedToVerifyEmail.Text },
      { status: StatusCodes.InternalServerError }
    );
  }
}

export async function PUT(req: NextRequest) {
  // Call the request validation method
  await validateRequestMethod(req, "PUT");

  try {
    // Call the updateUser function
    const operation = await updateUser(req);

    // If the operation fails, return an error
    if (operation.error) {
      return customNextResponseError(operation);
    }

    // Return the response
    return NextResponse.json(operation.data, { status: StatusCodes.Updated });
  } catch {
    // Return an error if the operation fails
    return NextResponse.json(
      { error: ApplicationError.FailedToUpdateUser.Text },
      { status: StatusCodes.InternalServerError }
    );
  }
}

// router.get("/posts/:id", async (req, res) => {
//   const { id } = req.params;

//   try {
//     if (!id) throw Error();
//     console.log("Here: ", id);
//     const post = await prisma.events.findFirstOrThrow({
//       where: { id: parseInt(id) },
//     });

//     res.status(200).json({post});
//   } catch (error) {
//     res.status(404).json({message: "No events found with provided ID"});
//   }
// });
