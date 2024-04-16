import { FunctionComponent, ReactElement } from "react";
import OrdersPage from "./OrdersPage";

interface OrdersProps {
    params: { orderId: string }
}

const Orders: FunctionComponent<OrdersProps> = ({ params }): ReactElement => {
    return (<OrdersPage orderId={params.orderId} />);
}

export default Orders;