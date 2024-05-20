import { FunctionComponent, ReactElement } from "react";
import OrdersPage from "./OrdersPage";

interface OrdersProps {
    params: { orderId: string }
}

const Orders: FunctionComponent<OrdersProps> = ({ params }): ReactElement => {

    const hostUrl = process.env.NEXTAUTH_URL;

    return (
        <OrdersPage
            orderId={params.orderId}
            hostUrl={hostUrl}
        />
    );
}

export default Orders;