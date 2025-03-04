import { FunctionComponent, ReactElement } from "react";
import FavouriteEventsPage from "./FavouriteEventsPage";

interface FavouriteEventsProps {
    
}
 
const FavouriteEvents: FunctionComponent<FavouriteEventsProps> = ():ReactElement => {
    return ( <FavouriteEventsPage /> );
}
 
export default FavouriteEvents;