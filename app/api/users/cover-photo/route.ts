import { CoverPhotoRequest, ProfilePhotoRequest } from "@/app/models/IUser";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";

export async function POST(req: NextRequest) {
  if (req.method === "POST") {
    // Get the search params from the request url
    const searchParams = new URLSearchParams(req.url.split("?")[1]);

    const session = await getServerSession();
    // const { update } = useSession();

    // Get the userId from the search params
    const userId = searchParams.get("userId");

    // Get the body of the request
    const request = (await req.json()) as CoverPhotoRequest;

    // If userId is not provided, return 400
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // If coverPhoto is not provided, return 400
    if (!request.coverPhoto) {
      return NextResponse.json(
        { error: "Cover photo is required" },
        { status: 400 }
      );
    }

    // If cover photo is provided, find the current user with that id
    const user = await prisma.users.findUnique({
      where: {
        id: userId,
      },
    });

    // If user is not found, return 404
    if (!user) {
      return NextResponse.json(
        { error: "User with specified User ID not found" },
        { status: 404 }
      );
    }

    try {
      // If user is found, get the current cover photo and cover photo public id
      const currentCoverPhotoPublicId = user.coverPhotoId;

      // Initialize updated user
      let updatedUser: any;

      if (!currentCoverPhotoPublicId) {
        const _imagebase64Url = request.coverPhoto;

        var uploadStr = "data:image/jpeg;base64," + _imagebase64Url;

        const uploadedCoverPhoto = await cloudinary.v2.uploader.upload(
          uploadStr,
          {
            folder: "cover_photos",
            filename_override: `${user.firstName}_${user.lastName}_cover_photo`,
            // use_filename: true,
          }
        );

        // If uploaded cover photo is found, update the user's cover photo and cover photo id
        if (uploadedCoverPhoto) {
          updatedUser = await prisma.users.update({
            where: {
              id: userId,
            },
            data: {
              coverPhoto: uploadedCoverPhoto.secure_url,
              coverPhotoId: uploadedCoverPhoto.public_id,
            },
          });
        }
      }

      // If current cover photo exists, delete it from cloudinary
      if (currentCoverPhotoPublicId) {
        await cloudinary.v2.uploader.destroy(currentCoverPhotoPublicId);

        const _imagebase64Url = request.coverPhoto;

        var uploadStr = "data:image/jpeg;base64," + _imagebase64Url;

        // Upload the new cover photo to cloudinary
        const uploadedCoverPhoto = await cloudinary.v2.uploader.upload(
          uploadStr,
          {
            folder: "cover_photos",
            filename_override: `${user.firstName}_${user.lastName}_cover_photo`,
            // use_filename: true,
          }
        );

        // If uploaded cover photo is found, update the user's cover photo and cover photo id
        if (uploadedCoverPhoto) {
          updatedUser = await prisma.users.update({
            where: {
              id: userId,
            },
            data: {
              coverPhoto: uploadedCoverPhoto.secure_url,
              coverPhotoId: uploadedCoverPhoto.public_id,
            },
          });
        }
      }

      // Return the updated user response
      return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Something went wrong" },
        { status: 500 }
      );
    }
  }
}
