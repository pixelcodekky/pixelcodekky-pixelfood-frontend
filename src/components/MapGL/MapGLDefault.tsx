import {useState, useMemo, useEffect, useRef, useCallback} from 'react';
import Map, {
  Marker,
  Popup,
  NavigationControl,
  GeolocateControl,
  MapRef,
  ViewStateChangeEvent,
} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useDispatch } from 'react-redux';
import { Restaurant, RestaurantAddress, SearchState } from '@/types';
import { MapViewSelector, setViewport } from '@/statemgmt/map/MapViewSlice';
import { useAppSelector } from '@/statemgmt/hooks';
import { useSearchRestaurants } from '@/api/RestaurantApi';
import SearchResultCard from '../SearchResultCard';
import CurrentPin from '../MapResource/CurrentPin';

const TOKEN = import.meta.env.VITE_MAPBOX_API_KEY;

const EMPTY_RESTAURANT: Restaurant = {
    _id: '', user: '', restaurantName: '', city: '', country: '',
    deliveryPrice: 0, estimatedDeliveryTime: 0, cuisines: [], menuItems: [], imageUrl: '',
    address: [{ display_name: '', name: '', lat: 0, lon: 0, city: '', country: '', country_code: '', postcode: '' }]
};

interface PopupState {
    isOpen: boolean;
    data?: Restaurant;
}

export const MapGLDefault = () => {
    const dispatch = useDispatch();
    const mapState = useAppSelector(MapViewSelector);
    const profileState = useAppSelector((x) => x.profile);
    const searchStateSelector: SearchState = useAppSelector((s) => s.searchPage);
    const [searchState, setSearchState] = useState<SearchState>({
      ...searchStateSelector,
      page: 0
    });

    const { results, isLoading } = useSearchRestaurants(searchState);

    // Fly to user's selected address — map owns its viewport, no state update needed
    useEffect(() => {
      if (profileState.lat !== 0 && profileState.lng !== 0) {
        mapRef.current?.flyTo({
          center: [profileState.lng, profileState.lat],
          zoom: 16,
        });
      }
    }, [profileState.lat, profileState.lng]);

    // Sync cuisine filter changes
    useEffect(() => {
      setSearchState((prev) => ({ ...prev, selectedCuisines: searchStateSelector.selectedCuisines }));
    }, [searchStateSelector.selectedCuisines]);

    const [popupInfo, setPopupInfo] = useState<PopupState>({ isOpen: false });
    const mapRef = useRef<MapRef>(null);

    // Use a ref so onMoveEnd never needs to be recreated when mapStyle changes
    const mapStyleRef = useRef(mapState.mapStyle);
    mapStyleRef.current = mapState.mapStyle;

    // Sync final position to Redux only once the user stops moving — no per-frame renders
    const onMoveEnd = useCallback((e: ViewStateChangeEvent) => {
        dispatch(setViewport({
            mapStyle: mapStyleRef.current,
            viewState: {
                latitude: e.viewState.latitude,
                longitude: e.viewState.longitude,
                zoom: e.viewState.zoom,
            }
        }));
    }, [dispatch]);

    const RenderPopup = useMemo(() => {
      if (!popupInfo.isOpen) return null;
      const popupAddress: RestaurantAddress = popupInfo.data?.address[0] as RestaurantAddress;
      return (
        <Popup
          latitude={popupAddress.lat}
          longitude={popupAddress.lon}
          anchor='bottom'
          onClose={() => setPopupInfo({ isOpen: false })}
          closeButton={false}
        >
          <SearchResultCard restaurant={popupInfo.data ?? EMPTY_RESTAURANT} isPopup={false}/>
        </Popup>
      );
    }, [popupInfo]);

    const RenderCurrentLocation = useMemo(() => {
      if (profileState.full_value === '') return null;
      return (
        <Marker
          latitude={profileState.lat}
          longitude={profileState.lng}
          anchor='top'
        >
          <CurrentPin className='animate-bounce' />
        </Marker>
      );
    }, [profileState.lat, profileState.lng, profileState.full_value]);

    const RenderMarker = useMemo(() => {
      return results?.data.map((d, i) => {
          const address: RestaurantAddress = d.address[0];
          if (!address) return null;
          return (
            <Marker
              key={`${d._id}_${i}`}
              style={{ cursor: 'pointer' }}
              latitude={address.lat}
              longitude={address.lon}
              anchor='top'
              onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  setPopupInfo({ isOpen: true, data: d });
                  mapRef.current?.flyTo({ center: [address.lon, address.lat] });
              }}
            />
          );
      });
    }, [results]);

    return (
    <>
        {isLoading && <div>Loading...</div>}

        <Map
          initialViewState={mapState.viewState}
          ref={mapRef}
          style={{ width: '100%', height: '43rem', position: 'relative', zIndex: 0 }}
          reuseMaps={true}
          mapStyle={mapState.mapStyle}
          mapboxAccessToken={TOKEN}
          onMoveEnd={onMoveEnd}
          testMode={true}
        >
          <NavigationControl position='top-right' showCompass={false} />
          <GeolocateControl
            position='top-right'
            showAccuracyCircle={false}
            showUserLocation={true}
            showUserHeading={true}
          />

          {!isLoading && RenderMarker}
          {popupInfo.isOpen && RenderPopup}
          {RenderCurrentLocation}
        </Map>
    </>
    );
}



