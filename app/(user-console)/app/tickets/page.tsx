import { ReactElement, FunctionComponent } from "react";
import TicketsPage from "./TicketsPage";

interface TicketsProps {
    
}
 
const Tickets: FunctionComponent<TicketsProps> = ():ReactElement => {
    return ( 
        <TicketsPage />
     );
}
 
export default Tickets;