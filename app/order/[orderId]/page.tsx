import { FunctionComponent, ReactElement } from "react";
import OrdersPage from "./OrdersPage";
import { UserTicketOrderInfo } from "@/app/models/IUserTicketOrder";
import { useFetchOrderInformationById } from "@/app/api/apiClient";
import { getServerSession } from "next-auth";

interface OrdersProps {
    params: { orderId: string }
}

async function getOrderInformation(orderId: string): Promise<UserTicketOrderInfo | null> {
    const fetchOrderInformationById = useFetchOrderInformationById();
    try {
        const response = await fetchOrderInformationById(orderId);
        return response.data as UserTicketOrderInfo;
    } catch (error) {
        console.error("Error fetching order info:", error);
        return null;
    }
}

const Orders: FunctionComponent<OrdersProps> = async ({ params }) => {

    const hostUrl = process.env.NEXTAUTH_URL;

    const identifier = params.orderId;
    const orderInformation = await getOrderInformation(identifier);

    return (
        <OrdersPage
            hostUrl={hostUrl}
            orderInformation={orderInformation}
        />
    );
}

export default Orders;