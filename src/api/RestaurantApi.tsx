import { fetchWithTimeout } from "@/common/Utilities";
import { useAppSelector } from "@/statemgmt/hooks";
import { setRestaurant } from "@/statemgmt/restaurant/RestaurantReducer";
import { SearchState } from "@/types";
import { Restaurant, RestaurantSearchResponse } from "@/types";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useSearchRestaurants = (searchState: SearchState) => {
    const profile = useAppSelector((x) => x.profile);
    const dispatch = useDispatch();
    
    const params = new URLSearchParams();
    params.set('searchQuery', searchState.searchQuery);
    params.set('page', searchState.page.toString());
    params.set('selectedCuisines', searchState.selectedCuisines.join(','));
    params.set('sortOption', searchState.sortOption);
    params.set('latitude',profile.lat.toString());
    params.set('longitude',profile.lng.toString());

    const createSearchRequest = async (): Promise<RestaurantSearchResponse> => {
        let abortController = fetchWithTimeout();
        try {
            const res = await fetch(
                `${API_BASE_URL}/api/restaurant/search/Singapore?${params.toString()}`, {
                    signal: (await abortController).controller.signal,
                });

            if(!res.ok){
                throw new Error('Fail to get Restaurants');
            }

            const data:RestaurantSearchResponse = await res.json();

            //store in redux
            await dispatch(setRestaurant(data));

            return data;
        } catch (error) {
            if((await abortController).controller.signal.aborted){
                throw new Error('Request time out.');
            }
            throw new Error('Fail to get Restaurants');
        }
        finally{
            clearTimeout((await abortController).timeout);
        }
        
    }

    const {data: results, isLoading} = useQuery(
        ['searchRestaurants', searchState],
        async () => {
            await new Promise(d => setTimeout(d, 500));
            return createSearchRequest();
        },
        { 
            enabled: !!profile.lat && !!profile.lng, 
        },
    );

    return {results, isLoading};
}

export const useGetRestaurant = (restaurantId?: string) => {
    const profile = useAppSelector((x) => x.profile);
    const getMyRestaurantRequest = async (): Promise<Restaurant> => {
        try {
            const params = new URLSearchParams();
            params.set('latitude',profile.lat.toString());
            params.set('longitude',profile.lng.toString());

            const res = await fetch(
                `${API_BASE_URL}/api/restaurant/${restaurantId}?${params.toString()}`,
            );
            
            if(!res.ok){
                throw new Error(`Failed to get  restaurant with id ${restaurantId}`);
            }

            return res.json();
        } catch (error) {
            throw new Error(`Fail to get Restaurants, ${error}`);
        }
        
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

