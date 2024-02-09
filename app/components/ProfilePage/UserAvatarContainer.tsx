import Image from "next/image";
import { FunctionComponent, ReactElement, Dispatch, SetStateAction } from "react";
import styles from "../../styles/userAvatarContainer.module.scss"
import { UserCredentialsResponse } from "@/app/models/IUser";
import { EditIcon } from "../SVGs/SVGicons";

interface UserAvatarContainerProps {
    userInformation: UserCredentialsResponse;
    setIsPhotoUploadModalVisible?: Dispatch<SetStateAction<boolean>>
    userAvatarSize?: number;
}

const UserAvatarContainer: FunctionComponent<UserAvatarContainerProps> = ({ userInformation, setIsPhotoUploadModalVisible, userAvatarSize }): ReactElement => {
    return (
        <div className={styles.userAvatarContainer}>
            <div className={styles.userAvatar} style={userAvatarSize ? { width: `${userAvatarSize}px`, height: `${userAvatarSize}px` } : {}}>
                <Image
                    src={
                        userInformation.profilePhoto ??
                        `https://placehold.co/300x300/8133F1/FFFFFF/png?text=${userInformation.firstName[0].toUpperCase()}${userInformation.lastName[0].toUpperCase()}`
                    }
                    alt="avatar"
                    fill
                />
            </div>
            {setIsPhotoUploadModalVisible && <span className={styles.editIcon} onClick={() => setIsPhotoUploadModalVisible(true)}><EditIcon /></span>}
        </div>
    );
}

export default UserAvatarContainer;