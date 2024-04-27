import {useState, useMemo, useEffect, useRef, useCallback} from 'react';
import Map, {
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
  MapLayerMouseEvent,
  ViewStateChangeEvent,
  GeolocateResultEvent,
  MapRef
} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useDispatch } from 'react-redux';
import { SearchState, ViewMapState } from '@/types';
import { MapViewSelector, setViewport } from '@/statemgmt/map/MapViewSlice';
import { useParams } from 'react-router-dom';
import { useSearchRestaurants } from '@/api/RestaurantApi';
import { LucidePersonStanding } from 'lucide-react';
import { useAppSelector } from '@/statemgmt/hooks';

const TOKEN = import.meta.env.VITE_MAPBOX_API_KEY;

export const MapGLDefault = () => {

    const dispatch = useDispatch();
    const mapState = useAppSelector(MapViewSelector);
    const searchStateSelector: SearchState = useAppSelector((s) => s.searchPage);
    const {city} = useParams();
    const [searchState, setSearchState] = useState<SearchState>({
      ...searchStateSelector,
      page: 0
    });
    const { results, isLoading } = useSearchRestaurants(searchState ,city);

    const [popupInfo, setPopupInfo] = useState("");
    const mapRef = useRef<MapRef>(null);

    const [geoLocateLatSelected, setGeoLocateLatSelected] = useState<number>(0);
    const [geoLocateLonSelected, setGeoLocateLonSelected] = useState<number>(0);

    const handleMapOnClick = (e: MapLayerMouseEvent) => {
      setGeoLocateLatSelected(e.lngLat.lat);
      setGeoLocateLonSelected(e.lngLat.lng);
    }

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

    return (
    <>
        <Map
          {...mapState.viewState}
          ref={mapRef}
          style={{            
            width:'100%',
            height: '50rem',
            position: "relative",
            zIndex:0,
          }}
          reuseMaps
          mapStyle={mapState.mapStyle} 
          mapboxAccessToken={TOKEN}
          onClick={(e) => {handleMapOnClick(e)}}
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

          {(geoLocateLatSelected && geoLocateLonSelected) && (
             <Marker
                latitude={geoLocateLatSelected}
                longitude={geoLocateLonSelected}
                anchor='bottom'
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  setPopupInfo(`You ${e.type}`);
                }}
              >
             </Marker> 
          )}

          {popupInfo && (
              <Popup
                anchor='top'
                latitude={geoLocateLatSelected}
                longitude={geoLocateLonSelected}
                onClose={() => setPopupInfo("")}
              >
                {popupInfo}
              </Popup>
          )}

          {isLoading ? (
            <LucidePersonStanding />
          ) : (
            <></>
          )}

        </Map>
    </>
    )
}
