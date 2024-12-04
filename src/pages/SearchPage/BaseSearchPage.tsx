import { useGeocodingReverse } from '@/api/GeocodingApi';
import { useAppSelector } from '@/statemgmt/hooks';
import { setProfile } from '@/statemgmt/profile/ProfileReducer';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

type  Props = {
    children: React.ReactNode,
}

type SearchParams = {
    lng: string;
    lat: string;
  }

const BaseSearchPage = ({children}: Props) => {
    const dispatch = useDispatch();
    const profileState = useAppSelector((x) => x.profile);
    const { lng, lat } = useParams<SearchParams>();
    const { data, isLoading: _ } = useGeocodingReverse(lng || "", lat || "");
    
    useEffect(() => {
        const load = async () => {
          if((lng !== undefined || lng !== "") && (lat !== undefined || lat !== "")){
            let profile = data.payload; //await getMapGeocodingReverse(lng ?? "", lat ?? "");
            
            if(profile !== undefined){
              let searchResult = {
                  value: profile[0].properties.name,
                  key: profile[0].properties.mapbox_id,
                  full_value: profile[0].properties.full_address,
                  lat: profile[0].properties.coordinates.latitude,
                  lng: profile[0].properties.coordinates.longitude
              };
              dispatch(setProfile(searchResult));
            }

          }
        }
        if(profileState.lat === 0 && profileState.lat === 0){
          load();
        } 
        
    }, [])

    return (
        <div>
            {children}
        </div>
    )
}

export default BaseSearchPage