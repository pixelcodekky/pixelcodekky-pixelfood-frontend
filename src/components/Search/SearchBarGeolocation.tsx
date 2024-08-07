import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Search, SearchIcon, X } from 'lucide-react';
import { Feature } from '@/types';


type Props = {
    searchQuery?: string;
    onSubmit?: () => void;
    placeHolder: string;
    onReset?: () => void;
    className?: string;
    onChange?: (value:string) => void;
    features?: Feature[];
    setGeocodingCollectionState: () => void;
    clearInput: boolean;
    InputValue: string;
    SetInputValue: (value: string) => void;
    selectedAddress: string;
    showSavedAddress?: (value: boolean) => void;
}


const SearchBarGeolocation = ({ placeHolder, onSubmit, setGeocodingCollectionState, InputValue, SetInputValue, showSavedAddress, clearInput = false } : Props) => {

    //const [inputState, setInputState] = useState("");

    const handleOnClick = () => {
        if(onSubmit){
            onSubmit();
        }
    }

    const handleOnFocus = (e: React.FocusEvent<HTMLInputElement, Element>) => {
        if(showSavedAddress)
            showSavedAddress(e.currentTarget.value === '' ? true : false)
    }

    return (
        <>
        <div>
            <div className='flex items-center m-2 gap-3 justify-between flex-row border-2 rounded-full p-1'>
                <Search strokeWidth={2.5} size={30} className='ml-1 text-green-500 hidden md:block' />
                <Input 
                    type='text'
                    className='border-none shadow-none lg:text-xl md:text-md sm:text-sm focus-visible:ring-0' 
                    placeholder={placeHolder} 
                    value={InputValue}
                    onChange={(e) => {
                        e.stopPropagation();
                        SetInputValue(e.target.value);
                    }}
                    onFocus={(e) => handleOnFocus(e)}
                    
                />
                {!clearInput ? (
                    <X  strokeWidth={3}
                    size={18}  
                    className='rounded-full b-[10px] border bg-white-400 text-black w-[30px] hover:pointer hover:text-black hover:bg-gray-200' 
                    onClick={() => {
                        //setInputState("");
                        setGeocodingCollectionState(); // clear all suggestion and input value
                    }}
                    />
                ) : null}
                
                <Button 
                    type='button' 
                    className='rounded-full bg-green-500 hover:bg-green-600'
                    onClick={handleOnClick}
                    >
                    <span className='hidden md:block'>Search</span>
                    <SearchIcon 
                    className='md:hidden'
                    size={18} />
                </Button>
            </div>
            {/* {suggestionState && suggestionState.length > 0 && (
                <div className='flex flex-col rounded-lg shadow-xl'>
                    <ul className='bg-white broder-[1px] rounded-lg p-4 absolute max-h-[200px] shadow-xl overflow-y-auto'>
                        {suggestionState.map((d,i) => (
                            <li key={i}
                                className='min-h-10 w-full border-b-[1px] border-solid border-l-gray-300 py-2 curser:pointer'
                            >{d.properties.full_address}</li>
                        ))}
                    </ul>
                </div>
            )} */}
           
        </div>
            
        </>
        
    )
}

export default SearchBarGeolocation