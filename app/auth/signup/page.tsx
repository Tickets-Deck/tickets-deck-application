import SignupPage from "@/app/components/authForms/signup";
import { FunctionComponent, ReactElement } from "react";

interface SignUpProps {
    
}
 
const SignUp: FunctionComponent<SignUpProps> = ():ReactElement => {
    return ( <SignupPage /> );
}
 
export default SignUp;