import { Order } from "@/types";
import { Separator } from "./ui/separator";
import { CircleChevronDown, MapPin } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "./ui/button";
import { generateuuid } from "@/common/Utilities";

type Props = {
    order: Order;
}

const OrderStatusDetails = ({order}: Props) => {

    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    const getgst = () => {
        const total = parseFloat((order.totalAmount / 100).toFixed(2));
        const inclgst = (total * order.gst) / (100 + order.gst)
        return inclgst.toFixed(2);
    }

    const getsubcharge = () => {
        const total = order.cartItems.reduce((total, item) => total + (item.price ?? 0) * (item.quantity ?? 0), 0);
        return total;
    }

    return (
        <>
            <div className="flex flex-row items-center justify-center">
                <Button 
                    className="bg-white text-green-500 hover:bg-green-500 hover:text-white flex items-center justify-center gap-1"
                    onClick={() => setIsOpen(!isOpen)}
                    >
                    Order Details 
                    <CircleChevronDown size={15} className={`transition-transform ${isOpen ? "rotate-180" : ""}`}/>
                    
                </Button>
            </div>
            <div 
                className={`space-y-5 overflow-y-hidden transition-transform ease`}
                style={{height: isOpen ? "auto" : 0}}>
                <div ref={ref}>
                    <div className="flex flex-col py-2">
                        <div className="flex flex-row items-center gap-1 text-sm">
                            <MapPin size={18} className="text-green-500" />
                            <span className="font-medium">
                                Order From
                            </span>
                        </div>
                        <span>{order.restaurant.restaurantName}</span>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex flex-row items-center gap-1 text-sm">
                            <MapPin size={18} className="text-red-500" />
                            <span className="font-medium">Deliver to</span>
                        </div>
                        {/* <span>{order.deliveryDetails.name}</span> */}
                        <span>{order.deliveryDetails.addressLine1}, {order.deliveryDetails.city}</span>
                        {/* <span>{order.deliveryDetails.email}</span> */}
                    </div>
                    <div className="flex flex-col py-2">
                        <span className="font-medium">Order Summary</span>
                        <ul>
                            {order.cartItems.map((item) => (
                                <li key={`${generateuuid()}`}>
                                    <div className="flex flex-row justify-between">
                                        <div className="flex gap-2">
                                            <span>{item.quantity}X</span>
                                            <span>{item.name} </span> 
                                        </div>
                                        <div>S$ {((item.price ?? 0) * item.quantity)}</div>
                                    </div>
                                    
                                </li>
                            ))}
                        </ul>
                    </div>
                    <Separator />
                    <div className="py-1">
                        <div className="flex flex-row justify-between">
                            <span className="font-medium text-sm">Sub-charge</span>
                            <span className="font-medium text-sm">S$ {getsubcharge()}</span>
                        </div>
                        <div className="flex flex-row justify-between">
                            <span className="font-medium text-sm">Delivery fee</span>
                            <span className="font-medium text-sm">S$ {order.deliveryfee ? parseFloat((order.deliveryfee / 100).toFixed(2)) : 0}</span>
                        </div>
                        <div className="flex flex-row justify-between">
                            <span className="font-medium text-sm">Platform fee</span>
                            <span className="font-medium text-sm">S$0</span>
                        </div>
                        <div className="flex flex-row justify-between">
                            <span className="font-medium text-sm">GST ({order.gst ? order.gst : 0}% exclusive)</span>
                            <span className="font-medium text-sm">{getgst()}</span>
                        </div>
                        <div className="flex flex-row justify-between pt-3">
                            <span className="font-bold">Total</span>
                            <div>
                            {order.totalAmount && (
                                <span className="font-semibold">S$ {(order.totalAmount / 100).toFixed(2)}</span>
                            )}
                            </div>
                        </div>
                    </div>
                </div>
                
                
            </div>
            
        </>
        
    )
}

export default OrderStatusDetails