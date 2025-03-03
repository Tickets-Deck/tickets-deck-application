import { ReactElement, FunctionComponent } from "react";
import { Icons } from "../ui/icons";
import Link from "next/link";
import styles from "@/app/styles/UserInformationPage.module.scss";
import { UserCredentialsResponse } from "@/app/models/IUser";

interface UserSocialsProps {
    userInformation: UserCredentialsResponse
}

const UserSocials: FunctionComponent<UserSocialsProps> = ({ userInformation }): ReactElement => {

    const facebookUrl = userInformation.socialLinks?.facebookUrl;
    const instagramUrl = userInformation.socialLinks?.instagramUrl;
    const twitterUrl = userInformation.socialLinks?.twitterUrl;

    const linkStartsWithHttp = (link: string) => {
        if (link.startsWith("https")) {
            return link;
        }
        return `https://${link}`;
    }

    return (
        <div className={styles.userSocials}>
            {
                facebookUrl &&
                <Link href={linkStartsWithHttp(facebookUrl)} target="_blank">
                    <span><Icons.Facebook /></span>
                </Link>
            }
            {
                instagramUrl &&
                <Link href={linkStartsWithHttp(instagramUrl)} target="_blank">
                    <span><Icons.Instagram /></span>
                </Link>
            }
            {
                twitterUrl &&
                <Link href={linkStartsWithHttp(twitterUrl)} target="_blank">
                    <span><Icons.Twitter /></span>
                </Link>
            }
        </div >
    );
}

export default UserSocials;