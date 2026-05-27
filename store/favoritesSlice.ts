import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { FavoriteItem } from "@/types";

interface FavoritesState {
    items: FavoriteItem[];
    /** true while waiting for the first Firestore snapshot */
    loading: boolean;
}

const initialState: FavoritesState = {
    items: [],
    loading: true,
};

const favoritesSlice = createSlice({
    name: "favorites",
    initialState,
    reducers: {
        setFavorites(state, action: PayloadAction<FavoriteItem[]>) {
            state.items = action.payload;
            state.loading = false;
        },
    },
});

export const { setFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
