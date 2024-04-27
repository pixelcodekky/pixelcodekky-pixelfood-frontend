import { ShowonMap } from "@/types";
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

const initShowonMap: ShowonMap = {
    current: false,
}

const showOnMapSlice = createSlice({
    name: "showOnMap",
    initialState: initShowonMap,
    reducers: {
        setShowonMap: (state) => ({
            ...state,
            current: !state.current,
        }),
    }
});

export default showOnMapSlice.reducer;
export const ShowOnMapSelector = (state: RootState) => state.showOnMap;
export const {setShowonMap} = showOnMapSlice.actions;