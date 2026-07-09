"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { addFavorite, removeFavorite } from "@/lib/favorites";
import type { FavoriteItem } from "@/types";

interface FavoriteButtonProps {
    item: FavoriteItem;
}

export function FavoriteButton({ item }: FavoriteButtonProps) {
    const router = useRouter();
    const { user } = useAppSelector((s) => s.auth);
    const favorites = useAppSelector((s) => s.favorites.items);
    const [pending, setPending] = useState(false);

    const isFav = favorites.some(
        (f) => f.id === item.id && f.genre_type === item.genre_type,
    );

    const toggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            router.push("/auth/login");
            return;
        }

        setPending(true);
        try {
            if (isFav) {
                await removeFavorite(user.uid, item.id, item.genre_type);
            } else {
                await addFavorite(user.uid, item);
            }
        } finally {
            setPending(false);
        }
    };

    return (
        <button
            onClick={toggle}
            disabled={pending}
            aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
            className={`flex items-center justify-center rounded-full transition-all disabled:opacity-60 ${
                isFav
                    ? "text-red-500 hover:text-red-400"
                    : "text-white/70 hover:text-red-400"
            }`}
        >
            {isFav ? (
                /* Filled heart */
                <svg
                    className="h-5 w-5 drop-shadow"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
            ) : (
                /* Outline heart */
                <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                </svg>
            )}
        </button>
    );
}
