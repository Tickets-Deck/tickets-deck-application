import { NextResponse } from "next/server";

interface IOperation {
  error: string;
  errorCode?: string;
  statusCode: number;
  message?: undefined;
}

export function customNextResponseError(operation: IOperation) {
  return NextResponse.json(
    {
      error: operation.error,
      errorCode: operation.errorCode,
    },
    { status: operation.statusCode }
  );
}
