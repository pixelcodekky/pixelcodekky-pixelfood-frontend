import { useGetRestaurant } from "@/api/RestaurantApi";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import MeuItem from "@/components/MeuItem";
import OrderSummary from "@/components/OrderSummary";
import RestaurantInfo from "@/components/RestaurantInfo";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardFooter } from "@/components/ui/card";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { MenuItem as MenuItemType } from '../types';
import CheckoutButton from "@/components/CheckoutButton";
import { UserFormData } from "@/forms/user_profile_form/UserProfileForm";
import { useCreateCheckoutSession } from "@/api/OrderApi";

export type CartItem = {
    _id: string;
    name: string;
    price: number;
    quantity: number;
}

const DetailPage = () => {
    
    const {restaurantId} = useParams();
    const {restaurant, isLoading: isRestaurantLoading} = useGetRestaurant(restaurantId);
    const { createCheckoutSession, isLoading: isCheckoutLoading } = useCreateCheckoutSession();

    const [cartItems, setCardItems] = useState<CartItem[]>(() => {
        const storedCartItems = sessionStorage.getItem(`cartItems_${restaurantId}`);
        return storedCartItems ? JSON.parse(storedCartItems) : []
    });
    
    const addToCart = (menuItem: MenuItemType) => {
        setCardItems((prev) => {
            const existingCartItem = prev.find((cartItem) => cartItem._id == menuItem._id);
            let updatedCartItem;

            if(existingCartItem){
                updatedCartItem = prev.map((cartItem)=> cartItem._id == menuItem._id ? {...cartItem, quantity: cartItem.quantity + 1} : cartItem);
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

    return (
        <div className="flex flex-col gap-10">
            <AspectRatio ratio={16/4}>
                <img src={restaurant.imageUrl} className="rounded-md object-cover h-full w-full" />
            </AspectRatio>
            <div className="grid md:grid-cols-[4fr_2fr] gap-5 md:px-32">
                <div className="flex flex-col gap-4">
                    <RestaurantInfo restaurant={restaurant} />
                    <span className="text-2xl font-bold tracking-tight">Menu</span>
                    {restaurant.menuItems.map((item, idx) => (
                        <MeuItem menuItem={item} key={idx} addToCart={() => addToCart(item)}/>
                    ))}
                </div>

                <div className="">
                    <Card>
                        <OrderSummary restaurant={restaurant} cartItems={cartItems} removeFromCart={removeFromCart}/>
                        <CardFooter>
                            <CheckoutButton isLoading={isCheckoutLoading} disabled={cartItems.length === 0} onCheckout={onCheckout}/>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default DetailPage

