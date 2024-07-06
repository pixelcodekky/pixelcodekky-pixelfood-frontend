import { SearchResultType } from "@/types";
import { MapPin } from "lucide-react";

type Props = {
    className?: string;
    results: SearchResultType[];
    handler: (searchResult:SearchResultType) => void;
}

const SearchResultList = ({className, results, handler}: Props) => {
    
    return (
        <>
            {results.length > 0 ? (
                <div className={`flex flex-col z-10 absolute w-full rounded-lg shadow-xl bg-zinc-100 ${className ? className : ""} `}>
                    <ul className='flex flex-col rounded-lg overflow-y-auto transition ease-in-out delay-150'>
                        {results.map((data, index) => (
                            <li key={index}
                                className='flex flex-row p-4 gap-2 min-h-10 border-l-gray-300 text-left cursor-pointer hover:bg-green-200'
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handler(data);
                                }}
                            >
                                <MapPin />
                                {data.full_value}
                            </li>
                        ))}
                        <li key={`powerbyMapbox`}
                            className={`flex flex-col p-1 gap-2 min-h-7 border-l-gray-300 text-sm text-right bg-slate-300`}
                        >   
                            Powered by Mapbox
                        </li>
                    </ul>
                </div>
            ) : null}
        </>
        
    )
}

export default SearchResultList