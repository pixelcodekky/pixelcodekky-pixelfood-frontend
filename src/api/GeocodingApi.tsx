import { useQuery } from "react-query";

const MAPBOX_GEOCODING_URL = import.meta.env.VITE_MAPBOX_GEOCODING_URL;
const MAPBOX_GEOCODING_STATIC_MAP_URL = import.meta.env.VITE_MAPBOX_GEOCODING_STATIC_MAP_URL;
const MAPBOX_API_KEY = import.meta.env.VITE_MAPBOX_API_KEY;

export const useGetGeocodingStaticMap = (lon:string, lat:string) => {
    const getGeocodingStaticMap = async () => {
        const accessToken = MAPBOX_API_KEY;
        const url = `${MAPBOX_GEOCODING_STATIC_MAP_URL}`
    
        //overlay,lon,lat,zoom,size
        let size = '500x300';
        let location = `${lon},${lat},14`
        let strGeoJson = `geojson({"type": "Point", "coordinates": [${lon},${lat}]})`;
        let addPath = `${strGeoJson}/${location}/${size}`;
    
        const res = await fetch(`${url}${addPath}?access_token=${accessToken}`);
    
        //const res = await fetch('https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/-122.4403,37.8002,14,10/500x200@2x?access_token=pk.eyJ1IjoicGl4ZWxzb2Z0IiwiYSI6ImNsdjB1eGljdzAwN3EycXI5dzliYW9vc2EifQ.Bw5nFKXpCLgGXMQ8Bn5vIQ');
        
        if(res.status === 404){
            return null;
        }

        const blob = await res.blob();

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                console.log(reader);
                const base64string = reader.result as string;
                resolve(base64string);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        })
    
    }

    const {data: results, isLoading} = useQuery(
        'fetchgetGeocodingStaticMap',
        getGeocodingStaticMap
    )

    return {results, isLoading};
}

export const getGeocodingStaticMap = async (lon:string, lat:string) => {
    const accessToken = MAPBOX_API_KEY;
    const url = `${MAPBOX_GEOCODING_STATIC_MAP_URL}`

    const buildParams = {
        overlay:`pin-s+#1a6b11(${lon},${lat})`,
        lon:lon,
        lat:lat,
        zoom:'14',
        bearing:'0',
        size:'500x300@2x',
    }

    const queryString = new URLSearchParams(buildParams).toString();

    const reqOptions = {
        method: 'GET'
    }

    const res = await fetch(`${url}${queryString}?access_token=${accessToken}`, reqOptions);

    return res;

}

export const getMapGeocodingForward = async (value:string) => {
    const accessToken = MAPBOX_API_KEY;
    const url = `${MAPBOX_GEOCODING_URL}forward?`

    const buildParams = {
        q: value,
        limit: "5",
        country:"sg",
        types:"postcode,address,secondary_address,street",
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
            types:"postcode,address,secondary_address,street",
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

export const getMapGeocodingReverse = async (lng:string, lat:string) => { 
    const accessToken = MAPBOX_API_KEY;
    const url = `${MAPBOX_GEOCODING_URL}reverse?`
    const buildParams = {
        longitude: lng,
        latitude: lat,
        country:"sg",
        types:"postcode,address,secondary_address,street",
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

export const useGetMapboxGeocodingReverse = (lng: string, lat:string) => {
    const getMapGeocodingReverse = async () => { 
        const accessToken = MAPBOX_API_KEY;
        const url = `${MAPBOX_GEOCODING_URL}reverse?`
        const buildParams = {
            longitude: lng,
            latitude: lat,
            country:"sg",
            types:"postcode,address,secondary_address,street",
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

    const {data: results, isLoading, isError, isFetching} = useQuery(
        'fetchGeocodingReverse',
        async () => {
            return getMapGeocodingReverse();
        },
        { enabled: lat !== "" && lng !== "" }
    )

    return {results, isLoading, isFetching, isError};


}


