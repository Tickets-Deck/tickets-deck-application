import { FunctionComponent } from "react";
import UserInformationPage from "./OrganizerProfilePage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { UserCredentialsResponse } from "@/app/models/IUser";
import { useFetchUserInformationByUserName } from "@/app/api/apiClient";

interface UserInformationProps {
  params: { userId: string };
}

async function getUserData(
  userId: string
): Promise<UserCredentialsResponse | null> {
  const fetchUserInformationByUserName = useFetchUserInformationByUserName();
  try {
    const response = await fetchUserInformationByUserName(userId);
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
