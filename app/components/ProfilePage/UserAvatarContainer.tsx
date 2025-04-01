import Image from "next/image";
import {
  FunctionComponent,
  ReactElement,
  Dispatch,
  SetStateAction,
} from "react";
import { UserCredentialsResponse } from "@/app/models/IUser";
import { Icons } from "../ui/icons";

interface UserAvatarContainerProps {
  userInformation: UserCredentialsResponse;
  setIsPhotoUploadModalVisible?: Dispatch<SetStateAction<boolean>>;
  userAvatarSize?: number;
}

const UserAvatarContainer: FunctionComponent<UserAvatarContainerProps> = ({
  userInformation,
  setIsPhotoUploadModalVisible,
  userAvatarSize,
}): ReactElement => {
  return (
    <div className='relative'>
      <div
        className='w-24 h-24 md:size-32 rounded-full overflow-hidden relative my-0 mx-auto border-4 border-white [&_img]:object-cover'
        style={
          userAvatarSize
            ? { width: `${userAvatarSize}px`, height: `${userAvatarSize}px` }
            : {}
        }
      >
        <Image
          src={
            userInformation.profilePhoto ||
            `https://placehold.co/300x300/8133F1/FFFFFF/png?text=${userInformation.firstName[0].toUpperCase()}${userInformation.lastName[0].toUpperCase()}`
          }
          alt='avatar'
          fill
        />
      </div>
      {setIsPhotoUploadModalVisible && (
        <span
          className='absolute bottom-0 right-0 w-8 h-8 rounded-full border-2 border-white bg-primary-color cursor-pointer grid place-items-center [&_svg]:w-4 [&_svg]:h-4 hover:bg-primary-color-dark'
          onClick={() => setIsPhotoUploadModalVisible(true)}
        >
          <Icons.Edit />
        </span>
      )}
    </div>
  );
};

export default UserAvatarContainer;
