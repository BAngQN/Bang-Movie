"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    useSearchMoviesFullQuery,
    useSearchTVShowsQuery,
    useSearchCollectionsQuery,
} from "@/store/api";
import { getImageUrl } from "@/types/common";
import type { Movie, TVShow, Collection } from "@/types";

type SearchType = "movie" | "tv" | "collection";

function StarIcon() {
    return (
        <svg
            className="h-3.5 w-3.5 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
        >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
    );
}

function ResultCard({
    poster,
    title,
    date,
    overview,
    href,
    rating,
}: {
    poster: string | null;
    title: string;
    date: string;
    overview: string;
    href: string;
    rating?: number;
}) {
    const year = date ? new Date(date).getFullYear() : null;
    return (
        <Link
            href={href}
            className="group flex gap-4 rounded-lg border border-gray-800 bg-[#1a1a2e] p-3 transition hover:border-gray-600 hover:bg-[#1f1f35]"
        >
            <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded">
                <Image
                    src={getImageUrl(poster, "w200")}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="64px"
                />
            </div>
            <div className="flex min-w-0 flex-col gap-1 py-1">
                <h3 className="truncate font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    {year && <span>{year}</span>}
                    {rating !== undefined && rating > 0 && (
                        <span className="flex items-center gap-1">
                            <StarIcon />
                            {rating.toFixed(1)}
                        </span>
                    )}
                </div>
                {overview && (
                    <p className="line-clamp-2 text-xs text-gray-400 leading-relaxed">
                        {overview}
                    </p>
                )}
            </div>
        </Link>
    );
}

function Pagination({
    page,
    totalPages,
    onPage,
}: {
    page: number;
    totalPages: number;
    onPage: (p: number) => void;
}) {
    const capped = Math.min(totalPages, 500);
    if (capped <= 1) return null;

    const pages: (number | "…")[] = [];
    if (capped <= 7) {
        for (let i = 1; i <= capped; i++) pages.push(i);
    } else {
        pages.push(1);
        if (page > 3) pages.push("…");
        for (
            let i = Math.max(2, page - 1);
            i <= Math.min(capped - 1, page + 1);
            i++
        )
            pages.push(i);
        if (page < capped - 2) pages.push("…");
        pages.push(capped);
    }

    return (
        <div className="mt-8 flex items-center justify-center gap-1">
            <button
                disabled={page === 1}
                onClick={() => onPage(page - 1)}
                className="rounded px-3 py-1.5 text-sm text-gray-400 hover:text-white disabled:opacity-30"
            >
                ← Prev
            </button>
            {pages.map((p, i) =>
                p === "…" ? (
                    <span key={`ellipsis-${i}`} className="px-2 text-gray-500">
                        …
                    </span>
                ) : (
                    <button
                        key={p}
                        onClick={() => onPage(p as number)}
                        className={`min-w-[36px] rounded px-2 py-1.5 text-sm transition ${
                            p === page
                                ? "bg-blue-600 text-white"
                                : "text-gray-400 hover:bg-gray-700 hover:text-white"
                        }`}
                    >
                        {p}
                    </button>
                ),
            )}
            <button
                disabled={page === capped}
                onClick={() => onPage(page + 1)}
                className="rounded px-3 py-1.5 text-sm text-gray-400 hover:text-white disabled:opacity-30"
            >
                Next →
            </button>
        </div>
    );
}

function SearchContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const query = searchParams.get("q") ?? "";
    const type = (searchParams.get("type") ?? "movie") as SearchType;
    const page = Number(searchParams.get("page") ?? "1");

    const skip = !query.trim();

    const { data: movieData, isFetching: movieFetching } =
        useSearchMoviesFullQuery(
            { query, page: type === "movie" ? page : 1 },
            { skip },
        );
    const { data: tvData, isFetching: tvFetching } = useSearchTVShowsQuery(
        { query, page: type === "tv" ? page : 1 },
        { skip },
    );
    const { data: collectionData, isFetching: collectionFetching } =
        useSearchCollectionsQuery(
            { query, page: type === "collection" ? page : 1 },
            { skip },
        );

    const navigate = (newType: SearchType, newPage = 1) => {
        const params = new URLSearchParams({
            q: query,
            type: newType,
            page: String(newPage),
        });
        router.push(`/search?${params}`);
    };

    const categories: { key: SearchType; label: string; count: number }[] = [
        { key: "movie", label: "Movies", count: movieData?.total_results ?? 0 },
        { key: "tv", label: "TV Shows", count: tvData?.total_results ?? 0 },
        {
            key: "collection",
            label: "Collections",
            count: collectionData?.total_results ?? 0,
        },
    ];

    const isLoading =
        (type === "movie" && movieFetching) ||
        (type === "tv" && tvFetching) ||
        (type === "collection" && collectionFetching);

    const activeData =
        type === "movie" ? movieData : type === "tv" ? tvData : collectionData;

    const totalPages = activeData?.total_pages ?? 0;
    const totalResults = activeData?.total_results ?? 0;

    return (
        <div className="mx-auto max-w-7xl px-4 py-8">
            {/* Heading */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">
                    Search Results
                    {query && (
                        <span className="ml-2 text-gray-400 font-normal text-xl">
                            for &ldquo;
                            <span className="text-blue-400">{query}</span>
                            &rdquo;
                        </span>
                    )}
                </h1>
            </div>

            {!query.trim() ? (
                <div className="flex flex-col items-center gap-4 py-20 text-gray-400">
                    <svg
                        className="h-16 w-16 opacity-30"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                    <p className="text-lg">
                        Type something in the search box to get started.
                    </p>
                </div>
            ) : (
                <div className="flex gap-6">
                    {/* Sidebar */}
                    <aside className="hidden w-56 shrink-0 lg:block">
                        <div className="rounded-lg border border-gray-800 bg-[#1a1a2e] overflow-hidden">
                            <div className="border-b border-gray-800 bg-blue-600 px-4 py-3">
                                <span className="font-semibold text-white text-sm">
                                    Search Results
                                </span>
                            </div>
                            {categories.map(({ key, label, count }) => (
                                <button
                                    key={key}
                                    onClick={() => navigate(key)}
                                    className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition hover:bg-gray-800 ${
                                        type === key
                                            ? "font-semibold text-white bg-gray-800/60"
                                            : "text-gray-400"
                                    }`}
                                >
                                    <span>{label}</span>
                                    <span
                                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                            type === key
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-700 text-gray-300"
                                        }`}
                                    >
                                        {count.toLocaleString()}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </aside>

                    {/* Mobile category tabs */}
                    <div className="flex w-full flex-col gap-4 lg:hidden">
                        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                            {categories.map(({ key, label, count }) => (
                                <button
                                    key={key}
                                    onClick={() => navigate(key)}
                                    className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition ${
                                        type === key
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                                    }`}
                                >
                                    {label}
                                    <span className="rounded-full bg-black/30 px-1.5 py-0.5 text-xs">
                                        {count.toLocaleString()}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Results */}
                    <div className="flex-1 min-w-0">
                        {/* Count bar */}
                        <div className="mb-4 flex items-center justify-between">
                            <p className="text-sm text-gray-400">
                                {totalResults.toLocaleString()} result
                                {totalResults !== 1 ? "s" : ""} found
                            </p>
                        </div>

                        {isLoading ? (
                            <div className="flex flex-col gap-3">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="flex gap-4 rounded-lg border border-gray-800 bg-[#1a1a2e] p-3 animate-pulse"
                                    >
                                        <div className="h-24 w-16 rounded bg-gray-700" />
                                        <div className="flex flex-1 flex-col gap-2 py-1">
                                            <div className="h-4 w-2/3 rounded bg-gray-700" />
                                            <div className="h-3 w-1/4 rounded bg-gray-700" />
                                            <div className="h-3 w-full rounded bg-gray-700" />
                                            <div className="h-3 w-4/5 rounded bg-gray-700" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (activeData?.results.length ?? 0) === 0 ? (
                            <div className="flex flex-col items-center gap-3 py-16 text-gray-500">
                                <svg
                                    className="h-12 w-12 opacity-30"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <p>
                                    No{" "}
                                    {type === "movie"
                                        ? "movies"
                                        : type === "tv"
                                          ? "TV shows"
                                          : "collections"}{" "}
                                    found for &ldquo;{query}&rdquo;.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="flex flex-col gap-3">
                                    {type === "movie" &&
                                        (movieData?.results ?? []).map(
                                            (item: Movie) => (
                                                <ResultCard
                                                    key={item.id}
                                                    poster={item.poster_path}
                                                    title={item.title}
                                                    date={item.release_date}
                                                    overview={item.overview}
                                                    href={`/movie/${item.id}`}
                                                    rating={item.vote_average}
                                                />
                                            ),
                                        )}
                                    {type === "tv" &&
                                        (tvData?.results ?? []).map(
                                            (item: TVShow) => (
                                                <ResultCard
                                                    key={item.id}
                                                    poster={item.poster_path}
                                                    title={item.name}
                                                    date={item.first_air_date}
                                                    overview={item.overview}
                                                    href={`/tv/${item.id}`}
                                                    rating={item.vote_average}
                                                />
                                            ),
                                        )}
                                    {type === "collection" &&
                                        (collectionData?.results ?? []).map(
                                            (item: Collection) => (
                                                <ResultCard
                                                    key={item.id}
                                                    poster={item.poster_path}
                                                    title={item.name}
                                                    date=""
                                                    overview={item.overview}
                                                    href={`/collection/${item.id}`}
                                                />
                                            ),
                                        )}
                                </div>
                                <Pagination
                                    page={page}
                                    totalPages={totalPages}
                                    onPage={(p) => navigate(type, p)}
                                />
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center py-32">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                </div>
            }
        >
            <SearchContent />
        </Suspense>
    );
}
