import { useGetMapboxGeocodingReverse } from '@/api/GeocodingApi';
import { geocodingmapping } from '@/common/GoecodingTypeMatch';
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
    const { lng, lat } = useParams<SearchParams>();
    const {results: profileResult, isLoading: profileLoading} = useGetMapboxGeocodingReverse(lng ?? "", lat ?? "");
    
    useEffect(() => {
        const load = async () => {
          if((lng !== undefined || lng !== "") && (lat !== undefined || lat !== "")){
            if(!profileLoading){
              var formatdata = geocodingmapping(profileResult);
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
        load();
    }, [lng, lat, profileLoading, profileResult])

    return (
        <div>
            {children}
        </div>
    )
}

export default BaseSearchPage