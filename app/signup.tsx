import { ReactElement, FunctionComponent } from "react";
import styles from "../styles/AuthStyles.module.scss"

interface SignupProps {

}

const Signup: FunctionComponent<SignupProps> = (): ReactElement => {
    return ( 
        <div className={styles.signUp}></div>
     );
}

export default Signup;