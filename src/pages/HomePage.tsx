import landingImage from '../assets/landing.png';
import appDownloadImage from '../assets/appDownload.png';
import { useNavigate } from 'react-router-dom';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import mainimg1 from '../assets/main_1.png';
import mainimg2 from '../assets/main_2.png';
import { LucideTruck, MapPinned, Search, SquareMousePointer } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { getMapGeocodingForward } from '@/api/GeocodingApi';
import { useCallback, useEffect, useState } from 'react';
import { Feature, SearchResultType } from '@/types';
import { geocodingmapping } from '@/common/GoecodingTypeMatch';
import SearchBarGeolocation from '@/components/Search/SearchBarGeolocation';
import SearchResultList from '@/components/Search/SearchResultList';
import { useDebounce } from '@/common/Utilities';
import { setProfile } from '@/statemgmt/profile/ProfileReducer';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/statemgmt/hooks';

const initialState : SearchResultType = {
    value: '',
    key: '',
    full_value: '',
    lat: 0,
    lng: 0,
  }

export const HomePage = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    //const hostedCountry = import.meta.env.VITE_HOSTED_COUNTRY;
    const profileState = useAppSelector((x) => x.profile);
    const [selectedAddress, setSelectedAddress] = useState("");
    //const [goecodingvalue, setGeocodingValue] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [isSelected, setIsSelected] = useState(false);
    const [geocodingCollectionState, setGeocodingCollectionState] = useState<Feature[]>([]);
    const [searchResultsType, setSearchResultsType] = useState<SearchResultType[]>([]);
    const [selectedSearchResultType, setSelectedSearchResultType] = useState<SearchResultType>(initialState);
    //const { isLoading, results } = useGetMapboxGeocodingForward(goecodingvalue);
    const [hideSuggestion, setHideSuggestion] = useState(false);
    const [isRequesting, setIsRequesting] = useState(false);
    let geocodingCollection:Feature[] = [];
    
    useEffect(() => {
        if(profileState.lat !== 0 && profileState.lng !== 0){
            let address = profileState;
            navigate({
                pathname: `/search/${address.lng}/${address.lat}`,
            })
        }
    },[]);

    //trigger inputvalue onchange
    useEffect(() => {
        debounceRequest(inputValue);
    }, [inputValue]);

    useEffect(() => {
        populateSearchResult();
    }, [geocodingCollectionState])

    const handleSearchSubmit = () => {
        //find selected address
        if(isSelected){
            dispatch(setProfile(selectedSearchResultType));
            let address = selectedSearchResultType;

            navigate({
                pathname: `/search/${address.lng}/${address.lat}`,
            })
        }
        
    }

    // const handleSearchSubmit = (values: SearchForm) => {
    //     setGeocodingValue(values.searchQuery);
        
    //     geocodingCollection = geocodingmapping(results);
    //     setGeocodingCollectionState(geocodingCollection);

    //     // navigate({
    //     //     pathname: `/search/${values.searchQuery}`,
    //     // })
    // }

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

    const handleClearGeocoder = () => {
        setGeocodingCollectionState([]);
        setHideSuggestion(true);
        setSelectedAddress("");
        hideIsRequesting();
        setInputValue("");
        setIsSelected(false);
        clearDebounce();
    }

    //const debounceOnChange = useDebounce(handleOnChange, 800, handleSearchLoading);
    const {debounceFunction, clearDebounce} = useDebounce(handleOnChange);
    
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

    const handleSearchSelected = (searchResult:SearchResultType) => {
        //dispatch(resetProfile());
        //dispatch(setProfile(searchResult));
        setInputValue(searchResult.full_value);
        setSelectedSearchResultType(searchResult);
        setIsSelected(true);
    }

    const hideIsRequesting = () => {
        setIsRequesting(false);
    }

    const debounceRequest = useCallback((value: string) => debounceFunction(value), [inputValue]);

    const onChange = (value: string) => {
        setInputValue(value);
        debounceRequest(value);
    }

    return (
        <>
        <div className='flex flex-col md:px-20 pag-12 relative'>
            <div className='md:px-20 bg-white rounded-lg shadow-md py-2 flex flex-col text-center -mt-20'>
                <h1 className="lg:text-3xl md:text-2xl sm:text-xl my-5 font-bold tracking-tight text-green-600 text-gradient">
                    {/* {hostedCountry ? `Welcome ${hostedCountry}!` : `Welcome!`} */}
                    Restaurant Food, Delivered.
                </h1>
                {/* <SearchBar placeHolder='enter address or postcode' onSubmit={handleSearchSubmit} onChange={handleOnChange} /> */}
                <SearchBarGeolocation 
                    placeHolder='enter street name or postcode and select' 
                    onChange={onChange} 
                    setGeocodingCollectionState={handleClearGeocoder}
                    clearInput={hideSuggestion}
                    InputValue={inputValue}
                    SetInputValue={setInputValue}
                    selectedAddress={selectedAddress}
                    onSubmit={handleSearchSubmit}
                />

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
            
        </div>
        {/* Start Content */}
        <div className='py-5'>
            <div className='min-h-[280px] grid gap-4 lg:md:grid-cols-3'>
                <div className='gap-5 item-center py-20'>
                    <div className='flex flex-row justify-center'>
                        <MapPinned size={48} strokeWidth={1}/>
                    </div>
                    <div className='text-3xl text-center font-bold flex flex-row justify-center'>
                        <span className='rounded-full'>
                            Select Location
                        </span> 
                    </div>
                </div>
                <div className='gap-5 item-center py-20'>
                    <div className='flex flex-row justify-center'>
                        <SquareMousePointer size={48} strokeWidth={1}/>
                    </div>
                    <div className='text-3xl text-center font-bold'>
                        <span className='rounded-full'>Choose Restaurant & Order</span> 
                    </div>
                </div>
                <div className='gap-5 item-center py-20'>
                    <div className='flex flex-row justify-center'>
                        <LucideTruck  size={48} strokeWidth={1}/>
                    </div>
                    <div className='text-3xl text-center font-bold'>
                        <span className='rounded-full'>Delivered!</span> 
                    </div>
                </div>
            </div>
            <div className='gap-5 py-5 grid md:grid-cols-2'>
                <div className='flex-none w-30'>
                    <h2 className='text-3xl font-bold py-2'>
                        Everything you order, delivered
                    </h2>
                    <p className='text-m gap-2'>
                        Get a nice  meal at your doorstep with foodie. Order now and enjoy the convenience of having your favorite
                        Foodie connects restaurants with customers in real time.

                        Forget the grocery store rush and say goodbye to takeout limitations.  
                        Here, everything you order gets delivered straight to your door.  
                        Craving a specific ingredient for a homemade masterpiece? Need a last-minute dinner party 
                        spread? No problem.  We deliver it all, ensuring convenience and satisfaction with every 
                        order.
                    </p>
                </div>
                <div className='flex-none w-70'>
                    <img src={mainimg1} className='object-cover rounded shadow-md' />
                </div>
            </div>
            <Separator />
            <div className='grid md:grid-cols-2 gap-5 py-5'>
                <div>
                    <img src={mainimg2} className='object-cover rounded shadow-md' />
                </div>
                <div>
                    <h2 className='text-3xl font-bold py-2'>
                        Deliver with less, Eat more
                    </h2>
                    <h3 className='text-xl font-bold'>
                    Feeling overwhelmed? Short on time?
                    </h3>
                    <p className='text-m gap-2 py-3'>
                    Ditch the stress of cooking tonight 
                    and let us deliver more! We've got a wider selection than ever before, 
                    so indulge in the flavors you crave and focus on what truly matters.  
                    Whether it's catching up with loved ones, tackling that project, or simply relaxing, 
                    we'll take care of dinner you deserve a break, and a delicious one at that.  
                    Explore our extensive menu and "Deliver with Less, Eat More" tonight!
                    </p>
                </div>
                
            </div>
        </div>
         {/* End Content */}
         {/*Start Download App */}
        <div className="grid md:grid-cols-2 gap-5 py-5">
                <div className='container'>
                    <AspectRatio ratio={16/10}> 
                        <img src={landingImage} className='object-cover rounded' />
                    </AspectRatio>
                </div>
                <div className='flex flex-col items-center justify-center gap-4 text-center'>
                    <span className='font-bold text-3xl tracking-tighter'>
                        Order takeaway
                    </span>
                    <span>
                        Download PixelFood App (Coming Soon) for more...
                    </span>
                    <img src={appDownloadImage} />
                </div>
        </div>
         {/*End Download App */}
        </>
    )
}
