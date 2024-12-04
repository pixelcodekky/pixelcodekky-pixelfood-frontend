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
import { Feature, SearchResultType, ViewMapState } from '@/types';
import { useGeocodingForward, useGeocodingReverse } from '@/api/GeocodingApi';
import { generateuuid, useDebounce } from '@/common/Utilities';
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

const EditLocationMap = ({customClass}:Props) => {

    const { isAuthenticated } = useAuth0();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const mapState = useAppSelector(MapViewSelector);
    const mapRef = useRef<MapRef>(null);

    const [hideSuggestion, setHideSuggestion] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [selectedAddress, setSelectedAddress] = useState("");
    const [_isRequesting, setIsRequesting] = useState(false);
    const [isSelected, setIsSelected] = useState(false);
    const [selectedSearchResultType, setSelectedSearchResultType] = useState<SearchResultType>({
        value: '',
        key: '',
        full_value: '',
        lat: 0,
        lng: 0,
    });
    const [searchResultsType, setSearchResultsType] = useState<SearchResultType[]>([]);
    const [geocodingCollectionState, setGeocodingCollectionState] = useState<Feature[]>([]);
    const [locateMeCoord, setLocateMeCoord] = useState<Coordinate>({lat:0, lng:0});
    const [showSavedAddress, setShowSavedAddress] = useState(false);
    const {data: geocodeFroward, isLoading: _isLoadingGeocodeForward} = useGeocodingForward(inputValue);
    const {data: geocodeReverse, isLoading: _isLoadingGeocodeReverse} = useGeocodingReverse(locateMeCoord.lng.toString() || "", locateMeCoord.lat.toString() || "")

    //#region Search 
    useEffect(() => {
        debounceRequest(inputValue);
    }, [inputValue]);

    useEffect(() => {
        populateSearchResult();
    }, [geocodingCollectionState])

    useEffect(() => {
        mapRef.current?.flyTo({
            center: [locateMeCoord.lng, locateMeCoord.lat],
            zoom: 17
        });
        
        const load = async () => {
            if(geocodeReverse !== undefined){
                let selectedcoords = geocodeReverse.payload; //await getMapGeocodingReverse(locateMeCoord.lng.toString() || "", locateMeCoord.lat.toString() || "");
                if(selectedcoords.length > 0){
                    setSelectedAddress(selectedcoords[0].properties.full_address);
                    
                    const data = populateSelectedSearchResult(selectedcoords);
                    setSelectedSearchResultType(data as SearchResultType);
                }
            }
        };

        if(locateMeCoord.lat !== 0 && locateMeCoord.lng !== 0){
            load();
        }
        
    }, [locateMeCoord, geocodeReverse]);

    const handleSearchSubmit = () => {
        //send lat long to Map
        if(isSelected){
            let address = selectedSearchResultType;
            setLocateMeCoord({ 
                lat: address.lat || 0,
                lng: address.lng || 0
            });
            setSelectedAddress(address.full_value);
        }
        handleClearGeocoder();
    }

    const handleOnChange = async (value: string) => {
        // if(value.length > 0) {
        //     setIsRequesting(true);
        // }
        if(value.length == 0) {
            hideIsRequesting();
            setHideSuggestion(true);
            setInputValue("");
            setIsSelected(false);
            clearDebounce();
        }else{
            if(!isSelected){
                setHideSuggestion(false);
                //let res = await getMapGeocodingForward(value); // API Call
                //geocodingCollection = await getMapGeocodingForward(value); //geocodingmapping(res);
                //setGeocodingCollectionState(geocodingCollection);
                if(geocodeFroward.payload !== undefined && geocodeFroward.payload.length > 0)
                    setGeocodingCollectionState(geocodeFroward.payload);
            }
            
        }
    }

    const {debounceFunction, clearDebounce, isLoading: isDebounceLoading} = useDebounce(handleOnChange);
    const debounceRequest = useCallback((value: string) => debounceFunction(value), [inputValue]);

    const populateSelectedSearchResult = (data:any) => {
        if(data.length > 0) {
            const featureProp = data[0].properties;
            return {
                value: featureProp.name,
                key: featureProp.mapbox_id,
                full_value: featureProp.full_address,
                lat: featureProp.coordinates.latitude,
                lng: featureProp.coordinates.longitude
            }
        }else{
            return null;
        }

    }

    const populateSearchResult = () => {
        let res = geocodingCollectionState.map((data) => {
            return {
                value: data.properties.name,
                key: data.properties.mapbox_id,
                full_value: data.properties.full_address,
                lat: data.properties.coordinates.latitude,
                lng: data.properties.coordinates.longitude
            }
        });
        if(res.length == 0){
            setHideSuggestion(true);
        }
        setSearchResultsType(res);
        hideIsRequesting();
    }

    const handleClearGeocoder = () => {
        setGeocodingCollectionState([]);
        setHideSuggestion(true);
        setSelectedAddress("");
        hideIsRequesting();
        setInputValue("");
        setIsSelected(false);
        clearDebounce();
    }

    const handleSearchSelected = (searchResult:SearchResultType) => {
        setInputValue(searchResult.full_value);
        setSelectedSearchResultType(searchResult);
        setIsSelected(true);
        setSelectedAddress(searchResult.full_value);
        setLocateMeCoord({ 
            lat: searchResult.lat || 0,
            lng: searchResult.lng || 0
        });
        
    }

    const hideIsRequesting = () => {
        setIsRequesting(false);
    }

    const handleLocateMe = async () => {
        navigator.geolocation.getCurrentPosition(position => {
            const {coords} = position;
            const lat = coords.latitude;
            const lng = coords.longitude;
            setLocateMeCoord({ 
                lat: lat || 0,
                lng: lng || 0
            });
            
        });
    }

    const handleUpdateLocation = () => {
        if(selectedSearchResultType.full_value !== ''){
            dispatch(setProfile(selectedSearchResultType));
            let address = selectedSearchResultType;
            navigate({
                pathname: `/search/${address.lng}/${address.lat}`,
            });
            dispatch(setIsEdit()); // hide model
        }
    }
    //#endregion Search

    //#region MapFunction

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

    const RenderMarker = () => {
        if(locateMeCoord.lat !== 0 && locateMeCoord.lng !== 0){
            return (
                <>
                    <Marker
                        key={`${generateuuid}`}
                        latitude={locateMeCoord.lat}
                        longitude={locateMeCoord.lng}
                        anchor='bottom'                       
                    >
                        <CurrentPin className={`animate-bounce`}/>
                    </Marker> 
                </>
            )
        }
    }

    const handleMapOnClick = async (lng:number, lat: number) => {
        setLocateMeCoord({lat: lat, lng: lng});
        
    }

    //#endregion MapFunction

    
    return (
        <>
            <div className={`${customClass}`}>
                {!showSavedAddress ? (
                    <>
                        <div className={`my-2`}>
                    
                            <div className='flex flex-row items-center'>
                                <div className='flex flex-col w-full'>
                                    <SearchBarGeolocation 
                                        placeHolder='enter street name or postcode and select' 
                                        setGeocodingCollectionState={handleClearGeocoder}
                                        clearInput={hideSuggestion}
                                        InputValue={inputValue}
                                        SetInputValue={setInputValue}
                                        selectedAddress={selectedAddress}
                                        onSubmit={handleSearchSubmit}
                                    />
                                </div>
                                <div className='flex flex-row'>
                                    <Button variant={'secondary'} 
                                        className='flex flex-row items-center justify-center gap-1 hover:bg-green-500 hover:text-white'
                                        onClick={() => handleLocateMe()}>
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

                            {searchResultsType.length > 0 ? (
                                <div className='w-full flex flex-col relative'>
                                    <SearchResultList results={searchResultsType} handler={handleSearchSelected} className={hideSuggestion ? "invisible" : "visible"}/>   
                                </div>
                            ) : null}
                        </div>
                        <div className={`relative flex flex-col w-full h-full border-2`}>
                            <Map 
                                {...mapState.viewState}
                                style={{            
                                    width:'100%',
                                    height: '100%',
                                    zIndex:0,
                                }}
                                ref={mapRef}
                                reuseMaps={true}
                                mapStyle={mapState.mapStyle} 
                                mapboxAccessToken={TOKEN}
                                onMove={onMove}
                                testMode={true}
                                onClick={(e) => {
                                    e.originalEvent.stopPropagation();
                                    handleMapOnClick(e.lngLat.lng, e.lngLat.lat);
                                }}
                            >
                                {RenderMarker()}
                            </Map>
                            {selectedAddress !== '' ? (
                                <div className='absolute flex flex-col w-full items-center justify-center p-2 bg-opacity-70 bg-green-400'>
                                    <label className='font-medium'>{selectedAddress}</label>
                                </div>
                            ) : (
                                null
                            )} 
                        </div>
                    </>
                ): (
                    <div className={`flex flex-col mt-5`}>
                        {selectedAddress !== '' ? (
                            <div className='flex flex-row w-full items-center justify-center p-2 bg-opacity-70 bg-green-400'>
                                <label className='font-medium'>{selectedAddress}</label>
                            </div>
                        ) : (
                            null
                        )} 
                        <div className='w-full flex flex-row animate-fadeIn'>
                            <SavedAddressList className='block' handler={handleSearchSelected} asAbsoluteClass={false} />
                        </div>
                    </div>
                )}
                
                
                <div className='flex flex-row w-full mt-5 justify-between'>
                    <Button
                        className={`bg-green-600 hover:bg-white hover:text-green-500 }`}
                        onClick={(e) => {
                            //stepoption(true);
                            //ctx?.setNextPage(true);
                            e.stopPropagation();
                            handleUpdateLocation();
                        }}
                        disabled={selectedAddress === "" ? true : false}
                    >
                        Update Location
                    </Button>
                    {isAuthenticated ? (
                        <Button 
                            className={`bg-white text-green-500 hover:bg-green-500 hover:text-white }`}
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowSavedAddress(!!!showSavedAddress); 
                            }}
                        >
                            {showSavedAddress ? "Show Map" : "Show Saved Address"} 
                        </Button>
                    ): null}
                    
                </div>
            </div>
        </>
        
    )
}

export default EditLocationMap