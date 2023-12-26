import { ReactElement, FunctionComponent } from "react";
import styles from "../styles/About.module.scss"

interface AboutProps {
    
}
 
const About: FunctionComponent<AboutProps> = ():ReactElement => {
    return ( 
        <div className={styles.aboutPage}></div>
     );
}
 
export default About;