import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface AuthUser {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
}

interface AuthState {
    user: AuthUser | null;
    /** true while waiting for Firebase to confirm the initial auth state */
    loading: boolean;
}

const initialState: AuthState = {
    user: null,
    loading: true,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<AuthUser | null>) {
            state.user = action.payload;
            state.loading = false;
        },
    },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
