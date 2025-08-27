import { ReactElement, FunctionComponent, useState } from "react";
import { Icons } from "../ui/icons";
import { UserCredentialsResponse } from "@/app/models/IUser";
import ComponentLoader from "../Loader/ComponentLoader";
import { useUpdateUserName } from "@/app/api/apiClient";
import { useSession } from "next-auth/react";
import { catchError } from "@/app/constants/catchError";

interface UserNameContainerProps {
  userInformation: UserCredentialsResponse;
  handleFetchUserInformation: () => Promise<void>;
}

const UserNameContainer: FunctionComponent<UserNameContainerProps> = ({
  userInformation,
  handleFetchUserInformation,
}): ReactElement => {
  const updateUserName = useUpdateUserName();
  const { data: session, update } = useSession();
  const user = session?.user;

  const [userName, setUserName] = useState<string>("");
  const [isUserNameUpdateFieldVisible, setIsUserNameUpdateFieldVisible] =
    useState(false);
  const [userNameErrorMsg, setUserNameErrorMsg] = useState(false);
  const [isUpdatingUserName, setIsUpdatingUserName] = useState(false);

  async function handleUpdateUserName() {
    // Start loader
    setIsUpdatingUserName(true);

    // Validate username
    if (!userName) {
      setUserNameErrorMsg(true);
      setIsUpdatingUserName(false);
      return;
    }
    setUserNameErrorMsg(false);

    // Update username
    await updateUserName(user?.token as string, user?.id as string, {
      username: userName,
    })
      .then(async (response) => {
        handleFetchUserInformation();
        // Update the user's profile photo in the session
        await update({
          ...session,
          user: {
            ...session?.user,
            username: response.data.username,
          },
        });
        setIsUserNameUpdateFieldVisible(false);
      })
      .catch((error) => {
        catchError(error);
        if (
          error.response.data.error ==
          "User with specified username already exists"
        ) {
          setUserNameErrorMsg(true);
          setIsUpdatingUserName(false);
          return;
        }
      })
      .finally(() => {
        // Stop loader
        setIsUpdatingUserName(false);
      });
  }

  return (
    <>
      {userInformation.username && (
        <p className="text-base font-light text-dark-grey flex items-center gap-1">
          @{userInformation.username}
          <span
            className="bg-transparent w-5 h-5 min-w-4 min-h-4 rounded-full grid place-items-center cursor-pointer hover:opacity-60 [&_svg]:w-4 [&_svg]:h-4 [&_svg_path]:fill-dark-grey"
            onClick={() => setIsUserNameUpdateFieldVisible(true)}
          >
            <Icons.Edit />
          </span>
        </p>
      )}
      {!userInformation.username && !isUserNameUpdateFieldVisible && (
        <button onClick={() => setIsUserNameUpdateFieldVisible(true)}>
          Add username
        </button>
      )}
      {isUserNameUpdateFieldVisible && (
        <>
          <div className="w-full flex m-1 gap-1">
            <input
              className="w-full bg-dark-grey/[0.035] shadow-[0px_0px_0px_4px_rgba(0,0,0,0.1)] border-none outline-none text-dark-grey text-sm font-normal p-[0.635rem] mr-2 rounded-[0.65rem] placeholder:text-dark-grey/50"
              type="text"
              placeholder="Enter username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <button
              className="bg-black/5 text-dark-grey size-9 min-w-9 min-h-9 rounded-lg grid place-items-center p-0 [&_svg]:w-6 [&_svg]:h-6"
              disabled={isUpdatingUserName}
              onClick={() => setIsUserNameUpdateFieldVisible(false)}
            >
              <Icons.Close />
            </button>
            <button
              disabled={isUpdatingUserName || !userName}
              className="bg-primary-color text-white size-9 min-w-9 min-h-9 rounded-lg grid place-items-center p-0 [&_svg]:w-6 [&_svg]:h-6"
              onClick={handleUpdateUserName}
            >
              <Icons.Check className="fill-white" />
              {isUpdatingUserName && (
                <ComponentLoader
                  lightTheme
                  isSmallLoader
                  scale={0.8}
                  customBackground="#8133F1"
                  customLoaderColor="#ffffff"
                />
              )}
            </button>
          </div>
          {userNameErrorMsg && (
            <span className="text-failed-color text-sm">
              Username already taken
            </span>
          )}
        </>
      )}
    </>
  );
};

export default UserNameContainer;
