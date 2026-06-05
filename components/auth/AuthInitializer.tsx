"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { AuthUser, setUser } from "@/store/authSlice";
import { useAppDispatch } from "@/store/hooks";
import { deleteCookie, setCookies } from "@/lib/cookies";

/**
 * Mounts once inside ReduxProvider and keeps the Redux auth state
 * in sync with Firebase's onAuthStateChanged listener.
 */
export function AuthInitializer() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            console.log("Auth state changed", firebaseUser);
            if (firebaseUser) {
                // Set a lightweight cookie so middleware can guard protected routes
                firebaseUser
                    .getIdToken()
                    .then((token) => {
                        // document.cookie = `session=${token}; path=/; SameSite=Lax`;
                        setCookies("session", token);
                        const authUser: AuthUser = {
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            displayName: firebaseUser.displayName,
                            photoURL: firebaseUser.photoURL,
                        };
                        dispatch(setUser(authUser));
                    })
                    .catch(() => {
                        dispatch(setUser(null));
                    });
            } else {
                // Clear cookie so middleware redirects unauthenticated users
                deleteCookie("session");
                dispatch(setUser(null));
            }
        });
        return unsubscribe;
    }, [dispatch]);

    return null;
}
