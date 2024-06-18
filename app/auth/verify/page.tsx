import VerifyEmailPage from "@/app/components/authPages/VerifyEmailPage";
import { FunctionComponent, ReactElement } from "react";

interface VerifyEmailProps {
    
}
 
const VerifyEmail: FunctionComponent<VerifyEmailProps> = ():ReactElement => {
    return ( 
        <VerifyEmailPage />
     );
}
 
export default VerifyEmail;