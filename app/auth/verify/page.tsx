import VerifyEmailPage from "@/app/components/authForms/verifyEmail";
import { FunctionComponent, ReactElement } from "react";

interface VerifyEmailProps {
    
}
 
const VerifyEmail: FunctionComponent<VerifyEmailProps> = ():ReactElement => {
    return ( 
        <VerifyEmailPage />
     );
}
 
export default VerifyEmail;