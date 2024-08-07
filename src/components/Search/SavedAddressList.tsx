import { useGetUserAddress } from "@/api/MyAddressApi";
import { generateuuid } from "@/common/Utilities";
import { SearchResultType, UserAddress } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { MapPin } from "lucide-react";

type Props = {
    className?: string;
    handler: (searchResult:SearchResultType) => void;
    asAbsoluteClass?: boolean;
}

const SavedAddressList = ({className, handler, asAbsoluteClass=true}:Props) => {

    const { isAuthenticated } = useAuth0();
    const {getAddress, isLoading: getLoading } = useGetUserAddress();

    const handleSavedAddress = (data: UserAddress) => {
        const result = {
            value: data.fullName,
            key: data._id,
            full_value: data.fullName,
            lat: data.lat,
            lng: data.lon,
        }
        handler(result);
    }


    if(!isAuthenticated)
        return false;
    
    return (
        <>
            <div className={`flex flex-col ${asAbsoluteClass ? "z-9 absolute" : ""} w-full rounded-lg shadow-xl bg-zinc-100 ${className ? className : ""} `}>
                <ul className='flex flex-col rounded-lg overflow-y-auto transition ease-in-out delay-150'>
                    <li key={generateuuid()}
                    className={`flex flex-col p-1 gap-2 min-h-7 border-l-gray-300 text-sm bg-slate-300`}
                    >   
                        Saved Address
                    </li>
                    {getLoading ? (
                        <li key={generateuuid()}>
                            <div className='w-full flex flex-col'>
                                <div className='flex flex-row p-4 gap-2 z-10 min-h-10 w-full rounded-lg shadow-xl bg-zinc-100'>
                                <span className='animate-bounce'> Loading...</span>
                                </div>
                            </div>
                        </li>
                    ):(
                        (getAddress?.length ?? 0 > 0) ? (
                            getAddress?.map((data) => (
                                <li key={generateuuid()}
                                    className='flex flex-row p-4 gap-2 min-h-10 border-l-gray-300 text-left cursor-pointer hover:bg-green-200'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSavedAddress(data);
                                    }}
                                >
                                    <MapPin />
                                    <div className="flex flex-col">
                                    <span>
                                        {data.addressName}
                                    </span>
                                    <span>
                                    {data.fullName}
                                    </span>    
                                    </div>
                                    
                                </li>
                            ))
                        ) : 
                        <li key={generateuuid()}>
                            <div className='w-full flex flex-col relative'>
                                No Address Found.
                            </div>
                        </li>
                    )}
                    
                </ul>
            </div>
            
        </>
        
    )
}

export default SavedAddressList