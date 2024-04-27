import { SearchState } from "@/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";


const initialState: SearchState = {
    searchQuery: "",
    page: 1,
    selectedCuisines: [],
    sortOption: "bestmatch",
};


const SearchPageSlice = createSlice({
    name: 'searchPage',
    initialState,
    reducers: {
        dataSortOption: (state, action:PayloadAction<SearchState>) => {
            state.sortOption = action.payload.sortOption;
            state.page = 1;
        },
        dataSelectedCuisines: (state, action:PayloadAction<SearchState>) => {
            state.selectedCuisines = action.payload.selectedCuisines;
        },
        dataPage: (state, action:PayloadAction<SearchState>) => {
            state.page = action.payload.page;
        },
        dataSearchQuery: (state, action:PayloadAction<SearchState>) => {
            state.searchQuery = action.payload.searchQuery;
            state.page = 1;
        },
        dataResetSearch: (state) => {
            state.searchQuery = "";
            state.page = 1;
        }
    }
});

export const {
    dataSortOption,
    dataSelectedCuisines,
    dataPage,
    dataSearchQuery,
    dataResetSearch,
  } = SearchPageSlice.actions;
export const SearchPageSelector = (state: RootState) => state.searchPage;
export default SearchPageSlice.reducer;

