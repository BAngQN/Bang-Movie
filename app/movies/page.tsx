"use client";

import { Suspense } from "react";
import { useDiscoverMoviesQuery, useGetMovieGenresQuery } from "@/store/api";
import { getImageUrl } from "@/types/common";
import Image from "next/image";
import Link from "next/link";
import { useGenreFilter } from "@/hooks/useGenreFilter";
import { GenreSidebar } from "@/components/ui/GenreSidebar";
import { StarRating } from "@/components/ui/StarRating";
import { Pagination } from "@/components/ui/Pagination";

function MoviesContent() {
    const { genreId, genreName, page, setPage, selectGenre, clearGenre } =
        useGenreFilter("/movies");

    const { data, isFetching } = useDiscoverMoviesQuery({ genreId, page });
    const { data: genres = [] } = useGetMovieGenresQuery();

    const movies = data?.results ?? [];
    const totalPages = Math.min(data?.total_pages ?? 1, 500);

    return (
        <div className="mx-auto max-w-7xl px-4 py-8">
            <div className="flex gap-8">
                <GenreSidebar
                    genres={genres}
                    selectedId={genreId}
                    allLabel="All Movies"
                    onSelect={selectGenre}
                    onClear={clearGenre}
                />

                <main className="flex-1 min-w-0">
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-white">
                            {genreName ?? "All Movies"}
                        </h1>
                        {data && (
                            <span className="text-sm text-gray-400">
                                {data.total_results.toLocaleString()} results
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
                                <Link
                                    key={movie.id}
                                    href={`/movie/${movie.id}`}
                                    className="group/card"
                                >
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
                            ))}
                        </div>
                    )}

                    {!isFetching && (
                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            onPage={setPage}
                        />
                    )}
                </main>
            </div>
        </div>
    );
}

export default function MoviesPage() {
    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center py-32">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-600 border-t-red-500" />
                </div>
            }
        >
            <MoviesContent />
        </Suspense>
    );
}
