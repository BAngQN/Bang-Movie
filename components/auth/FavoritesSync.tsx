"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setFavorites } from "@/store/favoritesSlice";
import { subscribeToFavorites } from "@/lib/favorites";

/**
 * Subscribes to the current user's Firestore favorites collection
 * and keeps the Redux favorites slice in sync.
 */
export function FavoritesSync() {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((s) => s.auth);

    useEffect(() => {
        if (!user) {
            dispatch(setFavorites([]));
            return;
        }
        const unsubscribe = subscribeToFavorites(user.uid, (items) => {
            dispatch(setFavorites(items));
        });
        return unsubscribe;
    }, [user, dispatch]);

    return null;
}
