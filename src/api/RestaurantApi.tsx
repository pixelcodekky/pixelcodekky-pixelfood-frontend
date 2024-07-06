import { useAppSelector } from "@/statemgmt/hooks";
import { setRestaurant } from "@/statemgmt/restaurant/RestaurantReducer";
import { SearchState } from "@/types";
import { Restaurant, RestaurantSearchResponse } from "@/types";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useSearchRestaurants = (searchState: SearchState,city = "") => {
    const profile = useAppSelector((x) => x.profile);
    const params = new URLSearchParams();
    const dispatch = useDispatch();
    params.set('searchQuery', searchState.searchQuery);
    params.set('page', searchState.page.toString());
    params.set('selectedCuisines', searchState.selectedCuisines.join(','));
    params.set('sortOption', searchState.sortOption);
    params.set('latitude',profile.lat.toString());
    params.set('longitude',profile.lng.toString());

    const createSearchRequest = async (): Promise<RestaurantSearchResponse> => {
        const res = await fetch(
            `${API_BASE_URL}/api/restaurant/search/Singapore?${params.toString()}`);
        if(!res.ok){
            throw new Error('Fail to get Restaurants');
        }

        const data:RestaurantSearchResponse = await res.json();

        //store in redux
        await dispatch(setRestaurant(data));

        return data;
    }

    const {data: results, isLoading} = useQuery(
        ['searchRestaurants', searchState],
        createSearchRequest,
        //{ enabled: !!city }
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
        isLoading,
    } = useQuery(
        'fetchRestaurant',
        getMyRestaurantRequest, {
            enabled: !!restaurantId,
        }
    );

    return { restaurant, isLoading};
}

