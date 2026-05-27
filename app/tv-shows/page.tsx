"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDiscoverTVQuery, useGetTVGenresQuery } from "@/store/api";
import { getImageUrl } from "@/types/common";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

function StarRating({ score }: { score: number }) {
    return (
        <span className="flex items-center gap-1 text-xs text-yellow-400 font-medium">
            ★ {score.toFixed(1)}
        </span>
    );
}

function TVShowsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const genreId = searchParams.get("genreId")
        ? Number(searchParams.get("genreId"))
        : undefined;
    const genreName = searchParams.get("genre") ?? "All TV Shows";

    const [page, setPage] = useState(1);

    const { data, isFetching } = useDiscoverTVQuery({ genreId, page });
    const { data: genres = [] } = useGetTVGenresQuery();

    const shows = data?.results ?? [];
    const totalPages = Math.min(data?.total_pages ?? 1, 500);

    const selectGenre = (id: number, name: string) => {
        setPage(1);
        router.push(
            `/tv-shows?genreId=${id}&genre=${encodeURIComponent(name)}`,
        );
    };

    const clearGenre = () => {
        setPage(1);
        router.push("/tv-shows");
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-8">
            <div className="flex gap-8">
                {/* Sidebar */}
                <aside className="hidden lg:block w-56 flex-shrink-0">
                    <div className="rounded-lg border border-gray-700 overflow-hidden">
                        <div className="bg-blue-600 px-4 py-3">
                            <h3 className="font-semibold text-white text-sm">
                                Genres
                            </h3>
                        </div>
                        <ul>
                            <li>
                                <button
                                    onClick={clearGenre}
                                    className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-colors border-b border-gray-800 ${
                                        !genreId
                                            ? "bg-blue-600/20 text-blue-400 font-medium"
                                            : "text-gray-300 hover:bg-gray-800 hover:text-white"
                                    }`}
                                >
                                    All TV Shows
                                    {!genreId && (
                                        <span className="text-blue-400">›</span>
                                    )}
                                </button>
                            </li>
                            {genres.map((g) => (
                                <li key={g.id}>
                                    <button
                                        onClick={() =>
                                            selectGenre(g.id, g.name)
                                        }
                                        className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-colors border-b border-gray-800 last:border-0 ${
                                            genreId === g.id
                                                ? "bg-blue-600/20 text-blue-400 font-medium"
                                                : "text-gray-300 hover:bg-gray-800 hover:text-white"
                                        }`}
                                    >
                                        {g.name}
                                        {genreId === g.id && (
                                            <span className="text-blue-400">
                                                ›
                                            </span>
                                        )}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                {/* Main content */}
                <main className="flex-1 min-w-0">
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-white">
                            {genreName}
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
                            {shows.map((show) => (
                                <Link
                                    key={show.id}
                                    href={`/tv/${show.id}`}
                                    className="group/card"
                                >
                                    <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-gray-800">
                                        <Image
                                            src={getImageUrl(
                                                show.poster_path,
                                                "w300",
                                            )}
                                            alt={show.name}
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
                                                score={show.vote_average}
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-2 space-y-0.5">
                                        <p className="text-xs text-gray-400">
                                            {show.first_air_date
                                                ? new Date(
                                                      show.first_air_date,
                                                  ).getFullYear()
                                                : ""}
                                        </p>
                                        <h3 className="text-sm font-semibold text-white leading-tight line-clamp-2 group-hover/card:text-blue-400 transition-colors">
                                            {show.name}
                                        </h3>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {!isFetching && totalPages > 1 && (
                        <div className="mt-10 flex items-center justify-center gap-2">
                            <button
                                onClick={() =>
                                    setPage((p) => Math.max(1, p - 1))
                                }
                                disabled={page === 1}
                                className="rounded px-3 py-1.5 text-sm font-medium text-gray-300 border border-gray-600 hover:border-white hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                ← Prev
                            </button>

                            {Array.from(
                                { length: Math.min(5, totalPages) },
                                (_, i) => {
                                    const p =
                                        Math.max(
                                            1,
                                            Math.min(totalPages - 4, page - 2),
                                        ) + i;
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
                                },
                            )}

                            <button
                                onClick={() =>
                                    setPage((p) => Math.min(totalPages, p + 1))
                                }
                                disabled={page === totalPages}
                                className="rounded px-3 py-1.5 text-sm font-medium text-gray-300 border border-gray-600 hover:border-white hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default function TVShowsPage() {
    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center py-32">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-600 border-t-red-500" />
                </div>
            }
        >
            <TVShowsContent />
        </Suspense>
    );
}
