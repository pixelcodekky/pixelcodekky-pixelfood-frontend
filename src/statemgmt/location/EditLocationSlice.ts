import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "../store";

const initialState = {
    isEdit: false,
}

const editLocationSlice = createSlice({
    name: 'editLocation',
    initialState,
    reducers: {
        setIsEdit: (state) => {
            state.isEdit = !!!state.isEdit;
        }
    }
});

export default editLocationSlice.reducer;
export const EditLocationSelector = (state: RootState) => state.location;
export const {setIsEdit} = editLocationSlice.actions;

