import { getMapGeocodingReverse } from '@/api/GeocodingApi';
import { geocodingmapping } from '@/common/GoecodingTypeMatch';
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
    
    useEffect(() => {
        const load = async () => {
          if((lng !== undefined || lng !== "") && (lat !== undefined || lat !== "")){
            let profile = await getMapGeocodingReverse(lng ?? "", lat ?? "");
            if(profile['features'] !== undefined && profile['features'].length > 0){
              var formatdata = geocodingmapping(profile);
              if(formatdata[0]){
                    let searchResult = {
                            value: formatdata[0].properties.name,
                            key: formatdata[0].properties.mapbox_id,
                            full_value: formatdata[0].properties.full_address,
                            lat: formatdata[0].properties.coordinates.latitude,
                            lng: formatdata[0].properties.coordinates.longitude
                    };
                    dispatch(setProfile(searchResult));
              }
              
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