import { RestaurantSearchResponse } from '@/types';
import {PayloadAction, createSlice} from '@reduxjs/toolkit';


const initialState: RestaurantSearchResponse = {
    data:  [], 
    pagination: {
        total: 0,
        page: 0,
        pages: 0,
    }
};

const RestaurantSlice = createSlice({

    name: 'restaurants',
    initialState,
    reducers: {
        setRestaurant: (state, action:PayloadAction<RestaurantSearchResponse>) => {
            state.data = action.payload.data;
            state.pagination = action.payload.pagination; 
        },
    }
});

export const {setRestaurant} = RestaurantSlice.actions;
export default  RestaurantSlice.reducer;







