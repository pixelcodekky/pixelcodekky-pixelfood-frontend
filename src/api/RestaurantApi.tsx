import { SearchState } from "@/types";
import { Restaurant, RestaurantSearchResponse } from "@/types";
import { useQuery } from "react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useSearchRestaurants = (searchState: SearchState,city?: string) => {
    const params = new URLSearchParams();
    params.set('searchQuery', searchState.searchQuery);
    params.set('page', searchState.page.toString());
    params.set('selectedCuisines', searchState.selectedCuisines.join(','));
    params.set('sortOption', searchState.sortOption);

    const createSearchRequest = async (): Promise<RestaurantSearchResponse> => {
        const res = await fetch(
            `${API_BASE_URL}/api/restaurant/search/${city}?${params.toString()}`,
        );

        if(!res.ok){
            throw new Error('Fail to get Restaurant');
        }
        console.log('createSearchRequest here');
        const data:RestaurantSearchResponse = await res.json();
        console.log('createSearchRequest response', data);
        return data;
    }

    const {data: results, isLoading} = useQuery(
        ['searchRestaurants', searchState],
        createSearchRequest,
        { enabled: !!city }
    );

    return {results, isLoading};
}

export const useGetRestaurant = (restaurantId?: string) => {
    const getMyRestaurantRequest = async (): Promise<Restaurant> => {
        const res = await fetch(
            `${API_BASE_URL}/api/restaurant/${restaurantId}`,
        );

        if(!res.ok){
            throw new Error(`Failed to get  restaurant with id ${restaurantId}`);
        }

        return res.json();
    }

    const {
        data: restaurant,
        isLoading
    } = useQuery(
        'fetchRestaurant',
        getMyRestaurantRequest, {
            enabled: !!restaurantId,
        }
    );

    return { restaurant, isLoading};
}

