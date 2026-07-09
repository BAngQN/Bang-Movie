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
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { tmdbApiSlice } from "./api";
import authReducer from "./authSlice";
import favoritesReducer from "./favoritesSlice";

const rootReducer = combineReducers({
    [tmdbApiSlice.reducerPath]: tmdbApiSlice.reducer,
    auth: authReducer,
    favorites: favoritesReducer,
});

const persistConfig = {
    key: "bang-movie",
    storage,
    whitelist: ["favorites"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }).concat(tmdbApiSlice.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
