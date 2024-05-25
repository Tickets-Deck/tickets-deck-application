import { ApplicationError } from "@/app/constants/applicationError";
import { FollowsActionType } from "@/app/models/IFollows";
import { StatusCodes } from "@/app/models/IStatusCodes";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

type FollowUserParams = {
  specifiedUserId: string;
  objectiveUserId: string;
};

/**
 * Function to unfollow a user
 * @param FollowUserParams is an object containing the specified user ID and the objective user ID
 * @returns the response object
 */
async function unFollowUser({
  specifiedUserId,
  objectiveUserId,
}: FollowUserParams) {
  // Check if the user is following the following user
  const isFollowing = await prisma.follows.findFirst({
    where: {
      followerId: specifiedUserId,
      followingId: objectiveUserId,
    },
  });

  // If the user is not following the following user, return 400
  if (!isFollowing) {
    return {
      error: ApplicationError.FollowerDoesNotFollowFollowee.Text,
      errorCode: ApplicationError.FollowerDoesNotFollowFollowee.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // Begin transaction
  await prisma.$transaction([
    // Delete the follow record
    prisma.follows.delete({
      where: {
        followerId_followingId: {
          followerId: specifiedUserId,
          followingId: objectiveUserId,
        },
      },
    }),

    // Update the following count of the subject user
    prisma.users.update({
      where: {
        id: specifiedUserId,
      },
      data: {
        followingCount: {
          decrement: 1,
        },
      },
    }),

    // Update the followers count of the objective user
    prisma.users.update({
      where: {
        id: objectiveUserId,
      },
      data: {
        followersCount: {
          decrement: 1,
        },
      },
    }),
  ]);

  // Return a success message with status 200
  return { message: "User unfollowed successfully" };
}

/**
 * Function to follow a user
 * @param param0 is an object containing the specified user ID and the objective user ID
 * @returns the response object
 */
async function followUser({
  specifiedUserId,
  objectiveUserId,
}: FollowUserParams) {
  // Check if the user is already following the following user
  const isFollowing = await prisma.follows.findFirst({
    where: {
      followerId: specifiedUserId,
      followingId: objectiveUserId,
    },
  });

  // If the user is already following the following user, return 400
  if (isFollowing) {
    return {
      error: ApplicationError.FollowerAlreadyFollowsFollowee.Text,
      errorCode: ApplicationError.FollowerAlreadyFollowsFollowee.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // Begin transaction
  await prisma.$transaction([
    // Create a new follow record
    prisma.follows.create({
      data: {
        followerId: specifiedUserId,
        followingId: objectiveUserId,
      },
    }),

    // Update the following count of the subject user
    prisma.users.update({
      where: {
        id: specifiedUserId,
      },
      data: {
        followingCount: {
          increment: 1,
        },
      },
    }),

    // Update the followers count of the objective user
    prisma.users.update({
      where: {
        id: objectiveUserId,
      },
      data: {
        followersCount: {
          increment: 1,
        },
      },
    }),
  ]);

  // Return a success message with status 201
  return { message: "User followed" };
}

export async function processFollowAction(req: NextRequest) {
  // Get the search params from the request url
  const searchParams = new URLSearchParams(req.url.split("?")[1]);

  // Get the user Id from the search params
  const specifiedUserId = searchParams.get("subjectiveUserId");

  // Get the following Id from the search params
  const objectiveUserId = searchParams.get("objectiveUserId");

  // Get the action type from the search params
  const actionType = searchParams.get("actionType");

  // Check if the specified user Id was provided
  if (!specifiedUserId) {
    return {
      error: ApplicationError.FollowerIdIsRequired.Text,
      errorCode: ApplicationError.FollowerIdIsRequired.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // Check if the following Id was provided
  if (!objectiveUserId) {
    return {
      error: ApplicationError.FolloweeIdIsRequired.Text,
      errorCode: ApplicationError.FolloweeIdIsRequired.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // Check if the specified user Id is the same as the objective user Id
  if (specifiedUserId === objectiveUserId) {
    return {
      error: ApplicationError.UserCannotFollowOrUnfollowThemselves.Text,
      errorCode: ApplicationError.UserCannotFollowOrUnfollowThemselves.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // Fetch the user with the specified user ID
  const user = await prisma.users.findFirst({
    where: {
      id: specifiedUserId,
    },
  });

  // If user is not found, return 404
  if (!user) {
    return {
      error: ApplicationError.FollowerWithIdNotFound.Text,
      errorCode: ApplicationError.FollowerWithIdNotFound.Code,
      statusCode: StatusCodes.NotFound,
    };
  }

  // Fetch the user with the specified following ID
  const followingUser = await prisma.users.findFirst({
    where: {
      id: objectiveUserId,
    },
  });

  // If following user is not found, return 404
  if (!followingUser) {
    return {
      error: ApplicationError.FolloweeWithIdNotFound.Text,
      errorCode: ApplicationError.FolloweeWithIdNotFound.Code,
      statusCode: StatusCodes.NotFound,
    };
  }

  if (actionType === FollowsActionType.Unfollow) {
    const response = await unFollowUser({ specifiedUserId, objectiveUserId });

    // If there was an error unfollowing the user, return the error
    if (response.error) {
      return {
        error: response.error,
        errorCode: response.errorCode,
        statusCode: response.statusCode,
      };
    }

    // Return the response
    return { message: response.message };
  }

  if (actionType === FollowsActionType.Follow) {
    const response = await followUser({ specifiedUserId, objectiveUserId });

    // If there was an error following the user, return the error
    if (response.error) {
      return {
        error: response.error,
        errorCode: response.errorCode,
        statusCode: response.statusCode,
      };
    }

    // Return the response
    return { message: response.message };
  }

  // If the action type is not recognized, return 400
  return {
    error: ApplicationError.InvalidActionType.Text,
    errorCode: ApplicationError.InvalidActionType.Code,
    statusCode: StatusCodes.BadRequest,
  };
}

// export async function getFollowersCount(req: NextRequest) {

//   // Get the search params from the request url
//   const searchParams = new URLSearchParams(req.url.split("?")[1]);

//   // Get the user Id from the search params
//   const userId = searchParams.get("userId");

//   // Check if the user Id was provided
//   if (!userId) {
//     return {
//       error: ApplicationError.UserIdIsRequired.Text,
//       errorCode: ApplicationError.UserIdIsRequired.Code,
//       statusCode: StatusCodes.BadRequest,
//     };
//   }

//   // Fetch the user with the specified user ID
//   const user = await prisma.users.findFirst({
//     where: {
//       id: userId,
//     },
//   });

//   // If user is not found, return 404
//   if (!user) {
//     return {
//       error: ApplicationError.UserWithIdNotFound.Text,
//       errorCode: ApplicationError.UserWithIdNotFound.Code,
//       statusCode: StatusCodes.NotFound,
//     };
//   }

//   // Return the followers count of the user
//   return { followersCount: user.followersCount };
// }

export async function getFollowersCount(req: NextRequest) {
  // Get the search params from the request url
  const searchParams = new URLSearchParams(req.url.split("?")[1]);

  // Get the userId from the search params
  const specifiedUserId = searchParams.get("objectiveUserId");

  // Get the subjectUserId from the search params ~ The logged in user
  const subjectUserId = searchParams.get("subjectUserId");

  // If the specified user's Id is not provided, return 400
  if (!specifiedUserId) {
    return {
      error: ApplicationError.FolloweeIdIsRequired.Text,
      errorCode: ApplicationError.FolloweeIdIsRequired.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // Fetch the user with the specified user ID
  const user = await prisma.users.findFirst({
    where: {
      id: specifiedUserId,
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

  // Fetch the number of the following users of the user
  const following = await prisma.follows.findMany({
    where: {
      followerId: specifiedUserId,
    },
  });

  // Fetch the number of the followers of the user
  const followers = await prisma.follows.findMany({
    where: {
      followingId: specifiedUserId,
    },
  });

  // Construct the statistics object
  const statistics = {
    following: following.length,
    followers: followers.length,
  };

  // If the subjectUserId is not provided ~ The user isn't logged in
  if (!subjectUserId) {
    // Return the number of the following users and the followers of the user
    return { data: statistics };
  }

  // If we get here, it means the subjectUserId is provided...

  // Check if the subject user (logged in user) is following the objective user
  // Fetch the user with the specified following ID
  const existingSubjectUser = await prisma.users.findFirst({
    where: {
      id: subjectUserId,
    },
  });

  // If following user is not found, return 404
  if (!existingSubjectUser) {
    return {
      error: ApplicationError.FollowerWithIdNotFound.Text,
      errorCode: ApplicationError.FollowerWithIdNotFound.Code,
      statusCode: StatusCodes.NotFound,
    };
  }

  // Check if the subjective user is following the objective user
  const isFollowing = await prisma.follows.findFirst({
    where: {
      followerId: subjectUserId,
      followingId: specifiedUserId,
    },
  });

  // Construct the statistics object
  const statisticsWithFollow = {
    ...statistics,
    isFollowing: isFollowing ? true : false,
  };

  // Return the number of the followee users and the followers of the user and if the logged-in user is following the objective user
  return { data: statisticsWithFollow };
}
