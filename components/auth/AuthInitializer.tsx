"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { setUser } from "@/store/authSlice";
import { useAppDispatch } from "@/store/hooks";

/**
 * Mounts once inside ReduxProvider and keeps the Redux auth state
 * in sync with Firebase's onAuthStateChanged listener.
 */
export function AuthInitializer() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            dispatch(
                setUser(
                    firebaseUser
                        ? {
                              uid: firebaseUser.uid,
                              email: firebaseUser.email,
                              displayName: firebaseUser.displayName,
                              photoURL: firebaseUser.photoURL,
                          }
                        : null,
                ),
            );
        });
        return unsubscribe;
    }, [dispatch]);

    return null;
}
