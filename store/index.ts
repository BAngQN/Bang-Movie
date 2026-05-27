import { configureStore } from "@reduxjs/toolkit";
import { tmdbApiSlice } from "./api";
import authReducer from "./authSlice";
import favoritesReducer from "./favoritesSlice";

export const store = configureStore({
    reducer: {
        [tmdbApiSlice.reducerPath]: tmdbApiSlice.reducer,
        auth: authReducer,
        favorites: favoritesReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(tmdbApiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
