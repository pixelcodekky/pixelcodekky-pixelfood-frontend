import { useGetRestaurant } from "@/api/RestaurantApi";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import MeuItem from "@/components/MeuItem";
import OrderSummary from "@/components/OrderSummary";
import RestaurantInfo from "@/components/RestaurantInfo";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardFooter } from "@/components/ui/card";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MenuItem as MenuItemType } from '../types';
import CheckoutButton from "@/components/CheckoutButton";
import { UserFormData } from "@/forms/user_profile_form/UserProfileForm";
import { useCreateCheckoutSession } from "@/api/OrderApi";
import { Button } from "@/components/ui/button";
import { CircleArrowLeft, ShoppingBasket } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export type CartItem = {
    _id: string;
    name: string;
    price: number;
    quantity: number;
}

const DetailPage = () => {
    const navigate = useNavigate();

    const {restaurantId} = useParams();
    const {restaurant, isLoading: isRestaurantLoading} = useGetRestaurant(restaurantId);
    const { createCheckoutSession, isLoading: isCheckoutLoading } = useCreateCheckoutSession();

    const [cartItems, setCardItems] = useState<CartItem[]>(() => {
        const storedCartItems = sessionStorage.getItem(`cartItems_${restaurantId}`);
        return storedCartItems ? JSON.parse(storedCartItems) : []
    });

    const gstvalue = import.meta.env.VITE_GST_PERCENT;
    
    const addToCart = (menuItem: MenuItemType, isAdd: boolean) => {
        setCardItems((prev) => {
            const existingCartItem = prev.find((cartItem) => cartItem._id == menuItem._id);
            let updatedCartItem;

            if(existingCartItem){
                if(isAdd){
                    updatedCartItem = prev.map((cartItem)=> cartItem._id == menuItem._id ? {...cartItem, quantity: cartItem.quantity + 1} : cartItem);
                }else if(!isAdd){
                    var updatedQty = cartItems.find((x) => x._id === menuItem._id)?.quantity ?? 0;
                    if((updatedQty - 1) <= 0){
                        //remove from cart list
                        updatedCartItem = prev.filter((item) => item._id !== menuItem._id);
                    }else{
                        updatedCartItem = prev.map((cartItem)=> cartItem._id == menuItem._id ? {...cartItem, quantity: cartItem.quantity - 1} : cartItem);
                    }
                    
                }else{
                    updatedCartItem = prev;
                }
            }else{
                updatedCartItem = [
                    ...prev, {
                        _id: menuItem._id,
                        name: menuItem.name,
                        price: menuItem.price,
                        quantity: 1,
                    },
                ]
            }

            //in future replace with redux
            sessionStorage.setItem(`cartItems-${restaurantId}`,JSON.stringify(updatedCartItem));

            return updatedCartItem;
        });
    }

    const removeFromCart = (cartItem: CartItem) => {
        setCardItems((prev) => {
            const updatedCartItems = prev.filter((item) => cartItem._id !== item._id);
            
            sessionStorage.setItem(`cartItems-${restaurantId}`,JSON.stringify(updatedCartItems));

            return updatedCartItems;
        });
    }

    const onCheckout = async (userFormData: UserFormData) => {
        if(!restaurant){
            return;
        }

        const checkoutData = {
            cartItems: cartItems.map((cartItem) => ({
                menuItemId: cartItem._id,
                name: cartItem.name,
                quantity: cartItem.quantity.toString(),
            })),
            restaurantId: restaurant?._id,
            deliveryDetails: {
                name: userFormData.name,
                addressLine1: userFormData.addressLine1,
                city: userFormData.city,
                email: userFormData.email as string,
            },
        };

        const data = await createCheckoutSession(checkoutData);

        window.location.href = data.url; // redirect to stripe;

    }

    if(isRestaurantLoading || !restaurant){
        return <LoadingSkeleton />
    }

    const getTotalCost = () => {
        const totalcost = cartItems.reduce((total, cartItem) => total + cartItem.price * cartItem.quantity, 0);

        const totalWithDelivery = totalcost + restaurant.deliveryPrice;

        return ( totalWithDelivery / 100).toFixed(2);
    }

    const getTotalCostWithGST = () => {
        const gettotal = parseInt(getTotalCost());
        const getgst = getGSTcost();
        const total = parseFloat(gettotal.toFixed(2).toString()) + parseFloat(getgst);
        return parseFloat(total.toString());
    }

    const getGSTcost = () => {
        const gettotal = getTotalCost();
        const gst = (parseInt(gettotal) / 100) * parseInt(gstvalue);
        return gst.toFixed(2);
    }

    const handleRedirectPrevPage = () => {
        navigate(-1);
    }

    const renderOrderSummary = (classname:string) => {
        return (
            <Card className={classname}>
                <OrderSummary restaurant={restaurant} cartItems={cartItems} removeFromCart={removeFromCart}/>
                <CardFooter>
                    <CheckoutButton isLoading={isCheckoutLoading} disabled={cartItems.length === 0} onCheckout={onCheckout}/>
                </CardFooter>
            </Card>
        )
    }

    return (
        <>
            {isRestaurantLoading && !restaurant ? (
                null
            ): (
                <div className="flex flex-col relative gap-10">
                    <AspectRatio ratio={16/4}>
                        <img src={restaurant.imageUrl} className="rounded-md object-cover h-full w-full" />
                    </AspectRatio>
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-normal">
                            <Button variant='link' className="text-green-500 gap-2" onClick={handleRedirectPrevPage}>
                                <CircleArrowLeft  />
                                restaurants
                            </Button>
                        </div>
                    </div>
                    <RestaurantInfo restaurant={restaurant} />
                    <div className="grid lg:grid-cols-[4fr_2fr] sm:grid-col relative gap-5 md:px-3">
                        <div className="flex flex-col gap-4">
                            <span className="text-2xl font-bold tracking-tight">Menu</span>
                            <ul className="grid md:grid-cols-2 gap-4"> 
                                {restaurant.menuItems.map((item, idx) => (
                                    <li key={idx}>
                                        <MeuItem menuItem={item} key={idx} 
                                            addquantity={() => addToCart(item, true)}
                                            minusquantity={() => addToCart(item, false)}
                                            currentQty={cartItems.find((x) => x._id === item._id)?.quantity ?? 0}
                                        />
                                    </li>
                                    
                                ))}
                            </ul>
                        </div>
                        <div className="invisible lg:visible">
                            {renderOrderSummary("")}
                        </div>
                    </div>
                    <div className="lg:invisible fixed inset-x-0 bottom-0 w-full h-auto bg-white p-2">
                        <Dialog>
                            <DialogTrigger asChild>
                            <Button className="w-full h-15 bg-green-500 hover:bg-green-600 justify-between shadow-md">
                                <div className="relative">
                                    <span className="absolute w-5 h-5 bottom-6 left-8 bg-white text-green-400 border-black rounded-full font-sm">
                                        {cartItems.reduce((total, item) => total + item.quantity, 0)}
                                    </span>
                                    <ShoppingBasket size={40} />
                                </div>
                                <span className="text-xl">View Order</span>
                                <div className="flex flex-col">
                                    <span className="font-bold text-xl">
                                        S$ {getTotalCostWithGST()}
                                    </span>
                                    <small className="text-xs">Delivery & GST inclusive</small>
                                </div>
                                
                            </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-[625px] md:min-w-[700px] bg-gray-50">
                                {renderOrderSummary("mt-5")}
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            )}
            

        
        </>
        
    )
}

export default DetailPage

