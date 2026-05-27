"use client";

import { use, useState } from "react";
import Image from "next/image";
import {
    useGetMovieDetailQuery,
    useGetMovieVideosQuery,
    useGetMovieCreditsQuery,
    useGetSimilarMoviesQuery,
} from "@/store/api";
import { getImageUrl } from "@/types/common";
import { MovieCard } from "@/components/ui/MovieCard";
import { FavoriteButton } from "@/components/ui/FavoriteButton";
import { TrailerModal } from "@/components/ui/TrailerModel";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { TrailerCard } from "@/components/ui/TrailerCard";
import { Fact } from "@/components/ui/Fact";
import { ScrollView } from "@/components/ui/ScrollView";

export default function MovieDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const movieId = Number(id);

    const [activeTrailer, setActiveTrailer] = useState<string | null>(null);

    const { data: movie, isLoading } = useGetMovieDetailQuery(movieId);
    const { data: trailers = [] } = useGetMovieVideosQuery(movieId);
    const { data: credits } = useGetMovieCreditsQuery(movieId);
    const { data: similar = [] } = useGetSimilarMoviesQuery(movieId);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-600 border-t-red-500" />
            </div>
        );
    }
    if (!movie)
        return (
            <p className="p-8 text-center text-gray-400">Movie not found.</p>
        );

    const year = movie.release_date
        ? new Date(movie.release_date).getFullYear()
        : "";
    const runtime = movie.runtime
        ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
        : null;
    const director = credits?.crew.find((c) => c.job === "Director");
    const topCast = credits?.cast.slice(0, 8) ?? [];

    return (
        <>
            {activeTrailer && (
                <TrailerModal
                    videoKey={activeTrailer}
                    onClose={() => setActiveTrailer(null)}
                />
            )}

            {/* Hero backdrop */}
            <div className="relative">
                <div className="relative h-[460px] w-full overflow-hidden">
                    <Image
                        src={getImageUrl(movie.backdrop_path, "original")}
                        alt={movie.title}
                        fill
                        className="object-cover object-top"
                        priority
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f1a]/95 via-[#0f0f1a]/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f1a] via-transparent to-transparent" />
                </div>

                <div className="absolute inset-0 flex items-center">
                    <div className="mx-auto flex w-full max-w-7xl gap-8 px-4">
                        {/* Poster */}
                        <div className="hidden md:block flex-shrink-0">
                            <div className="relative h-[280px] w-[187px] overflow-hidden rounded-xl shadow-2xl">
                                <Image
                                    src={getImageUrl(movie.poster_path, "w300")}
                                    alt={movie.title}
                                    fill
                                    className="object-cover"
                                    sizes="187px"
                                />
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 space-y-4">
                            <div>
                                <h1 className="text-3xl font-bold text-white md:text-4xl">
                                    {movie.title}
                                    <span className="ml-3 text-2xl font-normal text-gray-400">
                                        ({year})
                                    </span>
                                </h1>
                                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-300">
                                    <span>{movie.release_date}</span>
                                    <span>•</span>
                                    <span>
                                        {movie.genres
                                            .map((g) => g.name)
                                            .join(", ")}
                                    </span>
                                    {runtime && (
                                        <>
                                            <span>•</span>
                                            <span>{runtime}</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <ScoreRing score={movie.vote_average} />
                                    <span className="text-xs leading-tight text-gray-300">
                                        User
                                        <br />
                                        Score
                                    </span>
                                </div>
                                {trailers.length > 0 && (
                                    <button
                                        onClick={() =>
                                            setActiveTrailer(trailers[0].key)
                                        }
                                        className="flex items-center gap-2 text-sm font-semibold text-white hover:text-gray-300 transition-colors"
                                    >
                                        <span className="text-lg">▶</span> Play
                                        Trailer
                                    </button>
                                )}
                                <div className="flex items-center gap-2">
                                    <FavoriteButton
                                        item={{
                                            id: movie.id,
                                            title: movie.title,
                                            poster_path: movie.poster_path,
                                            genre_type: "movie",
                                        }}
                                    />
                                    <span className="text-xs text-gray-400">
                                        Favourite
                                    </span>
                                </div>
                            </div>

                            {movie.tagline && (
                                <p className="italic text-gray-400 text-sm">
                                    {movie.tagline}
                                </p>
                            )}

                            <div>
                                <h3 className="mb-1 font-semibold text-white">
                                    Overview
                                </h3>
                                <p className="max-w-2xl text-sm leading-relaxed text-gray-300">
                                    {movie.overview}
                                </p>
                            </div>

                            {director && (
                                <div>
                                    <p className="text-sm font-semibold text-white">
                                        {director.name}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        Director
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8">
                <div className="min-w-0 flex-1 space-y-10">
                    {/* Cast */}
                    {topCast.length > 0 && (
                        <section>
                            <h2 className="mb-4 text-xl font-bold text-white">
                                Top Billed Cast
                            </h2>
                            <ScrollView>
                                {topCast.map((member) => (
                                    <div
                                        key={member.id}
                                        className="w-[120px] flex-shrink-0 overflow-hidden rounded-lg bg-[#1a1a2e] shadow"
                                    >
                                        <div className="relative h-[135px] w-full bg-gray-800">
                                            <Image
                                                src={getImageUrl(
                                                    member.profile_path,
                                                    "w200",
                                                )}
                                                alt={member.name}
                                                fill
                                                className="object-cover object-top"
                                                sizes="120px"
                                            />
                                        </div>
                                        <div className="p-2">
                                            <p className="text-xs font-semibold leading-tight text-white">
                                                {member.name}
                                            </p>
                                            <p className="mt-0.5 line-clamp-2 text-[10px] leading-tight text-gray-400">
                                                {member.character}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </ScrollView>
                        </section>
                    )}

                    {/* Trailers */}
                    {trailers.length > 0 && (
                        <section>
                            <h2 className="mb-4 text-xl font-bold text-white">
                                Trailers{" "}
                                <span className="text-base font-normal text-gray-400">
                                    ({trailers.length})
                                </span>
                            </h2>
                            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                                {trailers.map((t) => (
                                    <TrailerCard
                                        key={t.id}
                                        trailer={t}
                                        onClick={() => setActiveTrailer(t.key)}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Similar */}
                    {similar.length > 0 && (
                        <section>
                            <h2 className="mb-4 text-xl font-bold text-white">
                                More Like This
                            </h2>
                            <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
                                {similar.map((m) => (
                                    <MovieCard key={m.id} item={m} />
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Sidebar */}
                <aside className="hidden w-56 flex-shrink-0 space-y-4 lg:block">
                    <Fact label="Status" value={movie.status} />
                    <Fact
                        label="Original Language"
                        value={movie.original_language.toUpperCase()}
                    />
                    <Fact
                        label="Budget"
                        value={
                            movie.budget
                                ? `$${movie.budget.toLocaleString()}`
                                : "—"
                        }
                    />
                    <Fact
                        label="Revenue"
                        value={
                            movie.revenue
                                ? `$${movie.revenue.toLocaleString()}`
                                : "—"
                        }
                    />
                    {movie.homepage && (
                        <div>
                            <p className="font-semibold text-white">Homepage</p>
                            <a
                                href={movie.homepage}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="break-all text-sm text-blue-400 hover:underline"
                            >
                                Visit site
                            </a>
                        </div>
                    )}
                </aside>
            </div>
        </>
    );
}
