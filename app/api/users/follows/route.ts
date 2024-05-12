import { FollowsActionType } from "@/app/models/IFollows";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // If request method is not GET, return 405
  if (req.method != "GET") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  // Get the search params from the request url
  const searchParams = new URLSearchParams(req.url.split("?")[1]);

  // Get the userId from the search params
  const specifiedUserId = searchParams.get("objectiveUserId");

  // Get the subjectUserId from the search params ~ The logged in user
  const subjectUserId = searchParams.get("subjectUserId");

  // If a specified user's Id is provided, fetch the number of the following users of the user with that user's Id
  if (specifiedUserId) {
    // Fetch the user with the specified user ID
    const user = await prisma.users.findFirst({
      where: {
        id: specifiedUserId,
        // OR: [
        //   { username: specifiedUserIdOrUsername },
        //   { id: specifiedUserIdOrUsername },
        // ],
      },
    });

    // If user is not found, return 404
    if (!user) {
      return NextResponse.json(
        { error: "User with specified User ID not found" },
        { status: 404 }
      );
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

    // If the subject user's Id is provided, check if the subject user is following the objective user
    if (subjectUserId) {
      // Fetch the user with the specified following ID
      const existingSubjectUser = await prisma.users.findFirst({
        where: {
          id: subjectUserId,
        },
      });

      // If following user is not found, return 404
      if (!existingSubjectUser) {
        return NextResponse.json(
          { error: "Subject user with specified following ID not found" },
          { status: 404 }
        );
      }

      // Check if the subjective user is following the objective user
      const isFollowing = await prisma.follows.findFirst({
        where: {
          followerId: subjectUserId,
          followingId: specifiedUserId,
        },
      });

      // Return the number of the following users and the followers of the user and if the user is following the objective user
      return NextResponse.json({
        following: following.length,
        followers: followers.length,
        isFollowing: isFollowing ? true : false,
      });
    }

    // Return the number of the following users and the followers of the user
    return NextResponse.json({
      following: following.length,
      followers: followers.length,
    });
  }
}

export async function POST(req: NextRequest) {
  // If method

  if (req.method === "POST") {
    // Get the search params from the request url
    const searchParams = new URLSearchParams(req.url.split("?")[1]);

    // Get the user Id from the search params
    const specifiedUserId = searchParams.get("subjectiveUserId");

    // Get the following Id from the search params
    const objectiveUserId = searchParams.get("objectiveUserId");

    // Get the action type from the search params
    const actionType = searchParams.get("actionType");

    // If a specified user's Id and a following user's Id are provided, create a new follow record
    if (specifiedUserId && objectiveUserId) {
      // Fetch the user with the specified user ID
      const user = await prisma.users.findFirst({
        where: {
          id: specifiedUserId,
        },
      });

      // If user is not found, return 404
      if (!user) {
        return NextResponse.json(
          { error: "User with specified User ID not found" },
          { status: 404 }
        );
      }

      // Fetch the user with the specified following ID
      const followingUser = await prisma.users.findFirst({
        where: {
          id: objectiveUserId,
        },
      });

      // If following user is not found, return 404
      if (!followingUser) {
        return NextResponse.json(
          { error: "Following user with specified following ID not found" },
          { status: 404 }
        );
      }

      if (actionType === FollowsActionType.Unfollow) {
        // Check if the user is following the following user
        const isFollowing = await prisma.follows.findFirst({
          where: {
            followerId: specifiedUserId,
            followingId: objectiveUserId,
          },
        });

        // If the user is not following the following user, return 400
        if (!isFollowing) {
          return NextResponse.json(
            { error: "User is not following the following user" },
            { status: 400 }
          );
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
        return NextResponse.json(
          { message: "User unfollowed successfully" },
          { status: 200 }
        );
      }

      if (actionType === FollowsActionType.Follow) {
        // Check if the user is already following the following user
        const isFollowing = await prisma.follows.findFirst({
          where: {
            followerId: specifiedUserId,
            followingId: objectiveUserId,
          },
        });

        // If the user is already following the following user, return 400
        if (isFollowing) {
          return NextResponse.json(
            { error: "User is already following the following user" },
            { status: 400 }
          );
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
        return NextResponse.json({ message: "User followed" }, { status: 200 });
      }
    }
  } else {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
}
