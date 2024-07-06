import { useSearchRestaurants } from "@/api/RestaurantApi";
import CuisineFilter from "@/components/CuisineFilter";
import PaginationSelector from "@/components/PaginationSelector";
import { SearchBar, SearchForm } from "@/components/Search/SearchBar";
import SearchResultCard from "@/components/SearchResultCard";
import { SearchResultInfo } from "@/components/SearchResultInfo";
import SortOptionDropdown from "@/components/SortOptionDropdown";
import { Button } from "@/components/ui/button";
import { ShowOnMapSelector, setShowonMap } from "@/statemgmt/map/ShowonMapSlice";
import { Map } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom"
import { MapPage } from "../MapPage";
import { SearchState } from "@/types";
import { SearchPageSelector, dataPage, dataResetSearch, dataSearchQuery, dataSelectedCuisines } from "@/statemgmt/map/SearchPageSlice";
import { useAppSelector } from "@/statemgmt/hooks";
import { AnimatedPage } from '@/animotion/AnimatedPage';

export const SearchPage = () => {
    const dispatch = useDispatch();
    const showOnMap = useAppSelector(ShowOnMapSelector);
    const searchStateSelector: SearchState = useAppSelector(SearchPageSelector);
    const profileState = useAppSelector((x) => x.profile);
    const [searchState, setSearchState] = useState<SearchState>(searchStateSelector);
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const { results, isLoading } = useSearchRestaurants(searchState);

    //reload base on store state
    useEffect(() => {
      setSelectedCuisines(searchStateSelector.selectedCuisines);
    },[searchStateSelector])

    const setSortOption = async (sortOption: string) => {
      let newState = {...searchState}; //copy object to new one;
      newState.sortOption = sortOption;
      //dispatch(dataSortOption(newState));
      setSearchState({ ...newState});
    }

    const setSelectedCuisines = async (_selectedCuisines: string[]) => {
      let newState = {...searchState}; //copy object to new one;
      newState.selectedCuisines = _selectedCuisines;
      dispatch(dataSelectedCuisines(newState));
      setSearchState({ ...newState});
    }

    const setPage = async (page: number) => {
      let newState = {...searchState}; //copy object to new one;
      newState.page = page;
      dispatch(dataPage(newState));
      setSearchState({...newState});
    }

    const setSearchQuery = async (searchFormData: SearchForm) => {
      let newState = {...searchState}; //copy object to new one;
      newState.searchQuery = searchFormData.searchQuery;
      dispatch(dataSearchQuery(newState));
      setSearchState({...newState});
    }

    const resetSearch = async () => {
      let newState = {...searchState}; //copy object to new one;
      newState.searchQuery = "";
      await dispatch(dataResetSearch());
      await setSearchState(newState);
    }

    const handleShowonMap = () => {
      dispatch(setShowonMap());
    }

    if(isLoading){
      return (
        <>
          <div className="container mx-auto py-3">
            <div className="flex flex-row gap-5">
              <span>Loading...</span>
            </div>
          </div>
        </>
        
      )
    }
    
    return (
      <>
      {(!isLoading && results !== undefined && results?.data.length > 0) ? (
        <>
          {showOnMap.current ? (
              <div className="">
                <MapPage/>
              </div>
            ) : (
              <AnimatedPage>
              <div className="container mx-auto py-3">
                  <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
                    <div id="side-bar" className="">
                      <div id="map-restaurants" className="flex flex-col m-3 gap-3">
                        <div className="flex flex-row justify-center">
                          <Button onClick={() => {handleShowonMap()}} className='flex flex-row justify-center rounded-full bg-green-600 hover:bg-green-700 p-5'>
                            Show Map
                            <Map strokeWidth={2.5} className='ml-1 text-black-500 hidden md:block' />
                          </Button>
                        </div>
                        
                      </div>
                      <div id='cuisines-list'>
                        <CuisineFilter 
                          selectedCuisines={searchState.selectedCuisines} 
                          onChange={setSelectedCuisines}
                          isExpanded={isExpanded}
                          onExpandedClick={() => setIsExpanded((prev) => !prev)}
                          className="flex flex-wrap justify-center gap-2"
                        />
                      </div>
                    </div>
                    <div id='main-content' className="flex flex-col">
                      <SearchBar 
                        searchQuery={searchState.searchQuery}
                        onSubmit={setSearchQuery} 
                        placeHolder="Find cuisines or restaurants name" 
                        onReset={resetSearch}
                        />
                      <div className="flex justify-between flex-col gap-3 lg:flex-row">
                        <SearchResultInfo total={results?.pagination.total || 0} city={profileState.value} />
                        <SortOptionDropdown sortOption={searchState.sortOption} onChange={(value) => setSortOption(value)} />
                      </div>
                      <h1 className="text-2xl tracking-tight mb-2">All Restaurants</h1>
                      <div className="flex flex-col">
                        <ul className="grid lg:grid-cols-4 md:grid-cols-3 gap-4">
                          {results?.data.map((d, index) => (
                            <li key={index}>
                              <SearchResultCard restaurant={d} key={index} />
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <PaginationSelector 
                        page={results?.pagination.page || 0} 
                        pages={results?.pagination.pages || 0} 
                        onPageChange={setPage}/>
                    </div>
                  </div>
              </div>
              </AnimatedPage>
            )
            
            }
        </>
          
      ) : (
        <>
          <div className="container mx-auto py-3">
            <div className="flex flex-row gap-5">
              {/* <span>No Results found for {profileState.full_value}.</span> */}
              <span>No Restaurant found.</span>
              <Link to='/' 
                    className='ml-2 text-sm font-semibold underline cursor-pointer text-green-500'>
                      Change Location
              </Link>
            </div>
          </div>
        </>
      )}
      </>
      
    )
}
