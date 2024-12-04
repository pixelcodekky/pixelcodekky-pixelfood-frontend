import { useQuery } from "react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGetcodingStaticMap = (lon:string, lat:string) => {
    const getGeocodingStaticMap = async (): Promise<string> => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/geocoder/staticmap/${lat}/${lon}`);
    
            if(!res.ok)
                throw new Error(res.statusText);
            
            const data = await res.json()

            return data.payload as string;
    
        } catch (error) {
            console.log(error);
            return "";
        }
    }

    const {data, isLoading} = useQuery(
        ['geocodingStaticMap', lon, lat],
        getGeocodingStaticMap,
        { 
            enabled: lat !== "" && lon !== "",
            retry: 1,
        }
    )

    return {data, isLoading}
}

export const useGeocodingForward = (value: string) => {
    const getMapGeocodingForward = async () => {
        try {
            
            const res = await fetch(`${API_BASE_URL}/api/geocoder/forward/${value}`);

            if(!res.ok){
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();

            return data;

        } catch (error) {
            console.log(error);
            return undefined;
        }
    }

    const {data, isLoading} = useQuery(
        ['getMapGeocodingForward', value],
        getMapGeocodingForward,
        {
            enabled: value !== "",
            retry: 1,
        }
    )

    return {data, isLoading}
}

export const useGeocodingReverse = (lng:string, lat:string) => {
    const getMapGeocodingReverse = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/geocoder/reverse/${lat}/${lng}`);
           
            if(!res.ok){
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();

            return data;
        } catch (error) {
            console.log(error);
            return undefined;
        }
    }

    const {data, isLoading} = useQuery(
        ['getMapGeocodingReverse',lng,lat],
        getMapGeocodingReverse,
        {
            enabled: lat !== "" && lng !== "",
            retry: 1,
        }
    );

    return {data, isLoading};
}




