import { User } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGetUser = () => {
    const {getAccessTokenSilently} = useAuth0();
    
    const getUserRequest = async (): Promise<User> => {
        const accessToken = await getAccessTokenSilently();

        const res = await fetch(`${API_BASE_URL}/api/my/user`,{
            method:'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type':'application/json',
            },
        });

        if(!res.ok){
            throw new Error('Failed to get user');
        }

        return res.json();
    }

    const { data: currentUser, 
            isLoading, 
            error 
        } = useQuery('fetchCurrentUser', getUserRequest);
    
    if(error){
        toast.error(error.toString());
    }

    return {currentUser, isLoading};

}

type CreateUserRequest = {
    auth0Id: string,
    email: string
}

export const useCreateMyUser = () => {

    const { getAccessTokenSilently } = useAuth0();

    const createMyUserRequest = async (user: CreateUserRequest) => {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch (`${API_BASE_URL}/api/my/user`,{
            method:'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type':'application/json',
            },
            body: JSON.stringify(user),
        });

        if(!response){
            throw new Error('Failed to create user');
        }

        return response.json();
    }

    const {mutateAsync: createUser, 
            isLoading, 
            isError, 
            isSuccess
        } = useMutation(createMyUserRequest);

    return {
        createUser,
        isLoading,
        isError,
        isSuccess
    }
};

type updateUserRequest = {
    name: String,
    addressLine1?: String,
    city?: String,
    country?: String,
    mobileNumber:number,
    countryCode:String,
}

export const useUpdateMyUser = () => {
    const  {getAccessTokenSilently} = useAuth0();

    const updateUserData = async (formData: updateUserRequest) => {
        const  accessToken = await getAccessTokenSilently();
        const res = await fetch(`${API_BASE_URL}/api/my/user`,{
            method:'PUT',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type':'application/json',
            },
            body: JSON.stringify(formData),
        });
        
        if(!res.ok){
            throw new Error('Fail to update user');
        }

        return res.json();
    }

    const {mutateAsync: updateUser, 
            isLoading, 
            isSuccess, 
            error, 
            reset 
        } = useMutation(updateUserData);

    if(isSuccess){
        toast.success('Profile updated successfully!');
    }

    if(error){
        toast.error(error.toString());
        reset();
    }

    return {updateUser, isLoading};

}

