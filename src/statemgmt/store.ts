import { configureStore } from "@reduxjs/toolkit";
import MapViewSlice from "./map/MapViewSlice";
import ShowonMapSlice from "./map/ShowonMapSlice";
import SearchPageReducer from "./map/SearchPageSlice";
import RestaurantReducer from "./restaurant/RestaurantReducer";
import ProfileReducer from "./profile/ProfileReducer";

export const store = configureStore({
    reducer: {
        map: MapViewSlice,
        showOnMap: ShowonMapSlice,
        searchPage: SearchPageReducer,
        restaurants: RestaurantReducer,
        profile: ProfileReducer,
    }
});

//export const useAppDispatch: () => typeof store.dispatch = useDispatch;
//export const useAppSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>> = useSelector;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

