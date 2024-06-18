import ResetPasswordPage from "@/app/components/authPages/ResetPasswordPage";
import { FunctionComponent, ReactElement } from "react";

interface ResetPasswordProps {
    
}
 
const ResetPassword: FunctionComponent<ResetPasswordProps> = ():ReactElement => {
    return ( 
        <ResetPasswordPage />
     );
}
 
export default ResetPassword;