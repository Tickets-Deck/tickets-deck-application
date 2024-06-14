import { ApplicationError } from "@/app/constants/applicationError";
import { StatusCodes } from "@/app/models/IStatusCodes";
import { NextRequest, NextResponse } from "next/server";

export async function validateRequestMethod(req: NextRequest, method: string) {
  if (req.method !== method) {
    return NextResponse.json(
      { error: ApplicationError.MethodNotAllowed.Text },
      { status: StatusCodes.MethodNotAllowed }
    );
  }
}
