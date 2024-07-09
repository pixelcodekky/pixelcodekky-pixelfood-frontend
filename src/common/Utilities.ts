import { RestaurantSearchResponse, SearchResultType } from "@/types";
import { useRef, useState } from "react";


type Timer = ReturnType<typeof setTimeout>;
type handler = (...args: any[]) => void;

//Function Debounce
export const useDebounce = <Func extends handler> (
    func: Func,
    delay = 1000,
) => {
    const [timer, setTimer] = useState<Timer>();
    const timerRef = useRef<Timer | undefined>(timer);

    const debounceFunction = ((...args) => {
        clearTimeout(timerRef.current);
        const newTimer = setTimeout(() => {
            func(...args);
        }, delay);
        timerRef.current = newTimer;
        setTimer(newTimer);
    }) as Func;


    const clearDebounce = () => {
        clearTimeout(timerRef.current);
        timerRef.current = undefined;
        setTimer(undefined);
    }

    return {debounceFunction, clearDebounce, setTimer: setTimer as React.Dispatch<React.SetStateAction<Timer | undefined>>};
}

// Value Debounce
// export const useDebounce = <T>(value: T, delay = 500) => {
//     const [debouncedValue, setDebouncedValue] = useState<T>(value);

//     useEffect(() => {
//         const timeout = setTimeout(() => {
//             setDebouncedValue(value);
//         }, delay);
//         return () => clearTimeout(timeout);
//     }, [value, delay]);

//     return debouncedValue;
// }

//
export const haversineDistance = (pointAlonlat:[number, number], pointBlonlat:[number, number]):number => {
    const toRadians = (degrees: number): number => degrees * (Math.PI / 180);

    const [lon1, lat1] = pointAlonlat;
    const [lon2, lat2] = pointBlonlat;

    const R = 6371;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =   Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c =   2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in kilometer
}

export const calculateDistanceHelper = (profile: SearchResultType, restaurants?:RestaurantSearchResponse):RestaurantSearchResponse => {
    let results: RestaurantSearchResponse = {
        data: [],
        pagination: {
            total: 0,
            page: 0,
            pages: 0,
        }
    }
    if(profile.full_value !== '' && restaurants !== undefined  && restaurants.data.length > 0){
        
        let pointA: [number, number] = [profile.lng, profile.lat];
        for(let restaurant of restaurants.data){
            let tmpRestaurant = {...restaurant}
            if(tmpRestaurant.address[0] !== undefined){
                let pointB: [number, number] = [tmpRestaurant.address[0].lon, tmpRestaurant.address[0].lat ]
                let distance = haversineDistance(pointA, pointB);
                
                tmpRestaurant.distance = distance;
                results.data.push(tmpRestaurant);
            }
        }
        results.pagination = restaurants.pagination;
    }

    return results;
}

export const fetchWithTimeout = async (delay = 7000) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), delay);
    return {controller, timeout};
}








