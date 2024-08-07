import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
  } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import MapViewSlice from "./map/MapViewSlice";
import ShowonMapSlice from "./map/ShowonMapSlice";
import SearchPageReducer from "./map/SearchPageSlice";
import RestaurantReducer from "./restaurant/RestaurantReducer";
import ProfileReducer from "./profile/ProfileReducer";
import EditLocationSlice from "./location/EditLocationSlice";

//Redux config
// export const store = configureStore({
//     reducer: {
//         map: MapViewSlice,
//         showOnMap: ShowonMapSlice,
//         searchPage: SearchPageReducer,
//         restaurants: RestaurantReducer,
//         profile: ProfileReducer,
//     }
// });

//Redux persist config
const persistConfig = {
    key: 'pixelfoodStateRoot',
    storage,
    whitelist: ['map', 'profile']
}

const rootReducer = combineReducers({
    map: MapViewSlice,
    showOnMap: ShowonMapSlice,
    searchPage: SearchPageReducer,
    restaurants: RestaurantReducer,
    profile: ProfileReducer,
    location: EditLocationSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
        },
    }),
});

export const persistor = persistStore(store);

//export const useAppDispatch: () => typeof store.dispatch = useDispatch;
//export const useAppSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>> = useSelector;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

