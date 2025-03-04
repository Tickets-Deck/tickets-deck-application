import { FunctionComponent, ReactElement } from "react";
import CheckInPage from "./CheckInPage";

interface CheckInProps {

}

const CheckIn: FunctionComponent<CheckInProps> = (): ReactElement => {
    return (
        <CheckInPage />
    );
}

export default CheckIn;