import { ReactElement, FunctionComponent } from "react";
import { Icons } from "../ui/icons";
import Link from "next/link";
import styles from "@/app/styles/UserInformationPage.module.scss";
import { UserCredentialsResponse } from "@/app/models/IUser";

interface UserSocialsProps {
    userInformation: UserCredentialsResponse
}

const UserSocials: FunctionComponent<UserSocialsProps> = ({ userInformation }): ReactElement => {

    const linkStartsWithHttp = (link: string) => {
        if (link.startsWith("https")) {
            return link;
        }
        return `https://${link}`;
    }

    return (
        <div className={styles.userSocials}>
            {
                userInformation.facebookUrl &&
                <Link href={linkStartsWithHttp(userInformation.facebookUrl)} target="_blank">
                    <span><Icons.Facebook /></span>
                </Link>
            }
            {
                userInformation.instagramUrl &&
                <Link href={linkStartsWithHttp(userInformation.instagramUrl)} target="_blank">
                    <span><Icons.Instagram /></span>
                </Link>
            }
            {
                userInformation.twitterUrl &&
                <Link href={linkStartsWithHttp(userInformation.twitterUrl)} target="_blank">
                    <span><Icons.Twitter /></span>
                </Link>
            }
        </div >
    );
}

export default UserSocials;