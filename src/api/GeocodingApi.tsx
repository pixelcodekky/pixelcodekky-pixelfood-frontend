import { GeocodedFeature } from "@/types";
import { useQuery } from "react-query";

const MAPBOX_GEOCODING_URL = import.meta.env.VITE_MAPBOX_GEOCODING_URL;
const MAPBOX_API_KEY = import.meta.env.VITE_MAPBOX_API_KEY;

export const getMapGeocodingForward = async (value:string) => {
    const accessToken = MAPBOX_API_KEY;
    const url = `${MAPBOX_GEOCODING_URL}forward?`

    const buildParams = {
        q: value,
        country:"sg",
        types:"postcode,address",
        access_token: accessToken
    }

    const queryString = new URLSearchParams(buildParams).toString();

    const reqOptions = {
        method: 'GET'
    }

    const res = await fetch(`${url}${queryString}`, reqOptions);

    if(!res.ok){
        throw new Error(`HTTP error! status: ${res.status}`);
    }
    var result = await res.json();
    return result;
}


export const useGetMapboxGeocodingForward = (location:string) => {
    const getGeocodingForward = async () => {
        
        const accessToken = MAPBOX_API_KEY;
        const url = `${MAPBOX_GEOCODING_URL}forward?`

        const params = {
            q:location,
            country:"sg",
            types:"postcode,address",
            access_token: accessToken
        }

        const queryString = new URLSearchParams(params).toString();

        const reqOptions = {
            method: 'GET'
        }

        const res = await fetch(`${url}${queryString}`, reqOptions);
        
        if(!res.ok){
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        var result = await res.json();
        
        return result;
    }

    const {data: results, isLoading} = useQuery(
        'fetchGeocodingforward',
        getGeocodingForward
    )

    return {results, isLoading};
}


