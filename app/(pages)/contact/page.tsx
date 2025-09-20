import { ReactElement, FunctionComponent } from "react"
import ContactPage from "./ContactPage";

interface ContactProps {

}

const Contact: FunctionComponent<ContactProps> = (): ReactElement => {
    return ( 
        <ContactPage />
     );
}

export default Contact;