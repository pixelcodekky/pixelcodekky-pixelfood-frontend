import {useState, useMemo, useEffect, useRef, useCallback} from 'react';
import Map, {
  Marker,
  Popup,
  NavigationControl,
  GeolocateControl,
  MapLayerMouseEvent,
  ViewStateChangeEvent,
  GeolocateResultEvent,
  MapRef
} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useDispatch } from 'react-redux';
import { Restaurant, RestaurantAddress, RestaurantSearchResponse, SearchState, ViewMapState } from '@/types';
import { MapViewSelector, setViewport } from '@/statemgmt/map/MapViewSlice';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '@/statemgmt/hooks';
import { useSearchRestaurants } from '@/api/RestaurantApi';
import SearchResultCard from '../SearchResultCard';
import CurrentPin from '../MapResource/CurrentPin';

const TOKEN = import.meta.env.VITE_MAPBOX_API_KEY;

export const MapGLDefault = () => {
    const dispatch = useDispatch();
    const mapState = useAppSelector(MapViewSelector);
    const profileState = useAppSelector((x) => x.profile);
    const searchStateSelector: SearchState = useAppSelector((s) => s.searchPage);
    const [searchState, setSearchState] = useState<SearchState>({
      ...searchStateSelector,
      page: 0
    });
    
    const { results , isLoading } = useSearchRestaurants(searchState ,"");

    //results reload
    //page start
    // useEffect(() => {
    //   const load = () => {
    //     let res = calculateDistanceHelper(profileState, results ?? undefined);
    //     setRestaurants(res);
    //   }
    //   load();
    // }, [results])

    //searchSelect reload
    useEffect(() => {
      let newState = {...searchState};
      newState.selectedCuisines = searchStateSelector.selectedCuisines;
      setSearchState({ ...newState});
    },[searchStateSelector]);

    let initPopup: Restaurant = {
      _id: '',
    user: '',
    restaurantName: '',
    city: '',
    country: '',
    deliveryPrice: 0,
    estimatedDeliveryTime: 0,
    cuisines: [],
    menuItems: [],
    imageUrl: '',
    address: [{
        display_name: '',
        name: '',
        lat: 0,
        lon: 0,
        city: '',
        country: '',
        country_code: '',
        postcode: '',
    }]
    }

    interface PopupState {
      isOpen: boolean;
      data?: Restaurant;
    }

    const [popupInfo, setPopupInfo] = useState<PopupState>({isOpen: false});
    const mapRef = useRef<MapRef>(null);

    //only create function depend on event
    const onMove = useCallback((e: ViewStateChangeEvent) => {
        const onMoveState: ViewMapState = {
            mapStyle: mapState.mapStyle,
            viewState: {
                latitude: e.viewState.latitude,
                longitude: e.viewState.longitude,
                zoom: e.viewState.zoom,
            }
        }

        dispatch(setViewport(onMoveState));
    }, []);

    const handleGeolocate = (e: GeolocateResultEvent) => {
        //drop custom pin on Map
        //setGeoLocateLatSelected(e.coords.latitude);
        //setGeoLocateLonSelected(e.coords.longitude);
    }

    const RenderPopup = useMemo(() => {
      if (!popupInfo.isOpen) return null;
      
      const popupAddress: RestaurantAddress = popupInfo.data?.address[0] as RestaurantAddress;
      return (
        <>
          <Popup
            key={`index_${popupAddress.lat}`}
            latitude={popupAddress.lat}
            longitude={popupAddress.lon}
            anchor='bottom'
            onClose={() => setPopupInfo({...popupInfo, isOpen: false})}
            closeButton={false}
          >
            <div>
            <SearchResultCard restaurant={popupInfo.data ?? initPopup} isPopup={false}/>
            </div>
            
          </Popup>
        </>
        
      )
    }, [popupInfo])

    const RenderCurrentLocation = useMemo(() => {
      if(profileState.full_value !== ''){
        return (
          <>
            <div className='animate-bounce'>
              <Marker 
                key={profileState.key}
                latitude={profileState.lat}
                longitude={profileState.lng}
                anchor='top'
              >
              <CurrentPin className={`animate-bounce`} />
              </Marker>
              
            </div>
          </>
        )
      }
    }, [])

    const RenderMarker = useMemo(() => {
      return results?.data.map((d, i) => {
          let address: RestaurantAddress = d.address[0];
          if(address){
            return (
              <>
                <div key={`${d._id}`}>
                  <Marker
                    style={{
                      cursor: 'pointer'
                    }}
                    key={`${d._id}`}
                    latitude={address.lat}
                    longitude={address.lon}
                    anchor='top'
                    onClick={(e) => {
                        e.originalEvent.stopPropagation()
                        setPopupInfo({...popupInfo, isOpen: true, data: d})
                        mapRef.current?.flyTo({
                          center: [address.lon, address.lat],
                          //zoom: 13
                        })
                      }
                    }
                  >
                  </Marker>
                 
                </div>
              </>
              
            )
          }
      })
    },[results]);

    return (
    <>
        {isLoading ?? (
          <div>Loading...</div>
        )}

        <Map
          {...mapState.viewState}
          ref={mapRef}
          style={{            
            width:'100%',
            height: '43rem',
            position: "relative",
            zIndex:0,
          }}
          reuseMaps={true}
          mapStyle={mapState.mapStyle} 
          mapboxAccessToken={TOKEN}
          onClick={(e) => {
          }}
          onMove={onMove}
          testMode={true}
        >
          <NavigationControl position='top-right' showCompass={false} />
          <GeolocateControl 
            position='top-right' 
            showAccuracyCircle={false} 
            showUserLocation={true}
            showUserHeading={true}
            onGeolocate={(e) => handleGeolocate(e)} />
          
          {!isLoading && RenderMarker}
          {popupInfo.isOpen && RenderPopup}
          {RenderCurrentLocation}
          
        </Map>
    </>
    )
}



