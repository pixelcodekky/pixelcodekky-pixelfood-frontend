import { Order } from "@/types";
import { useAuth0 } from "@auth0/auth0-react"
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type checkOutSessionRequest = {
    cartItems: {
        menuItemId: string;
        name: string;
        quantity: string;
        price:number;
    }[];
    deliveryDetails: {
        email:string;
        name:string;
        addressLine1:string;
        city:string;
        phone:number;
    };
    restaurantId: string;
    gst:number;
    deliveryfee:number;
}

export const useGetMyOrders = () => {
    const {getAccessTokenSilently} = useAuth0();

    const getMyOrdersRequest = async (): Promise<Order[]> => {
        const accessToken = await getAccessTokenSilently();
        const res = await fetch(`${API_BASE_URL}/api/order`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        if(!res.ok){
            throw new Error('Fail to get Orders'); 
        }

        return res.json();
    }

    const { data: orders, 
            isLoading} = useQuery('fetchMyOrders', getMyOrdersRequest, {
                refetchInterval: 5000, // every 5 sec
            });

    return {orders, isLoading};
}

export const useCreateCheckoutSession = () => {
    const { getAccessTokenSilently } = useAuth0();

    const createCheckoutSessionRequest = async (checkOutSessionRequest: checkOutSessionRequest) => {
        const accessToken = await getAccessTokenSilently();
        const res = await fetch(`${API_BASE_URL}/api/order/checkout/create-checkout-session`, {
            method:'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(checkOutSessionRequest),
        });

        if(!res.ok){
            throw new Error(`Fail to create session.`);
        }

        return res.json();
    }

    const {
        mutateAsync: createCheckoutSession,
        isLoading,
        error,
        reset
    } = useMutation(createCheckoutSessionRequest);

    if(error){
        toast.error(error.toString());
        reset();
    }

    return {
        createCheckoutSession,
        isLoading
    }
}