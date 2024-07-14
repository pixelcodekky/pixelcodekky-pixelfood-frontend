import { useGetMyOrders } from "@/api/OrderApi"
import LoadingSkeleton from "@/components/LoadingSkeleton";
import OrderStatusDetails from "@/components/OrderStatusDetails";
import OrderStatusHeader from "@/components/OrderStatusHeader";
import { Separator } from "@/components/ui/separator";

const OrderStatusPage = () => {
    const {orders, isLoading} = useGetMyOrders();

    if(isLoading){
        return <LoadingSkeleton />
    }

    if(!orders || orders.length == 0){ 
        return "No Orders found."
    }

    return (
        <div className="flex flex-col items-center justify-center space-y-5 px-10">
            {orders.map((order) => (
                <div key={`${order.restaurantId}${order._id}`} className="w-full lg:w-1/2 space-y-3 bg-white border p-5 rounded-lg">
                    <OrderStatusHeader order={order} />
                    <Separator />
                    <div key={order.restaurantId} >
                        <OrderStatusDetails order={order} />
                    </div>
                </div>
            ))}
        </div>
    )
}

export default OrderStatusPage