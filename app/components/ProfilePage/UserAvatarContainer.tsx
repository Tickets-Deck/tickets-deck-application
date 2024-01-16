import Image from "next/image";
import { FunctionComponent, ReactElement, Dispatch, SetStateAction } from "react";
import styles from "../../styles/ProfilePage.module.scss"
import { UserCredentialsResponse } from "@/app/models/IUser";
import { EditIcon } from "../SVGs/SVGicons";

interface UserAvatarContainerProps {
    userInformation: UserCredentialsResponse;
    setIsPhotoUploadModalVisible: Dispatch<SetStateAction<boolean>>
}

const UserAvatarContainer: FunctionComponent<UserAvatarContainerProps> = ({ userInformation, setIsPhotoUploadModalVisible }): ReactElement => {
    return (
        <div className={styles.userAvatarContainer}>
            <div className={styles.userAvatar}>
                <Image
                    src={
                        userInformation.profilePhoto ??
                        `https://placehold.co/300x300/8133F1/FFFFFF/png?text=${userInformation.firstName[0]}${userInformation.lastName[0]}`
                    }
                    alt="avatar"
                    fill
                />
            </div>
            <span className={styles.editIcon} onClick={() => setIsPhotoUploadModalVisible(true)}><EditIcon /></span>
        </div>
    );
}

export default UserAvatarContainer;