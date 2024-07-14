import { Order } from "@/types"
import { Progress } from "./ui/progress";
import { ORDER_STATUS } from "@/config/order_status_config";
import {CalendarDays } from "lucide-react";

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
            <div className="flex flex-row justify-between">
                <div className="flex flex-row items-center gap-2" title="ordered date">
                    <span><CalendarDays /></span>
                    <small className="text-gray-600 font-bold">{getCreatedDate()}</small>
                </div>
            </div>
            <div className="flex flex-row justify-between">
                <div className="flex flex-col">
                    <div className="flex flex-col">
                        <span>Order Status</span>
                        <span className="font-bold">{getOrderStatusInfo().label}</span>
                    </div>
                </div>
                <div className="flex flex-col">
                    <span>Expected By</span>
                    <span className="font-bold">{getExpectedDelivery()}</span>
                </div>
            </div>
            <Progress className="animate-pulse" value={getOrderStatusInfo().progressValue} />
        </>
    )
}

export default OrderStatusHeader