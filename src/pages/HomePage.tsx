import landingImage from '../assets/landing.png';
import appDownloadImage from '../assets/appDownload.png';
import { SearchForm } from '@/components/Search/SearchBar';
import { useNavigate } from 'react-router-dom';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import mainimg1 from '../assets/main_1.png';
import mainimg2 from '../assets/main_2.png';
import { LucideTruck, MapPinned, SquareMousePointer } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useGetMapboxGeocodingForward, getMapGeocodingForward } from '@/api/GeocodingApi';
import { useEffect, useState } from 'react';
import { Feature, GeocodedFeature, SearchResultType } from '@/types';
import { geocodingmapping } from '@/common/GoecodingTypeMatch';
import SearchBarGeolocation from '@/components/Search/SearchBarGeolocation';
import SearchResultList from '@/components/Search/SearchResultList';
import { useDebounce } from '@/common/Utilities';

export const HomePage = () => {

    const navigate = useNavigate();
    //const hostedCountry = import.meta.env.VITE_HOSTED_COUNTRY;
    const [selectedAddress, setSelectedAddress] = useState("");
    const [goecodingvalue, setGeocodingValue] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [geocodingCollectionState, setGeocodingCollectionState] = useState<Feature[]>([]);
    const [searchResultsType, setSearchResultsType] = useState<SearchResultType[]>([]);
    const { isLoading, results } = useGetMapboxGeocodingForward(goecodingvalue);
    const [hideSuggestion, setHideSuggestion] = useState(false);
    const [isRequesting, setIsRequesting] = useState(false);
    let geocodingCollection:Feature[] = [];
 
    useEffect(() => {
        debounceOnChange(inputValue);
    }, [inputValue])

    const handleSearchSubmit = (values: SearchForm) => {
        setGeocodingValue(values.searchQuery);
        
        geocodingCollection = geocodingmapping(results);
        setGeocodingCollectionState(geocodingCollection);

        // navigate({
        //     pathname: `/search/${values.searchQuery}`,
        // })
    }

    const handleOnChange = async (value: string) => {
        console.log(value);
        if(value.length > 0) setIsRequesting(true);
        setGeocodingValue(value);
        
        if(value.length == 0) {
            setHideSuggestion(true);
            setTimeout(() => {
                setIsRequesting(false)
            }, 1000);
        }else{
            let res = await getMapGeocodingForward(value);
            geocodingCollection = geocodingmapping(res);
            setGeocodingCollectionState(geocodingCollection);
            populateSearchResult();
        }
    }

    const handleClearGeocoder = () => {
        setGeocodingCollectionState([]);
        setHideSuggestion(true);
        setSelectedAddress("");
        setIsRequesting(false);
    }

    //const debounceOnChange = useDebounce(handleOnChange, 800, handleSearchLoading);
    const debounceOnChange = useDebounce(handleOnChange, 800);

    const populateSearchResult = () => {
        let res = geocodingCollectionState.map((data, index) => {
            return {
                value: data.properties.full_address,
                key: data.properties.mapbox_id
            }
        });
        if(res.length > 0){
            setHideSuggestion(false);
            setIsRequesting(false);
        }
        setSearchResultsType(res);
    }

    const handleSearchSelected = (value:string) => {
        setInputValue(value);
    }

    return (
        <>
        <div className='flex flex-col pag-12 relative'>
            <div className='md:px-52 sm:px-5 bg-white rounded-lg shadow-md py-3 flex flex-col text-center -mt-20'>
                <h1 className="text-3xl my-5 font-bold tracking-tight text-green-600 text-gradient">
                    {/* {hostedCountry ? `Welcome ${hostedCountry}!` : `Welcome!`} */}
                    Restaurant Food, Delivered.
                </h1>
                {/* <SearchBar placeHolder='enter address or postcode' onSubmit={handleSearchSubmit} onChange={handleOnChange} /> */}
                <SearchBarGeolocation 
                    placeHolder='enter address or postcode' 
                    onChange={debounceOnChange} 
                    setGeocodingCollectionState={handleClearGeocoder}
                    clearInput={hideSuggestion}
                    InputValue={inputValue}
                    SetInputValue={setInputValue}
                    selectedAddress={selectedAddress}
                />

                {isRequesting && (
                    <div className='w-full flex flex-col relative'>
                        <div className='flex flex-col p-4 gap-2 z-10 min-h-10 absolute w-full rounded-lg shadow-xl bg-zinc-100'>
                            <span className='animate-bounce'>Loading...</span>
                        </div>
                    </div>
                )}

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
