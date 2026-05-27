"use client";

import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/types/common";
import { FavoriteButton } from "@/components/ui/FavoriteButton";
import type { Movie } from "@/types";

interface MovieListPageProps {
    title: string;
    movies: Movie[];
    totalResults: number;
    totalPages: number;
    page: number;
    setPage: (p: number) => void;
    isFetching: boolean;
}

function StarRating({ score }: { score: number }) {
    return (
        <span className="flex items-center gap-1 text-xs text-yellow-400 font-medium">
            ★ {score.toFixed(1)}
        </span>
    );
}

export function MovieListPage({
    title,
    movies,
    totalResults,
    totalPages,
    page,
    setPage,
    isFetching,
}: MovieListPageProps) {
    return (
        <div className="mx-auto max-w-7xl px-4 py-8">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">{title}</h1>
                {totalResults > 0 && (
                    <span className="text-sm text-gray-400">
                        {totalResults.toLocaleString()} results
                    </span>
                )}
            </div>

            {isFetching ? (
                <div className="flex items-center justify-center py-32">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-600 border-t-red-500" />
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                    {movies.map((movie) => (
                        <div key={movie.id} className="group/card relative">
                            <Link href={`/movie/${movie.id}`}>
                                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-gray-800">
                                    <Image
                                        src={getImageUrl(
                                            movie.poster_path,
                                            "w300",
                                        )}
                                        alt={movie.title}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover/card:scale-105"
                                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                                    />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity group-hover/card:opacity-100 flex items-center justify-center">
                                        <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
                                            View details
                                        </span>
                                    </div>
                                    <div className="absolute top-2 right-2 rounded bg-black/70 px-1.5 py-0.5">
                                        <StarRating
                                            score={movie.vote_average}
                                        />
                                    </div>
                                </div>
                                <div className="mt-2 space-y-0.5">
                                    <p className="text-xs text-gray-400">
                                        {movie.release_date
                                            ? new Date(
                                                  movie.release_date,
                                              ).getFullYear()
                                            : ""}
                                    </p>
                                    <h3 className="text-sm font-semibold text-white leading-tight line-clamp-2 group-hover/card:text-blue-400 transition-colors">
                                        {movie.title}
                                    </h3>
                                </div>
                            </Link>
                            <div className="absolute top-2 left-2 opacity-0 group-hover/card:opacity-100 transition-opacity">
                                <FavoriteButton
                                    item={{
                                        id: movie.id,
                                        title: movie.title,
                                        poster_path: movie.poster_path,
                                        genre_type: "movie",
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!isFetching && totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                    <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="rounded px-3 py-1.5 text-sm font-medium text-gray-300 border border-gray-600 hover:border-white hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        ← Prev
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const p =
                            Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                        return (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                                    p === page
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-300 border border-gray-600 hover:border-white hover:text-white"
                                }`}
                            >
                                {p}
                            </button>
                        );
                    })}
                    <button
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className="rounded px-3 py-1.5 text-sm font-medium text-gray-300 border border-gray-600 hover:border-white hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        Next →
                    </button>
                </div>
            )}
        </div>
    );
}
