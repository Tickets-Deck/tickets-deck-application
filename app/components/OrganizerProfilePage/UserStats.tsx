import { UserStats } from "@/app/models/IUser";
import { ReactElement, FunctionComponent } from "react";

interface UserStatsElemProps {
    stats: UserStats
}

const UserStatsElem: FunctionComponent<UserStatsElemProps> = ({ stats }): ReactElement => {
    return (
        <div className="flex justify-center md:justify-start gap-8 mt-6 md:mt-8 border-b border-border/40 pb-6">
            <div className="flex flex-col items-center md:items-start">
                <span className="text-2xl font-bold">{stats.eventsCount || 0}</span>
                <span className="text-sm text-white">{stats.eventsCount > 1 ? "Events" : "Event"}</span>
            </div>
            <div className="flex flex-col items-center md:items-start">
                <span className="text-2xl font-bold">{stats.followersCount || 0}</span>
                <span className="text-sm text-white">{stats.followersCount > 1 ? "Followers" : "Follower"}</span>
            </div>
            <div className="flex flex-col items-center md:items-start">
                <span className="text-2xl font-bold">{stats.followingCount || 0}</span>
                <span className="text-sm text-white">Following</span>
            </div>
        </div>
    );
}

export default UserStatsElem;