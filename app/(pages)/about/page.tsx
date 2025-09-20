import { FunctionComponent, ReactElement } from "react";
import AboutPage from "./AboutPage";

interface AboutProps {
    
}
 
const About: FunctionComponent<AboutProps> = ():ReactElement => {
    return ( <AboutPage /> );
}
 
export default About;