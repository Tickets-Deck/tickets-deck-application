import { ApplicationError } from "@/app/constants/applicationError";
import { StatusCodes } from "@/app/models/IStatusCodes";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function verifyCouponCode(eventId: string, couponCode: string) {
  // check if the eventId, and couponCode are provided
  if (!eventId || !couponCode) {
    return {
      error: ApplicationError.MissingRequiredParameters.Text,
      errorCode: ApplicationError.MissingRequiredParameters.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // check if there is an event with the provided eventId
  //   const event = await prisma.events.findFirst({
  //     where: {
  //       eventId: eventId,
  //     },
  //     select: {
  //       id: true,
  //     },
  //   });

  //   // if the event does not exist, return an error
  //   if (!event) {
  //     return {
  //       error: ApplicationError.EventWithIdNotFound.Text,
  //       errorCode: ApplicationError.EventWithIdNotFound.Code,
  //       statusCode: StatusCodes.BadRequest,
  //     };
  //   }

  // check if the coupon code exists, still has maximum uses, and is not expired
  const coupon = await prisma.couponCodes.findFirst({
    where: {
      code: couponCode.match(/^[0-9A-Z]+$/g)?.join(""),
      events: {
        some: {
          eventId: eventId,
        },
      },
      maxUsage: {
        gt: 0,
      },
    //   validUntil: {
    //     gte: new Date(),
    //   },
    },
    select: {
      id: true,
      code: true,
      discount: true,
      maxUsage: true,
      validUntil: true,
    },
  });

  // if the coupon has expired, return an error
  if (coupon && new Date(coupon.validUntil) < new Date()) {
    return {
      error: ApplicationError.InvalidCouponExpirationDate.Text,
      errorCode: ApplicationError.InvalidCouponExpirationDate.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // if the coupon code does not exist, has expired, or has reached maximum uses, return an error
  if (!coupon) {
    return {
      error: ApplicationError.InvalidCouponDiscount.Text,
      errorCode: ApplicationError.InvalidCouponDiscount.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  return { data: coupon };
}

// export async function applyCoupon() {}
