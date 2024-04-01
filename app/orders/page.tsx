import { FunctionComponent, ReactElement } from "react";
import OrdersPage from "./OrdersPage";

interface OrdersProps {
    
}
 
const Orders: FunctionComponent<OrdersProps> = ():ReactElement => {
    return ( <OrdersPage />);
}
 
export default Orders;