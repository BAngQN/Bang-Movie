"use client";

import { useSearchParams, useRouter } from "next/navigation";
import {
    useSearchMoviesFullQuery,
    useSearchTVShowsQuery,
    useSearchCollectionsQuery,
} from "@/store/api";
import type { Movie, TVShow, Collection } from "@/types";
import Sidebar from "./_Sidebar";
import CountBar from "./_Countbar";
import ResultCard from "./_ResultCard";
import Pagination from "./_Pagination";

export type SearchType = "movie" | "tv" | "collection";
export default function SearchContent() {
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

    console.log(`search Data ${collectionData}`);
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
                    <Sidebar
                        type={type}
                        categories={categories}
                        navigate={navigate}
                    />

                    {/* Results */}
                    <div className="flex-1 min-w-0">
                        {/* Count bar */}
                        <CountBar totalResults={totalResults} />

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
                                    currentPage={page}
                                    totalPages={totalPages}
                                    onPageChange={(p) => navigate(type, p)}
                                />
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
