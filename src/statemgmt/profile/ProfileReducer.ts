import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import { SearchResultType } from '@/types';

const initialState : SearchResultType = {
    value: '',
    key: '',
    full_value: '',
    lat: 0,
    lng: 0,
}

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setProfile: (state, action:PayloadAction<SearchResultType>) => {
            return {...state, ...action.payload};
        },
        resetProfile: () => {
            return initialState;
        }
    }
});

export const { setProfile, resetProfile } = profileSlice.actions;
export default profileSlice.reducer;

