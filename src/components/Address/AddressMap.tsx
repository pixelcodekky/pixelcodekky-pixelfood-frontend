import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import SearchBarGeolocation from '../Search/SearchBarGeolocation';
import { Locate, Search } from 'lucide-react';
import SearchResultList from '../Search/SearchResultList';
import { Feature, SearchResultType, ViewMapState } from '@/types';
import { generateuuid, useDebounce } from '@/common/Utilities';
import { getMapGeocodingForward, getMapGeocodingReverse } from '@/api/GeocodingApi';
import { geocodingmapping } from '@/common/GoecodingTypeMatch';
import Map, {
    Marker,
    ViewStateChangeEvent,
    MapRef
  } from 'react-map-gl';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/statemgmt/hooks';
import { MapViewSelector, setViewport } from '@/statemgmt/map/MapViewSlice';
import { Button } from '../ui/button';
import CurrentPin from '../MapResource/CurrentPin';
import { AddressContext } from '@/pages/Address/AddressPage';
import { useNavigate } from 'react-router-dom';

const TOKEN = import.meta.env.VITE_MAPBOX_API_KEY;

// const initialState : SearchResultType = {
//     value: '',
//     key: '',
//     full_value: '',
//     lat: 0,
//     lng: 0,
// }

interface Coordinate {
    lat: number,
    lng: number 
}

type Props = {
    customClass: string;
}

const AddressMap = ({customClass}: Props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const mapState = useAppSelector(MapViewSelector);
    const mapRef = useRef<MapRef>(null);
    const ctx = useContext(AddressContext);

    const [hideSuggestion, setHideSuggestion] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [selectedAddress, setSelectedAddress] = useState("");
    const [isRequesting, setIsRequesting] = useState(false);
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
    let geocodingCollection:Feature[] = [];

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
            let selectedcoords = await getMapGeocodingReverse(locateMeCoord.lng.toString() || "", locateMeCoord.lat.toString() || "");
            if(selectedcoords.features.length > 0){
                setSelectedAddress(selectedcoords.features[0].properties.full_address);
                //coords(locateMeCoord);
                ctx?.setCoords(locateMeCoord);
                ctx?.setFeatureName(selectedcoords.features[0].properties.full_address);
            }
        };
        load();
    }, [locateMeCoord]);

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
        if(value.length > 0) {
            setIsRequesting(true);
        }
        if(value.length == 0) {
            hideIsRequesting();
            setHideSuggestion(true);
            setInputValue("");
            setIsSelected(false);
            clearDebounce();
        }else{
            if(!isSelected){
                setHideSuggestion(false);
                let res = await getMapGeocodingForward(value); // API Call
                geocodingCollection = geocodingmapping(res);
                setGeocodingCollectionState(geocodingCollection);
            }
            
        }
    }

    const {debounceFunction, clearDebounce} = useDebounce(handleOnChange);
    const debounceRequest = useCallback((value: string) => debounceFunction(value), [inputValue]);

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

    const handleMapOnClick = (lng:number, lat: number) => {
        setLocateMeCoord({lat: lat, lng: lng});
        
    }

    //#endregion MapFunction

    //#region privateFunction
    const handleBackList = () => {
        navigate("/address_list");
    }
    //#endregion

    return (
        <>
            <div className={`${customClass}`}>
                <div className='mb-2'>
                    <div className='flex flex-row items-center justify-center'>
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
                        <div className='flex flex-row basis-1/4'>
                            <Button variant={'secondary'} 
                                className='flex flex-row items-center justify-center gap-1 hover:bg-green-500 hover:text-white'
                                onClick={() => handleLocateMe()}>
                                <Locate size={18} strokeWidth={2.5} />
                                Locate Me
                            </Button>
                        </div>
                        
                    </div>
                    {isRequesting ? (
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
                <div className='relative flex flex-col w-full h-[480px] border-2'>
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
                            //e.originalEvent.stopPropagation();
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
                <div className='flex flex-row w-full mt-5 justify-between'>
                    <Button
                        className='bg-white text-green-500'
                        onClick={(e) => {
                            e.preventDefault();
                            handleBackList();
                        }}
                    >
                        Back to List
                    </Button>
                    <Button
                        className={`bg-green-600 hover:bg-white hover:text-green-500 }`}
                        onClick={() => {
                            //stepoption(true);
                            ctx?.setNextPage(true);
                        }}
                        disabled={selectedAddress === "" ? true : false}
                    >
                        Next
                    </Button>
                </div>
            </div>
            
            
        </>
        
    )
}

export default AddressMap