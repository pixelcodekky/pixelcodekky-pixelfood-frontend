import { UserAddress } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useCreateAddress = () => {
    const { getAccessTokenSilently } = useAuth0();

    const createMyAddressRequest = async (address: FormData) => {
        const accessToken = await getAccessTokenSilently();
        const res = await fetch(`${API_BASE_URL}/api/my/address`, {
            method: "POST",
            headers: { Authorization: `Bearer ${accessToken}` },
            body: address,
        });
        if (!res.ok) throw new Error("Error creating address");
        return await res.json();
    }

    const { isLoading, isSuccess, mutate: createAddress } = useMutation(createMyAddressRequest, {
        onSuccess: () => { toast.success("New address has been added"); },
        onError: () => { toast.error("Error creating address"); },
    });

    return { isLoading, isSuccess, createAddress };
}

export const useUpdateAddress = () => {
    const { getAccessTokenSilently } = useAuth0();

    const updateMyAddressRequest = async (address: FormData) => {
        const accessToken = await getAccessTokenSilently();
        const res = await fetch(`${API_BASE_URL}/api/my/address`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${accessToken}` },
            body: address,
        });
        if (!res.ok) throw new Error("Error updating address");
        return await res.json();
    }

    const { isLoading, isSuccess, mutate: updateAddress } = useMutation(updateMyAddressRequest, {
        onSuccess: () => { toast.success("Address has been updated"); },
        onError: () => { toast.error("Error updating address"); },
    });

    return { isLoading, isSuccess, updateAddress };
}

export const useGetUserAddress = (Id = "") => {
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();

    const getAddressRequest = async (): Promise<UserAddress[]> => {
        const pathname = Id ? `/api/my/address/${Id}` : "/api/my/address";
        const accessToken = await getAccessTokenSilently();
        const res = await fetch(`${API_BASE_URL}${pathname}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) throw new Error("Error getting address");
        return await res.json();
    }

    const { isError, isLoading, data: getAddress, refetch } = useQuery(
        ['fetchAddress', Id],
        getAddressRequest,
        {
            onError: () => { toast.error("Error getting address"); },
            enabled: isAuthenticated,
        }
    );

    return { isLoading, isError, getAddress, refetch };
}

export const useRemoveAddress = () => {
    const { getAccessTokenSilently } = useAuth0();

    const removeAddress = async (Id: string): Promise<void> => {
        const accessToken = await getAccessTokenSilently();
        const res = await fetch(`${API_BASE_URL}/api/my/address/${Id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) throw new Error(`Error removing address: ${res.statusText}`);
    }

    const { isLoading, mutate: removeUserAddress } = useMutation(removeAddress, {
        onError: () => { toast.error("Error removing address"); },
    });

    return { isLoading, removeUserAddress };
}
