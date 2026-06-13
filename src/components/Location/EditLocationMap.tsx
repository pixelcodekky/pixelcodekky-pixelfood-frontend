import { useCallback, useEffect, useRef, useState } from 'react'
import Map, {
    Marker,
    ViewStateChangeEvent,
    MapRef
  } from 'react-map-gl';
import SearchBarGeolocation from '../Search/SearchBarGeolocation';
import { Button } from '../ui/button';
import { Locate, Search } from 'lucide-react';
import SearchResultList from '../Search/SearchResultList';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/statemgmt/hooks';
import { MapViewSelector, setViewport } from '@/statemgmt/map/MapViewSlice';
import { SearchResultType } from '@/types';
import { useGeocodingReverse } from '@/api/GeocodingApi';
import { generateuuid, useGeocodingSearch } from '@/common';
import CurrentPin from '../MapResource/CurrentPin';
import { setProfile } from '@/statemgmt/profile/ProfileReducer';
import { setIsEdit } from '@/statemgmt/location/EditLocationSlice';
import SavedAddressList from '../Search/SavedAddressList';
import { useAuth0 } from '@auth0/auth0-react';

const TOKEN = import.meta.env.VITE_MAPBOX_API_KEY;

interface Coordinate {
    lat: number,
    lng: number
}

type Props = {
    customClass: string;
}

