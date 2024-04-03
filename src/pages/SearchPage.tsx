import { useSearchRestaurants } from "@/api/RestaurantApi";
import CuisineFilter from "@/components/CuisineFilter";
import PaginationSelector from "@/components/PaginationSelector";
import { SearchBar, SearchForm } from "@/components/SearchBar";
import SearchResultCard from "@/components/SearchResultCard";
import { SearchResultInfo } from "@/components/SearchResultInfo";
import SortOptionDropdown from "@/components/SortOptionDropdown";
import { useState } from "react";
import { Link, useParams } from "react-router-dom"

export type SearchState = {
  searchQuery: string;
  page:number;
  selectedCuisines: string[];
  sortOption: string;
}

export const SearchPage = () => {
    const {city} = useParams();
    const [searchState, setSearchState] = useState<SearchState>({
      searchQuery: "",
      page: 1,
      selectedCuisines: [],
      sortOption: "bestmatch",
    });

    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    const { results, isLoading } = useSearchRestaurants(searchState ,city);

    const setSortOption = (sortOption: string) => {
      setSearchState((prev) =>({
        ...prev,
        sortOption,
        page: 1,
      }))
    }

    const setSelectedCuisines = (selectedCuisines: string[]) => {
      setSearchState((prev) => ({ 
        ...prev, 
        selectedCuisines, 
        page: 1, }));
    }

    const setPage = (page: number) => {
      setSearchState((prevState) => ({
        ...prevState,
        page,
      }))
    }

    const setSearchQuery = (searchFormData: SearchForm) => {
      //set to state
      setSearchState((prevState) => ({ 
        ...prevState, 
        searchQuery: searchFormData.searchQuery, 
        page: 1,
      }));
    }

    const resetSearch = () => {
      //set to state
      setSearchState((prevState) => ({ 
        ...prevState, 
        searchQuery: "", 
        page: 1,
      }));
    }

    if(isLoading){
      <span>Loading...</span>
    }

    if(results == undefined || !results?.data || !city){
      return (
        <>
          <span>No Results found for {city}.</span>
          <Link to='/' 
                className='ml-2 text-sm font-semibold underline cursor-pointer text-green-500'>
                  Change Location
          </Link>
        </>
      )
    }

    return (
      <>
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
          <div id='cuisines-list'>
            <CuisineFilter 
              selectedCuisines={searchState.selectedCuisines} 
              onChange={setSelectedCuisines}
              isExpanded={isExpanded}
              onExpandedClick={() => setIsExpanded((prev) => !prev)}
            />
          </div>
          <div id='main-content' className="flex flex-col">
            <SearchBar 
              searchQuery={searchState.searchQuery}
              onSubmit={setSearchQuery} 
              placeHolder="Find cuisines or restaurants name"
              onReset={resetSearch}
              />
            <div className="flex justify-between flex-col gap-3 lg:flex-row">
              <SearchResultInfo total={results?.pagination.total} city={city} />
              <SortOptionDropdown sortOption={searchState.sortOption} onChange={(value) => setSortOption(value)} />
            </div>
            <h1 className="text-2xl tracking-tight mb-2">All Restaurants</h1>
            {results.data.map((d, idx) => (
              <SearchResultCard restaurant={d} key={idx} />
            ))}
            <PaginationSelector 
              page={results?.pagination.page} 
              pages={results?.pagination.pages} 
              onPageChange={setPage}/>
          </div>
        </div>
      </>
      
    )
}
