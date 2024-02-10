import { ReactElement, FunctionComponent } from "react";
import { FacebookIcon, InstagramIcon, TwitterIcon } from "../SVGs/SVGicons";
import Link from "next/link";
import styles from "@/app/styles/UserInformationPage.module.scss";
import { UserCredentialsResponse } from "@/app/models/IUser";

interface UserSocialsProps {
    userInformation: UserCredentialsResponse
}

const UserSocials: FunctionComponent<UserSocialsProps> = ({ userInformation }): ReactElement => {
    return (
        <div className={styles.userSocials}>
            {
                userInformation.facebookUrl &&
                <Link href={userInformation.facebookUrl} target="_blank">
                    <span><FacebookIcon /></span>
                </Link>
            }
            {
                userInformation.instagramUrl &&
                <Link href={userInformation.instagramUrl} target="_blank">
                    <span><InstagramIcon /></span>
                </Link>
            }
            {
                userInformation.twitterUrl &&
                <Link href={userInformation.twitterUrl} target="_blank">
                    <span><TwitterIcon /></span>
                </Link>
            }
        </div>
    );
}

export default UserSocials;