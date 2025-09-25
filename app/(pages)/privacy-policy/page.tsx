import { FunctionComponent, ReactElement } from "react";
import PrivacyPolicyPage from "./PrivacyPolicyPage";

interface PrivacyPolicyProps {

}

const PrivacyPolicy: FunctionComponent<PrivacyPolicyProps> = (): ReactElement => {
    return (
        <PrivacyPolicyPage />
    );
}

export default PrivacyPolicy;