import { useState } from "react";
import CuisineFilter from "../CuisineFilter";
import { Dialog, DialogTrigger, DialogContent } from "../ui/dialog";
import { SearchState } from "@/types";
import { useDispatch } from "react-redux";
import { SearchPageSelector, dataSelectedCuisines } from "@/statemgmt/map/SearchPageSlice";
import { useAppSelector } from "@/statemgmt/hooks";


type Props = {
    children: React.ReactNode;
    
}

export const MapFilter = ({children}: Props) => {
    const dispatch = useDispatch();
    const searchStateSelector: SearchState = useAppSelector(SearchPageSelector);
    const [searchState, setSearchState] = useState<SearchState>(searchStateSelector);
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    const setSelectedCuisines = async (_selectedCuisines: string[]) => {
        let newState = {...searchState}; //copy object to new one;
        newState.selectedCuisines = _selectedCuisines;
        await dispatch(dataSelectedCuisines(newState));
        await setSearchState({ ...newState});
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="max-w-[815px] md:min-w-[400px] min-h-[430px] max-h-[860px] bg-gray-50">
                <div className="">
                    <span className="text-2xl flex flex-row justify-center">Filters</span>    
                    <CuisineFilter 
                        selectedCuisines={searchState.selectedCuisines} 
                        onChange={setSelectedCuisines}
                        isExpanded={isExpanded}
                        onExpandedClick={() => setIsExpanded((prev) => !prev)}
                        className="flex flex-wrap justify-center gap-2"
                    />    
                </div>
            </DialogContent>
        </Dialog>
    )
}
