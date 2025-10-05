import { FunctionComponent } from "react";
import UserInformationPage from "./OrganizerProfilePage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { UserCredentialsResponse } from "@/app/models/IUser";
import { useFetchUserInformationByUserName } from "@/app/api/apiClient";
import { ApiRoutes } from "@/app/api/apiRoutes";

interface UserInformationProps {
  params: { userId: string };
}

async function getUserData(
  userId: string
): Promise<UserCredentialsResponse | null> {
  // This page is a Server Component, so we need to fetch data directly.
  const apiBaseUrl = ApiRoutes.BASE_URL;
  const url = `${apiBaseUrl}/${ApiRoutes.FetchUserByUsername}/${userId}`;

  try {
    const res = await fetch(url, {
      // Using 'no-store' to ensure the profile is always fresh.
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch user data: ${res.statusText}`);
    }
    const response = await res.json();
    return response.data as UserCredentialsResponse;
  } catch (error) {
    console.error("Error fetching user info:", error);
    return null;
  }
}

const UserInformation: FunctionComponent<UserInformationProps> = async ({
  params,
}) => {
  const session = await getServerSession(authOptions);
  const identifier = params.userId;
  const userInformation = await getUserData(identifier);

  return (
    <UserInformationPage
      identifier={params.userId}
      session={session}
      initialUserInformation={userInformation}
    />
  );
};

export default UserInformation;