const EditLocationMap = ({ customClass }: Props) => {
    const { isAuthenticated } = useAuth0();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const mapState = useAppSelector(MapViewSelector);
    const mapRef = useRef<MapRef>(null);

    const [selectedAddress, setSelectedAddress] = useState("");
    const [locateMeCoord, setLocateMeCoord] = useState<Coordinate>({ lat: 0, lng: 0 });
    const [showSavedAddress, setShowSavedAddress] = useState(false);

    const {
        inputValue,
        hideSuggestion,
        searchResults,
        selectedResult,
        setSelectedResult,
        isDebounceLoading,
        clearSearch,
        onSelect,
        onChange,
    } = useGeocodingSearch();

    const { data: geocodeReverse } = useGeocodingReverse(
        locateMeCoord.lng.toString(),
        locateMeCoord.lat.toString()
    );

    useEffect(() => {
        if (locateMeCoord.lat !== 0 && locateMeCoord.lng !== 0) {
            mapRef.current?.flyTo({ center: [locateMeCoord.lng, locateMeCoord.lat], zoom: 17 });
        }

        if (geocodeReverse !== undefined && locateMeCoord.lat !== 0 && locateMeCoord.lng !== 0) {
            const coords = geocodeReverse.payload;
            if (coords.length > 0) {
                const feature = coords[0].properties;
                const result: SearchResultType = {
                    value: feature.name,
                    key: feature.mapbox_id,
                    full_value: feature.full_address,
                    lat: feature.coordinates.latitude,
                    lng: feature.coordinates.longitude,
                };
                setSelectedAddress(feature.full_address);
                setSelectedResult(result);
            }
        }
    }, [locateMeCoord, geocodeReverse]);

    const handleSearchSelected = (result: SearchResultType) => {
        onSelect(result);
        setSelectedAddress(result.full_value);
        setLocateMeCoord({ lat: result.lat || 0, lng: result.lng || 0 });
    }

    const handleSearchSubmit = () => {
        if (selectedResult.full_value !== '') {
            setLocateMeCoord({ lat: selectedResult.lat || 0, lng: selectedResult.lng || 0 });
            setSelectedAddress(selectedResult.full_value);
        }
        clearSearch();
    }

    const handleClearAll = () => {
        clearSearch();
        setSelectedAddress("");
    }

    const handleLocateMe = () => {
        navigator.geolocation.getCurrentPosition(({ coords }) => {
            setLocateMeCoord({ lat: coords.latitude, lng: coords.longitude });
        });
    }

    const handleUpdateLocation = () => {
        if (selectedResult.full_value !== '') {
            dispatch(setProfile(selectedResult));
            navigate({ pathname: `/search/${selectedResult.lng}/${selectedResult.lat}` });
            dispatch(setIsEdit());
        }
    }

    const mapStyleRef = useRef(mapState.mapStyle);
    mapStyleRef.current = mapState.mapStyle;

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

    const RenderMarker = () => {
        if (locateMeCoord.lat === 0 && locateMeCoord.lng === 0) return null;
        return (
            <Marker
                key={generateuuid()}
                latitude={locateMeCoord.lat}
                longitude={locateMeCoord.lng}
                anchor='bottom'
            >
                <CurrentPin className='animate-bounce' />
            </Marker>
        );
    }

    return (
        <>
            <div className={customClass}>
                {!showSavedAddress ? (
                    <>
                        <div className='my-2'>
                            <div className='flex flex-row items-center'>
                                <div className='flex flex-col w-full'>
                                    <SearchBarGeolocation
                                        placeHolder='enter street name or postcode and select'
                                        SetInputValue={onChange}
                                        setGeocodingCollectionState={handleClearAll}
                                        clearInput={hideSuggestion}
                                        InputValue={inputValue}
                                        selectedAddress={selectedAddress}
                                        onSubmit={handleSearchSubmit}
                                    />
                                </div>
                                <div className='flex flex-row'>
                                    <Button
                                        variant='secondary'
                                        className='flex flex-row items-center justify-center gap-1 hover:bg-green-500 hover:text-white'
                                        onClick={handleLocateMe}
                                    >
                                        <Locate size={18} strokeWidth={2.5} />
                                        <span className='hidden md:block'>Locate Me</span>
                                    </Button>
                                </div>
                            </div>

                            {isDebounceLoading ? (
                                <div className='w-full flex flex-col relative'>
                                    <div className='flex flex-row p-4 gap-2 z-10 min-h-10 absolute w-full rounded-lg shadow-xl bg-zinc-100'>
                                        <Search className='animate-bounce' /><span className='animate-bounce'> Loading...</span>
                                    </div>
                                </div>
                            ) : null}

                            {searchResults.length > 0 ? (
                                <div className='w-full flex flex-col relative'>
                                    <SearchResultList
                                        results={searchResults}
                                        handler={handleSearchSelected}
                                        className={hideSuggestion ? "invisible" : "visible"}
                                    />
                                </div>
                            ) : null}
                        </div>

                        <div className='relative flex flex-col w-full h-full border-2'>
                            <Map
                                initialViewState={mapState.viewState}
                                style={{ width: '100%', height: '100%', zIndex: 0 }}
                                ref={mapRef}
                                reuseMaps={true}
                                mapStyle={mapState.mapStyle}
                                mapboxAccessToken={TOKEN}
                                onMoveEnd={onMoveEnd}
                                testMode={true}
                                onClick={(e) => {
                                    e.originalEvent.stopPropagation();
                                    setLocateMeCoord({ lat: e.lngLat.lat, lng: e.lngLat.lng });
                                }}
                            >
                                {RenderMarker()}
                            </Map>
                            {selectedAddress !== '' && (
                                <div className='absolute flex flex-col w-full items-center justify-center p-2 bg-opacity-70 bg-green-400'>
                                    <label className='font-medium'>{selectedAddress}</label>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className='flex flex-col mt-5'>
                        {selectedAddress !== '' && (
                            <div className='flex flex-row w-full items-center justify-center p-2 bg-opacity-70 bg-green-400'>
                                <label className='font-medium'>{selectedAddress}</label>
                            </div>
                        )}
                        <div className='w-full flex flex-row animate-fadeIn'>
                            <SavedAddressList className='block' handler={handleSearchSelected} asAbsoluteClass={false} />
                        </div>
                    </div>
                )}

                <div className='flex flex-row w-full mt-5 justify-between'>
                    <Button
                        className='bg-green-600 hover:bg-white hover:text-green-500'
                        onClick={(e) => { e.stopPropagation(); handleUpdateLocation(); }}
                        disabled={selectedAddress === ""}
                    >
                        Update Location
                    </Button>
                    {isAuthenticated && (
                        <Button
                            className='bg-white text-green-500 hover:bg-green-500 hover:text-white'
                            onClick={(e) => { e.stopPropagation(); setShowSavedAddress(!showSavedAddress); }}
                        >
                            {showSavedAddress ? "Show Map" : "Show Saved Address"}
                        </Button>
                    )}
                </div>
            </div>
        </>
    );
}

export default EditLocationMap
