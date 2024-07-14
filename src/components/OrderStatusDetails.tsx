import { Order } from "@/types";
import { Separator } from "./ui/separator";
import { CircleChevronDown, CircleChevronUp, MapPin } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { AnimatedPage } from "@/animotion/AnimatedPage";

type Props = {
    order: Order;
}

const OrderStatusDetails = ({order}: Props) => {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="flex flex-row items-center justify-center">
                <Button 
                    className="bg-white text-green-500 hover:bg-green-500 hover:text-white flex items-center justify-center gap-1"
                    onClick={() => setIsOpen(!isOpen)}
                    >
                    Order Details 
                    {isOpen ? (
                        <CircleChevronUp size={15} />
                    ): (
                        <CircleChevronDown size={15} />
                    )}
                    
                </Button>
            </div>
            <AnimatedPage>
                <div key={order._id} className={`space-y-5 ${isOpen ? "block" : "hidden"} `}>
                    <div className="flex flex-col">
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
                            <MapPin size={18} className="text-green-500" />
                            <span className="font-medium">Deliver to</span>
                        </div>
                        {/* <span>{order.deliveryDetails.name}</span> */}
                        <span>{order.deliveryDetails.addressLine1}, {order.deliveryDetails.city}</span>
                        {/* <span>{order.deliveryDetails.email}</span> */}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-medium">Order Summary</span>
                        <ul>
                            {order.cartItems.map((item) => (
                                <li key={item.menuItemId}>
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
                    <div>
                        <div className="flex flex-row justify-between">
                            <span className="font-medium">Delivery</span>
                            <span className="font-medium">S$ {order.deliveryfee ? parseFloat((order.deliveryfee / 100).toFixed(2)) : 0}</span>
                        </div>
                        <div className="flex flex-row justify-between">
                            <span className="font-medium">GST ({order.gst ? order.gst : 0}%)</span>
                            <span className="font-medium">{`processing...`}</span>
                        </div>
                        <div className="flex flex-row justify-between">
                            <span className="font-medium">Platform fee</span>
                            <span className="font-medium">S$0</span>
                        </div>
                        <div className="flex flex-row justify-between">
                            <span className="font-bold">Total</span>
                            <div>
                            {order.totalAmount && (
                                <span className="font-medium">S$ {(order.totalAmount / 100).toFixed(2)}</span>
                            )}
                            </div>
                        </div>
                    </div>
                    
                </div>
            </AnimatedPage>
            
        </>
        
    )
}

export default OrderStatusDetails