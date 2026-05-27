import {
    doc,
    setDoc,
    deleteDoc,
    collection,
    onSnapshot,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { FavoriteItem } from "@/types";

/** Deterministic document ID: "movie_123" or "tv_456" */
export function favoriteDocId(id: number, type: "movie" | "tv") {
    return `${type}_${id}`;
}

export async function addFavorite(uid: string, item: FavoriteItem) {
    const ref = doc(
        db,
        "users",
        uid,
        "favorites",
        favoriteDocId(item.id, item.genre_type),
    );
    await setDoc(ref, { ...item, added_at: serverTimestamp() });
}

export async function removeFavorite(
    uid: string,
    id: number,
    type: "movie" | "tv",
) {
    const ref = doc(db, "users", uid, "favorites", favoriteDocId(id, type));
    await deleteDoc(ref);
}

export function subscribeToFavorites(
    uid: string,
    callback: (items: FavoriteItem[]) => void,
) {
    return onSnapshot(collection(db, "users", uid, "favorites"), (snapshot) => {
        const items = snapshot.docs.map((doc) => {
            const data = doc.data();
            let added_at: number | undefined = undefined;
            if (data.added_at && typeof data.added_at.toMillis === "function") {
                added_at = data.added_at.toMillis();
            } else if (typeof data.added_at === "number") {
                added_at = data.added_at;
            } else {
                added_at = Date.now();
            }
            return {
                ...data,
                added_at,
            };
        });
        callback(items as FavoriteItem[]);
    });
}
