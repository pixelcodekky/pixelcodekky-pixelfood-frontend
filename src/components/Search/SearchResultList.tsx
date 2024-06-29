import { SearchResultType } from "@/types";
import { Map, MapPin } from "lucide-react";

type Props = {
    className?: string;
    results: SearchResultType[];
    handler: (value:string) => void;
}

const SearchResultList = ({className, results, handler}: Props) => {
    
    const handleOnclick = (value: string) => {
        handler(value);
    }
    
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
                                    handleOnclick(data.value);
                                }}
                            >
                                <MapPin />
                                {data.value}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : null}
        </>
        
    )
}

export default SearchResultList