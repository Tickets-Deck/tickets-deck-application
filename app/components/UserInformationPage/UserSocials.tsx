import { ReactElement, FunctionComponent } from "react";
import { Icons } from "../ui/icons";
import Link from "next/link";
import { UserCredentialsResponse } from "@/app/models/IUser";

interface UserSocialsProps {
  userInformation: UserCredentialsResponse;
}

const UserSocials: FunctionComponent<UserSocialsProps> = ({
  userInformation,
}): ReactElement => {
  const facebookUrl = userInformation.socialLinks?.facebookUrl;
  const instagramUrl = userInformation.socialLinks?.instagramUrl;
  const twitterUrl = userInformation.socialLinks?.twitterUrl;

  const linkStartsWithHttp = (link: string) => {
    if (link.startsWith("https")) {
      return link;
    }
    return `https://${link}`;
  };

  return (
    <div className='flex justify-center gap-4  p-[1.25rem] md:px-[5rem] lg:px-[16%] xl:px-[10rem]'>
      {facebookUrl && (
        <Link
          className='w-full py-4 bg-grey-3/20 rounded-[1em] grid place-items-center hover:bg-grey-3'
          href={linkStartsWithHttp(facebookUrl)}
          target='_blank'
        >
          <span className='inline-flex items-center justify-center [&_svg]:size-8'>
            <Icons.Facebook />
          </span>
        </Link>
      )}
      {instagramUrl && (
        <Link
          className='w-full py-4 bg-grey-3/20 rounded-[1em] grid place-items-center hover:bg-grey-3'
          href={linkStartsWithHttp(instagramUrl)}
          target='_blank'
        >
          <span className='inline-flex items-center justify-center [&_svg]:size-8'>
            <Icons.Instagram />
          </span>
        </Link>
      )}
      {twitterUrl && (
        <Link
          className='w-full py-4 bg-grey-3/20 rounded-[1em] grid place-items-center hover:bg-grey-3'
          href={linkStartsWithHttp(twitterUrl)}
          target='_blank'
        >
          <span className='inline-flex items-center justify-center [&_svg]:size-8'>
            <Icons.Twitter />
          </span>
        </Link>
      )}
    </div>
  );
};

export default UserSocials;
