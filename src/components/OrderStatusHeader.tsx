import { Order } from "@/types"
import { Progress } from "./ui/progress";
import { ORDER_STATUS } from "@/config/order_status_config";

type Props = {
    order: Order;
}

const OrderStatusHeader = ({order}: Props) => {
    const getExpectedDelivery = () => {
        const created = new Date(order.createdAt);
        created.setMinutes(
            created.getMinutes() + order.restaurant.estimatedDeliveryTime
        );

        const hours = created.getHours();
        const minutes = created.getMinutes();
        const paddedHours = hours < 10 ? `0${hours}` : `${hours}`;
        const paddedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;

        return `${paddedHours}:${paddedMinutes}`;
    }

    const getCreatedDate = () => {
        const created = new Date(order.createdAt);
        const year = created.getFullYear();
        const month = created.getMonth() + 1;
        const day = created.getDate();
        const time = getTime(created);

        return `${paddingdate(day)}/${paddingdate(month)}/${year} : ${time}`;
    }

    const paddingdate = (value: number) => {
        return value < 10 ? `0${value}` : value;
    }

    const getTime = (value: Date) => {
        const hours = value.getHours();
        const minutes = value.getMinutes();
        const seconds = value.getSeconds();
        const paddedHours = hours < 10 ? `0${hours}` : `${hours}`;
        const paddedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
        const paddedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

        return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
    }

    const getOrderStatusInfo = () => {
        return ORDER_STATUS.find((item) => item.value === order.status) || ORDER_STATUS[0];
    }

    return (
        <>
            <h1 className="text-4xl font-bold tracking-tighter flex flex-col gap-5 md:flex-row md:justify-between">
                <div>
                <span>Order Status: {getOrderStatusInfo().label} </span><br/>
                <small>Order Date: {getCreatedDate()}</small>
                </div>
                <span>Expected By: {getExpectedDelivery()}</span>
            </h1>
            <Progress className="animate-pulse" value={getOrderStatusInfo().progressValue} />
        </>
    )
}

export default OrderStatusHeader