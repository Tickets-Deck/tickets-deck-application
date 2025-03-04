import { ReactElement, FunctionComponent } from "react";
import ProfilePage from "./ProfilePage";

interface ProfileProps {
    
}
 
const Profile: FunctionComponent<ProfileProps> = ():ReactElement => {
    return ( 
        <ProfilePage />
     );
}
 
export default Profile;