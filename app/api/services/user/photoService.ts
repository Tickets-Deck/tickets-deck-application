import { ApplicationError } from "@/app/constants/applicationError";
import { StatusCodes } from "@/app/models/IStatusCodes";
import { CoverPhotoRequest, ProfilePhotoRequest } from "@/app/models/IUser";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import cloudinary from "cloudinary";
import { getServerSession } from "next-auth";

export async function uploadProfilePhoto(req: NextRequest) {
  // Get the search params from the request url
  const searchParams = new URLSearchParams(req.url.split("?")[1]);

  // Get the userId from the search params
  const userId = searchParams.get("userId");

  // Get the body of the request
  const request = (await req.json()) as ProfilePhotoRequest;

  // If userId is not provided, return 400
  if (!userId) {
    return {
      error: ApplicationError.UserIdIsRequired.Text,
      errorCode: ApplicationError.UserIdIsRequired.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // If profilePhoto is not provided, return 400
  if (!request.profilePhoto) {
    return {
      error: ApplicationError.ProfilePhotoIsRequired.Text,
      errorCode: ApplicationError.ProfilePhotoIsRequired.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // If profilePhoto is provided, find the current user with that id
  const user = await prisma.users.findUnique({
    where: {
      id: userId,
    },
  });

  // If user is not found, return 404
  if (!user) {
    return {
      error: ApplicationError.UserWithIdNotFound.Text,
      errorCode: ApplicationError.UserWithIdNotFound.Code,
      statusCode: StatusCodes.NotFound,
    };
  }

  // If user is found...
  try {
    // Get the current profile photo and profile photo public id
    const currentProfilePhotoPublicId = user.profilePhotoId;

    // Initialize updated user
    let updatedUser: any;

    // If current profile photo does not exist...
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
        updatedUser = await prisma.users.update({
          where: {
            id: userId,
          },
          data: {
            profilePhoto: uploadedProfilePhoto.secure_url,
            profilePhotoId: uploadedProfilePhoto.public_id,
          },
        });
      }
    }

    // If current profile photo exists...
    if (currentProfilePhotoPublicId) {
      // Delete it from cloudinary
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
        updatedUser = await prisma.users.update({
          where: {
            id: userId,
          },
          data: {
            profilePhoto: uploadedProfilePhoto.secure_url,
            profilePhotoId: uploadedProfilePhoto.public_id,
          },
        });
      }
    }

    // Return the updated user response
    return { data: updatedUser };
  } catch (error) {
    // console.error(error);
    return {
      error: ApplicationError.InternalServerError.Text,
      errorCode: ApplicationError.InternalServerError.Code,
      statusCode: StatusCodes.InternalServerError,
    };
  }
}

export async function uploadCoverPhoto(req: NextRequest) {
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
    return {
      error: ApplicationError.UserIdIsRequired.Text,
      errorCode: ApplicationError.UserIdIsRequired.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // If coverPhoto is not provided, return 400
  if (!request.coverPhoto) {
    return {
      error: ApplicationError.CoverPhotoIsRequired.Text,
      errorCode: ApplicationError.CoverPhotoIsRequired.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // If cover photo is provided, find the current user with that id
  const user = await prisma.users.findUnique({
    where: {
      id: userId,
    },
  });

  // If user is not found, return 404
  if (!user) {
    return {
      error: ApplicationError.UserWithIdNotFound.Text,
      errorCode: ApplicationError.UserWithIdNotFound.Code,
      statusCode: StatusCodes.NotFound,
    };
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
    return { data: updatedUser };
  } catch (error) {
    return {
      error: ApplicationError.InternalServerError.Text,
      errorCode: ApplicationError.InternalServerError.Code,
      statusCode: StatusCodes.InternalServerError,
    };
  }
}
