import { Order, Restaurant } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useCreateMyRestaurant = () => {
    const { getAccessTokenSilently } = useAuth0();

    const createMyRestaurantRequest = async (
        restaurantFormData: FormData
        ): Promise<Restaurant> => {
            
        const accessToken = await getAccessTokenSilently();
        const res = await fetch(`${API_BASE_URL}/api/my/restaurant`, {
            method:'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            body: restaurantFormData,
        });

        if(!res.ok){
            throw new Error('Failed to create Restaurant');
        }

        return res.json();
    };

    const { mutate: createRestaurant,
            isLoading,
            isSuccess,
            error } = useMutation(createMyRestaurantRequest);

    if(isSuccess){
        toast.success(`Restaurant Created.`);
    }

    if(error){
        toast.error(`Unable to update restaurant`);
    }

    return {createRestaurant, isLoading};
}

export const useGetMyRestaurant = () => {
    const { getAccessTokenSilently } = useAuth0();

    const getMyRestaurantRequest = async (): Promise<Restaurant> => {
        const accessToken = await getAccessTokenSilently();

        const res = await fetch(`${API_BASE_URL}/api/my/restaurant`, {
            method:'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
        });

        if(!res.ok){
            throw new Error(`Fail to get Restaurant`);
        }

        return res.json();
    }

    const {data: restaurant, isLoading} = useQuery(
        'fetchMyRestaurant',
        getMyRestaurantRequest,
    )

    return { restaurant, isLoading};
}

export const useUpdateRestaurant = () => {
    const { getAccessTokenSilently } = useAuth0();

    const updateMyRestaurantRequest = async (restaurantFormData: FormData): Promise<Restaurant> => {
        const accessToken = await getAccessTokenSilently();
        const res = await fetch(`${API_BASE_URL}/api/my/restaurant`, {
            method:'PUT',
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            body: restaurantFormData,
        });

        if(!res.ok){
            throw new Error('Failed to update Restaurant');
        }

        return res.json();
    };

    const { mutate: updateRestaurant,
            isLoading,
            isSuccess,
            error } = useMutation(updateMyRestaurantRequest);

    if(isSuccess){
        toast.success(`Restaurant Updated.`);
    }

    if(error){
        toast.error(`Unable to update restaurant`);
    }

    return {updateRestaurant, isLoading};
}

export const useGetMyRestaurantOrders = () => {
    const {getAccessTokenSilently} = useAuth0();
    
    const GetMyRestaurantOrdersRequest = async (): Promise<Order[]> => {
        const accessToken = await getAccessTokenSilently();
        
        const res = await fetch(`${API_BASE_URL}/api/my/restaurant/order`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch  orders: ${res.statusText}`);
        }
        return res.json();
    }

    const {data: orders, isLoading} = useQuery(
        'fetchMyRestaurantOrders',
        GetMyRestaurantOrdersRequest
    );

    return {orders, isLoading};
}


type UpdateOrderStatusRequest = {
    orderId: string;
    status: string;
}

export const useMyRestaurantUpdate = () => {
    const {getAccessTokenSilently} = useAuth0();

    const useMyRestaurantUpdateRequest = async (updateStatusOrderRequest: UpdateOrderStatusRequest): Promise<Restaurant> => {
        const accessToken = await getAccessTokenSilently();

        const res = await fetch(`${API_BASE_URL}/api/my/restaurant/order/${updateStatusOrderRequest.orderId}/status`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({status: updateStatusOrderRequest.status}),
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch  orders: ${res.statusText}`);
        }

        return res.json();

    }

    const { mutateAsync: updateRestaurantStatus, 
            isLoading, 
            isError, 
            isSuccess, 
            reset} = useMutation(useMyRestaurantUpdateRequest);

    if(isSuccess){
        toast.success("Order updated");
    }

    if(isError){
        toast.error("An error occurred while updating the order");
        reset();
    }

    return {updateRestaurantStatus, isLoading};


}

