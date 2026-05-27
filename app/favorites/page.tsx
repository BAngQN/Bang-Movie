"use client";

import Link from "next/link";
import Image from "next/image";
import { useAppSelector } from "@/store/hooks";
import { getImageUrl } from "@/types/common";
import { FavoriteButton } from "@/components/ui/FavoriteButton";

export default function FavoritesPage() {
    const { user, loading: authLoading } = useAppSelector((s) => s.auth);
    const { items, loading: favLoading } = useAppSelector((s) => s.favorites);

    if (authLoading) {
        return (
            <div className="flex items-center justify-center py-32">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-600 border-t-red-500" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center gap-4 py-32 text-gray-400">
                <svg
                    className="h-16 w-16 opacity-30"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                </svg>
                <p className="text-lg font-medium">
                    Sign in to see your favourites
                </p>
                <Link
                    href="/auth/login"
                    className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition"
                >
                    Sign In
                </Link>
            </div>
        );
    }

    const movies = items.filter((f) => f.genre_type === "movie");
    const tvShows = items.filter((f) => f.genre_type === "tv");

    return (
        <div className="mx-auto max-w-7xl px-4 py-8">
            <div className="mb-8 flex items-center gap-3">
                <svg
                    className="h-7 w-7 text-red-500"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                <h1 className="text-2xl font-bold text-white">My Favourites</h1>
                <span className="rounded-full bg-gray-700 px-2.5 py-0.5 text-xs font-medium text-gray-300">
                    {items.length}
                </span>
            </div>

            {favLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-600 border-t-red-500" />
                </div>
            ) : items.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-24 text-gray-500">
                    <svg
                        className="h-14 w-14 opacity-30"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                    </svg>
                    <p className="text-lg">No favourites yet.</p>
                    <p className="text-sm">
                        Click the <span className="text-red-400">♥</span> on any
                        movie or TV show to save it here.
                    </p>
                </div>
            ) : (
                <div className="space-y-10">
                    {/* Movies section */}
                    {movies.length > 0 && (
                        <section>
                            <div className="mb-4 flex items-center gap-2">
                                <h2 className="text-lg font-semibold text-white">
                                    Movies
                                </h2>
                                <span className="rounded-full bg-blue-600/30 px-2 py-0.5 text-xs font-medium text-blue-400">
                                    {movies.length}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                {movies.map((item) => (
                                    <FavoriteCard
                                        key={`movie_${item.id}`}
                                        item={item}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* TV Shows section */}
                    {tvShows.length > 0 && (
                        <section>
                            <div className="mb-4 flex items-center gap-2">
                                <h2 className="text-lg font-semibold text-white">
                                    TV Shows
                                </h2>
                                <span className="rounded-full bg-purple-600/30 px-2 py-0.5 text-xs font-medium text-purple-400">
                                    {tvShows.length}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                {tvShows.map((item) => (
                                    <FavoriteCard
                                        key={`tv_${item.id}`}
                                        item={item}
                                    />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            )}
        </div>
    );
}

function FavoriteCard({
    item,
}: {
    item: {
        id: number;
        title: string;
        poster_path: string | null;
        genre_type: "movie" | "tv";
    };
}) {
    const href =
        item.genre_type === "tv" ? `/tv/${item.id}` : `/movie/${item.id}`;
    return (
        <div className="group/card relative">
            <Link href={href}>
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-gray-800">
                    <Image
                        src={getImageUrl(item.poster_path, "w300")}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover/card:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity group-hover/card:opacity-100 flex items-center justify-center">
                        <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                            View details
                        </span>
                    </div>
                    {/* Type badge */}
                    <div
                        className={`absolute top-2 left-2 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                            item.genre_type === "tv"
                                ? "bg-purple-600/80 text-white"
                                : "bg-blue-600/80 text-white"
                        }`}
                    >
                        {item.genre_type === "tv" ? "TV" : "Movie"}
                    </div>
                </div>
                <p className="mt-2 text-xs font-medium text-white leading-tight line-clamp-2 group-hover/card:text-blue-400 transition-colors">
                    {item.title}
                </p>
            </Link>
            {/* Remove button */}
            <div className="absolute top-2 right-2">
                <FavoriteButton item={item} />
            </div>
        </div>
    );
}
