import { useSearchRestaurants } from "@/api/RestaurantApi";
import CuisineFilter from "@/components/CuisineFilter";
import { SearchBar, SearchForm } from "@/components/Search/SearchBar";
import { Button } from "@/components/ui/button";
import { ShowOnMapSelector, setShowonMap } from "@/statemgmt/map/ShowonMapSlice";
import { ListFilter, Loader, Map } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { MapPage } from "../MapPage";
import { SearchState } from "@/types";
import { SearchPageSelector, dataPage, dataResetSearch, dataSearchQuery, dataSelectedCuisines } from "@/statemgmt/map/SearchPageSlice";
import { useAppSelector } from "@/statemgmt/hooks";
import { AnimatedPage, LoadingAnimation } from '@/animotion/AnimatedPage';
import RestaurantList from "@/components/RestaurantList";
import SortOptionRadio from "@/components/SortOptionRadio";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import SearchFooter from "@/components/Search/SearchFooter";
import { EditLocationSelector } from "@/statemgmt/location/EditLocationSlice";
import EditLocation from "@/components/Location/EditLocation";

export const SearchPage = () => {
    const dispatch = useDispatch();
    const showOnMap = useAppSelector(ShowOnMapSelector);
    const isEditLocation = useAppSelector(EditLocationSelector);
    const searchStateSelector: SearchState = useAppSelector(SearchPageSelector);
    const [searchState, setSearchState] = useState<SearchState>(searchStateSelector);
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
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

    const showRestaurantCount = () => {
      let result = "All";
      if(searchState.selectedCuisines.length > 0 || searchState.searchQuery !== ""){
         result = `(${results?.pagination.total.toString()})` || "All";
      }
      return (
        <>
          {`${result}`}
        </>
       )
    }

    const RenderFilter = () => {
      return (
        <>
          <div id="sortby" className="mb-5">
            <SortOptionRadio sortOption={searchState.sortOption} onChange={(value) => setSortOption(value)} />
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
        </>
      )
    }

    if(showOnMap.current){
      return (
        <>
          <div className="">
            <MapPage/>
          </div>
        </>
      )
    }
    
    return (
      <>
        <div className={``}>
        <AnimatedPage>
        <div className="container relative mx-auto min-h-[500px] py-3 overscroll-none">
            <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
              <div id="side-bar" className="overflow-hidden">
                <div id="map-restaurants" className="flex flex-col m-3 gap-3 mb-5">
                  <div className="flex flex-row justify-between md:justify-center gap-2">
                    <Button onClick={() => {handleShowonMap()}} className='flex flex-row justify-center rounded-full bg-green-600 hover:bg-green-700 p-5'>
                      Show Map
                      <Map strokeWidth={2.5} className='ml-1 text-black-500 hidden md:block' />
                    </Button>
                    <div className="md:hidden">
                      <Button onClick={() => {setIsFilterOpen(!!!isFilterOpen)}} className='flex flex-row justify-center text-green-500 bg-white-200 rounded-full hover:bg-green-200  p-5'>
                        Filters
                        <ListFilter strokeWidth={2} />
                      </Button>
                    </div>
                  </div>
                </div>
                {/* <div id="sortby" className="mb-5">
                  <SortOptionRadio sortOption={searchState.sortOption} onChange={(value) => setSortOption(value)} />
                </div>
                <div id='cuisines-list'>
                  <CuisineFilter 
                    selectedCuisines={searchState.selectedCuisines} 
                    onChange={setSelectedCuisines}
                    isExpanded={isExpanded}
                    onExpandedClick={() => setIsExpanded((prev) => !prev)}
                    className="flex flex-wrap justify-center gap-2"
                  />
                </div> */}
                <div className="hidden md:block">
                  {RenderFilter()}
                </div>
                <div className="md:hidden">
                  <Collapsible
                    open={isFilterOpen}
                    onOpenChange={setIsFilterOpen}
                    >
                      <CollapsibleContent className="space-y-2 border-1 p-2 rounded-md shadow-md">
                      <AnimatedPage>
                        {RenderFilter()}
                      </AnimatedPage>
                      </CollapsibleContent>
                  </Collapsible>
                </div>
              </div>
              <div id='main-content' className="flex flex-col md:flex-col-1">
                <SearchBar 
                  searchQuery={searchState.searchQuery}
                  onSubmit={setSearchQuery} 
                  placeHolder="Find cuisines or restaurants name" 
                  onReset={resetSearch}
                  />
                <div className="flex justify-between flex-col gap-3 lg:flex-row">
                  {/* <SearchResultInfo total={results?.pagination.total || 0} city={profileState.value} /> */}
                  {/* <SortOptionDropdown sortOption={searchState.sortOption} onChange={(value) => setSortOption(value)} /> */}
                </div>

                {isLoading ? (
                  <>
                  <div className="item-center min-h-[400px]">
                    <div className="gap-5 flex flex-row justify-center item-center py-20 h-full">
                      <span>Loading</span>
                        <LoadingAnimation>
                          <Loader size={20} />
                        </LoadingAnimation>                          
                      </div>
                  </div>
                  </>
                ) : results !== undefined && results?.data.length > 0 ? (
                  <>
                    <h1 className="text-2xl tracking-tight mb-2">{showRestaurantCount()} Restaurants</h1>
                    <RestaurantList data={results} setPage={setPage} />
                  </>
                ) : (
                    <>
                      <div className="container mx-auto py-3">
                        <div className="flex flex-row justify-center py-20 gap-5">
                          <h1 className="text-2xl tracking-tight mb-2">No Restaurant found.</h1>
                        </div>
                      </div>
                    </>
                )}
                <SearchFooter/>
              </div>
            </div>
            {isEditLocation.isEdit ? (
              <div className="absolute inset-x-0 top-0 w-full h-full bg-gray-300 bg-opacity-40 animate-model-fade">
                <div className="flex flex-col md:flex-row justify-center p-1 ">
                  <EditLocation />
                </div>
              </div>
              
            ): null}
            
        </div>
        </AnimatedPage>
        </div>
        
      </>
      
    )
}
