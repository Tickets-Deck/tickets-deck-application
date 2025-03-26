import { ReactElement, FunctionComponent } from "react";
import UserAvatarContainer from "../ProfilePage/UserAvatarContainer";
import styles from "@/app/styles/UserInformationPage.module.scss";
import { UserCredentialsResponse } from "@/app/models/IUser";
import { Icons } from "../ui/icons";
import Badge from "../ui/badge";

interface UserPersonalInfoProps {
    userInformation: UserCredentialsResponse
}

const UserPersonalInfo: FunctionComponent<UserPersonalInfoProps> = ({ userInformation }): ReactElement => {
    console.log("🚀 ~ userInformation:", userInformation);
    return (
        <div className="flex flex-col md:flex-row gap-6 -mt-20 md:-mt-16">
            <div className="z-10 flex flex-col items-center md:items-start">
                <UserAvatarContainer
                    userInformation={userInformation}
                    userAvatarSize={140}
                />
            </div>
            <div className="flex flex-col md:flex-row justify-between w-full mt-4 md:mt-16">
                <div className="space-y-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row items-center gap-2">
                        <h1 className="text-2xl md:text-3xl font-semibold capitalize">{userInformation.firstName + ' ' + userInformation.lastName}</h1>
                        <Badge
                            title="Organizer"
                            className="!mb-0"
                        />
                    </div>
                    {userInformation.username && <p className="text-white">@{userInformation.username}</p>}
                </div>
                <div className="flex justify-center md:justify-end gap-2 mt-4 md:mt-0">
                    <button className="primaryButtonOutline h-fit">
                        <Icons.Notification className="h-4 w-4 mr-2" />
                        Follow
                    </button>
                    <button className="primaryButtonOutline h-fit">
                        <Icons.Share className="h-4 w-4 mr-2" />
                        Share
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UserPersonalInfo;