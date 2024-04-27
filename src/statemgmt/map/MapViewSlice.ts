import { ShowonMap, ViewMapState } from "@/types";
import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import { RootState } from "../store";


const initialState: ViewMapState = {
    mapStyle: 'mapbox://styles/mapbox/streets-v12',
    viewState: {
        latitude: 1.3521,
        longitude: 103.8198,
        zoom: 16,
    }
};

const mapViewSlice = createSlice({
    name: 'map',
    initialState,
    reducers: {
        setViewport: (state, action:PayloadAction<ViewMapState>) => {
            state.viewState = action.payload.viewState;
        },
        setMapStyle: (state, action:PayloadAction<ViewMapState>) => {
            state.mapStyle = action.payload.mapStyle;
        }
    },
});

export default mapViewSlice.reducer;
export const MapViewSelector = (state: RootState) => state.map;
export const {setViewport, setMapStyle} = mapViewSlice.actions;











