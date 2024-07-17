import { Restaurant } from "@/types";
import { Badge } from "./ui/badge";
import { CardContent, CardHeader, CardTitle } from "./ui/card";
import { CartItem } from "@/pages/DetailPage";
import { Trash } from "lucide-react";
import { Separator } from "./ui/separator";

type Props = {
    restaurant: Restaurant;
    cartItems: CartItem[];
    removeFromCart: (cartItem: CartItem) => void;
    getgst: () => string;
    gettotalwithgst: () => string;
    gettotalwithoutdelivery: () => string;
}

const OrderSummary = ({restaurant, cartItems, removeFromCart, getgst,gettotalwithgst, gettotalwithoutdelivery}: Props) => {
    
    const gstvalue = import.meta.env.VITE_GST_PERCENT;
    
    return (
        <>
            <CardHeader>
                <CardTitle className="text-2xl font-bold tracking-tight flex justify-between">
                    <span>Total</span>
                    <span>S$ {gettotalwithgst()}</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
                {cartItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                        <span>
                            <Badge variant='outline' className="mr-2">
                                {item.quantity}
                            </Badge>
                            {item.name}
                        </span>
                        <span className="flex items-center gap-1">
                            S${((item.price * item.quantity) / 100).toFixed(2)}
                            <Trash className="cursor-pointer" color="red" size={20} onClick={() => removeFromCart(item)} />
                        </span>
                    </div>
                ))}
                <Separator/>
                <div className="flex justify-between text-sm font-medium">
                    <span>Sub-charge</span>
                    <span>S$ {gettotalwithoutdelivery()}</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                    <span>Delivery fee</span>
                    <span>S$ {(restaurant.deliveryPrice / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                    <span>Platform fee</span>
                    <span>S$ 0</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                    <span>GST ({gstvalue}% exclusive)</span>
                    <span>S$ {getgst()}</span>
                </div>
            </CardContent>
        </>
    )
}

export default OrderSummary;