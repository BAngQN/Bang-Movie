import {
    doc,
    setDoc,
    deleteDoc,
    collection,
    onSnapshot,
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
    await setDoc(ref, { ...item });
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
            return {
                ...data,
            };
        });
        callback(items as FavoriteItem[]);
    });
}
