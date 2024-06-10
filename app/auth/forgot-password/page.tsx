import ForgotPasswordPage from "@/app/components/authPages/ForgotPasswordPage";
import { FunctionComponent, ReactElement } from "react";

interface ForgotPasswordProps {
    
}
 
const ForgotPassword: FunctionComponent<ForgotPasswordProps> = ():ReactElement => {
    return ( 
        <ForgotPasswordPage />
     );
}
 
export default ForgotPassword;