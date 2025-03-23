import { UserCredentialsResponse } from "@/app/models/IUser";
import { ReactElement, FunctionComponent } from "react";

interface UserStatsProps {
  userInformation: UserCredentialsResponse;
}

const UserStats: FunctionComponent<UserStatsProps> = ({
  userInformation,
}): ReactElement => {
  return (
    <div className='flex gap-4 w-fit my-6 mx-auto'>
      <div className='flex flex-col items-center gap-1 pr-4 border-r-[0.5px] border-grey-3'>
        <p className='text-xl font-medium'>
          {userInformation.stats?.eventsCount || 0}
        </p>
        <p className=''>Events</p>
      </div>
      <div className='flex flex-col items-center gap-1 pr-4 border-r-[0.5px] border-grey-3'>
        <p className='text-xl font-medium'>
          {userInformation.stats?.followersCount || 0}
        </p>
        <p className='text-sm text-text-grey'>
          {userInformation.stats?.followersCount &&
          userInformation.stats?.followersCount > 1
            ? "Followers"
            : "Follower"}
        </p>
      </div>
      <div className='flex flex-col items-center gap-1 border-none pr-0'>
        <p className='text-xl font-medium'>
          {userInformation.stats?.followingCount || 0}
        </p>
        <p className='text-sm text-text-grey'>Following</p>
      </div>
    </div>
  );
};

export default UserStats;
