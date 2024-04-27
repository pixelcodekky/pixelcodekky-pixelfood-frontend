import React, { useState } from 'react'
import './index.css';
import { FilterIcon, List, SearchIcon } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setShowonMap } from '@/statemgmt/map/ShowonMapSlice';
import { MapFilter } from '../MapGL/MapFilter';

type Props = {
    children: React.ReactNode;
}

const ShowOnMapDefault = ({children}: Props) => {
    const dispatch = useDispatch();

    const handleShowonList = () => {
      dispatch(setShowonMap());
    }

    return (
      <>
      <div>
          <div id="mapPanel" className='relative'>
            <div id='search' className='absolute top-25 z-20'>
              {/* <SearchBar 
                  searchQuery={searchState.searchQuery}
                  onSubmit={setSearchQuery} 
                  placeHolder="Find cuisines or restaurants name"
                  onReset={resetSearch}
                  /> */}
            </div>
            {/* Start Filter Section */}
            <div className="absolute top-25 left-1/2 transform -translate-x-1/2 z-20 flex flex-row gap-2 py-3">
                <MapFilter>
                  <button className="bg-white hover:bg-green-700 hover:text-white text-green-500 py-2 px-4 rounded-full shadow-xl gap-2 flex flex-row"
                    onClick={() => {}}>
                    Filters
                    <FilterIcon />
                  </button>
                </MapFilter>
                <button className="bg-white hover:bg-green-700 hover:text-white text-green-500 py-2 px-4 rounded-full shadow-xl gap-2 flex flex-row"
                    onClick={() => {}}>
                      Search
                      <SearchIcon />
                </button>
              
            </div>
            {/* End Filter Section */}
            {children}   
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
                <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-full shadow-xl flex gap-2 flex-row justify-center"
                onClick={() => {handleShowonList()}}>
                Show List
                <List/>
              </button>
            </div>
          </div>
      </div>
        
        
      </>
       
    )
}

export default ShowOnMapDefault;
