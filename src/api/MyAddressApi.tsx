import { UserAddress } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useCreateAddress = () => {
    const { getAccessTokenSilently } = useAuth0();

    const createMyAddressRequest = async (address: FormData) => {
        try {
            const accessToken = await getAccessTokenSilently();
            const res = await fetch(`${API_BASE_URL}/api/my/address`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                body: address,
            });

            if(!res.ok){
                console.log(await res.json());
                throw new Error("Error creating address");
            }

            return await res.json();
        } catch (error) {
            toast.error(`Something went wrong.`);
            console.log(error);
        }
    }

    const {
        isError,
        isSuccess,
        isLoading,
        mutate: createAddress
    } = useMutation(createMyAddressRequest);

    if(isError){
        toast.error("Error creating address");
    }

    if(isSuccess){
        toast.success("New address has been added");
    }

    return {isLoading,isSuccess, createAddress};
}

export const useUpdateAddress = () => {
    const { getAccessTokenSilently } = useAuth0();

    const updateMyAddressRequest = async (address: FormData) => {
        try {
            const accessToken = await getAccessTokenSilently();
            const res = await fetch(`${API_BASE_URL}/api/my/address`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                body: address
            });

            if(!res.ok){
                throw new Error("Error updating address");
            }

            return await res.json();
        } catch (error) {
            throw new Error(`Something went wrong, Please try again`);
        }
        
    }

    const {
        isError,
        isSuccess,
        isLoading,
        mutate: updateAddress
    } = useMutation(updateMyAddressRequest);

    if(isError){
        toast.error("Error updating address");
    }
    
    if(isSuccess){
        toast.success("Address has been updated");
    }

    return {isLoading, isSuccess, updateAddress};
}

export const useGetUserAddress = (Id = "") => {
    const { getAccessTokenSilently } = useAuth0();

    const getAddressRequest = async (): Promise<UserAddress[]> => {
        let pathname = "/api/my/address";
        if(Id !== undefined && Id !== ""){
            pathname = pathname + `/${Id}`
        }
        const accessToken = await getAccessTokenSilently();
        const res = await fetch(`${API_BASE_URL}${pathname}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        if(!res.ok){
            throw new Error("Error getting address");
        }

        return await res.json();
    }

    const {isError, isLoading, data: getAddress, refetch} = useQuery(
        ['fetchAddress', Id],
        getAddressRequest,{
            onError: (error) => {
                console.log(error);
                toast.error(`Error getting address`);
            }
        }
    )

    if(isError){
        toast.error("Error getting address");
    }

    return {isLoading, getAddress, refetch};
}

export const useRemoveAddress = () => {
    const { getAccessTokenSilently } = useAuth0();

    const removeAddress = async (Id:string): Promise<any> => {
        try {
            const accessToken = await getAccessTokenSilently();
            const res = await fetch(`${API_BASE_URL}/api/my/address/${Id}`,{
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
            });

            if(!res.ok){
                throw new Error(`Error removing address: ${res.statusText}`);
            }
            return {success: true};

        } catch (error) {
            console.log(error);
            throw new Error(`Something went wrong, we encountered error.`);
        }
    }

    const {isLoading, mutate:removeUserAddress, isError} = useMutation(removeAddress);

    if(isError){
        toast.error("Error removing address");
    }

    return {isLoading, removeUserAddress}
}


