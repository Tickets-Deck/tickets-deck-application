import Login from "@/app/components/authForms/login";
import { ReactElement, FunctionComponent } from "react";

interface SignInProps {

}

const SignIn: FunctionComponent<SignInProps> = (): ReactElement => {
    return (<Login />);
}

export default SignIn;