import { ProfilePhotoRequest } from "@/app/models/IUser";
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
    const request = (await req.json()) as ProfilePhotoRequest;

    // If a userId is provided...
    if (userId) {
      // If profilePhoto is not provided, return 400
      if (!request.profilePhoto) {
        return NextResponse.json(
          { error: "Profile photo is required" },
          { status: 400 }
        );
      }

      // If profilePhoto is provided, find the current user with that id
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
        // If user is found, get the current profile photo and profile photo public id
        const currentProfilePhotoPublicId = user.profilePhotoId;

        if (!currentProfilePhotoPublicId) {
          const _imagebase64Url = request.profilePhoto;

          var uploadStr = "data:image/jpeg;base64," + _imagebase64Url;

          const uploadedProfilePhoto = await cloudinary.v2.uploader.upload(
            uploadStr,
            {
              folder: "profile_photos",
              filename_override: `${user.firstName}_${user.lastName}`,
              // use_filename: true,
            }
          );

          // If uploaded profile photo is found, update the user's profile photo and profile photo id
          if (uploadedProfilePhoto) {
            await prisma.users.update({
              where: {
                id: userId,
              },
              data: {
                profilePhoto: uploadedProfilePhoto.secure_url,
                profilePhotoId: uploadedProfilePhoto.public_id,
              },
            });

            // Update the user's session with the new profile photo
            // update({ user: { ...session?.user, image: uploadedProfilePhoto.secure_url } })
            // await updateSession(session, { user: updatedUser });
          }
        }

        // If current profile photo exists, delete it from cloudinary
        if (currentProfilePhotoPublicId) {
          await cloudinary.v2.uploader.destroy(currentProfilePhotoPublicId);

          const _imagebase64Url = request.profilePhoto;

          var uploadStr = "data:image/jpeg;base64," + _imagebase64Url;

          // Upload the new profile photo to cloudinary
          const uploadedProfilePhoto = await cloudinary.v2.uploader.upload(
            uploadStr,
            {
              folder: "profile_photos",
              filename_override: `${user.firstName}_${user.lastName}`,
              // use_filename: true,
            }
          );

          // If uploaded profile photo is found, update the user's profile photo and profile photo id
          if (uploadedProfilePhoto) {
            await prisma.users.update({
              where: {
                id: userId,
              },
              data: {
                profilePhoto: uploadedProfilePhoto.secure_url,
                profilePhotoId: uploadedProfilePhoto.public_id,
              },
            });

            // Update the user's session with the new profile photo
            // update({ user: { ...session?.user, image: uploadedProfilePhoto.secure_url } })
            // await updateSession(session, { user: updatedUser });
          }
        }

        // Return the updated user response
        return NextResponse.json(user, { status: 200 });
      } catch (error) {
        console.error(error);
        return NextResponse.json(
          { error: "Something went wrong" },
          { status: 500 }
        );
      }
    }
  }
}
