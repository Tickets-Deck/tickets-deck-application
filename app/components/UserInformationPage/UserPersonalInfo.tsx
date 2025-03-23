import { ReactElement, FunctionComponent } from "react";
import UserAvatarContainer from "../ProfilePage/UserAvatarContainer";
import { UserCredentialsResponse } from "@/app/models/IUser";

interface UserPersonalInfoProps {
  userInformation: UserCredentialsResponse;
}

const UserPersonalInfo: FunctionComponent<UserPersonalInfoProps> = ({
  userInformation,
}): ReactElement => {
  console.log("🚀 ~ userInformation:", userInformation);
  return (
    <div className='flex flex-col items-center w-fit mx-auto gap-2'>
      <div>
        <UserAvatarContainer
          userInformation={userInformation}
          userAvatarSize={140}
        />
      </div>
      <div className='text-center'>
        <h3 className='text-2xl font-medium capitalize'>
          {userInformation?.firstName} {userInformation?.lastName}
        </h3>
        {userInformation?.username && (
          <p className='text-text-grey'>@{userInformation?.username}</p>
        )}
      </div>
    </div>
  );
};

export default UserPersonalInfo;
