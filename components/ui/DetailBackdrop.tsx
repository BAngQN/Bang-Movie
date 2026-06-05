"use client";

import { useState } from "react";
import Image from "next/image";
import { getImageUrl } from "@/types/common";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { FavoriteButton } from "@/components/ui/FavoriteButton";
import { TrailerModal } from "@/components/ui/TrailerModel";
import type { Video, Genre } from "@/types";

interface Props {
    id: number;
    title: string;
    backdropPath: string | null;
    posterPath: string | null;
    date: string;
    genres: Genre[];
    voteAverage: number;
    tagline?: string | null;
    overview: string;
    trailers: Video[];
    /** Formatted runtime string: "2h 30m" for movies, "45m / ep" for TV */
    runtime: string | null;
    /** Director, Creator, etc. */
    creditPerson?: { name: string; role: string };
    genreType: "movie" | "tv";
    year: number | "";
}

export function DetailBackdrop({
    id,
    title,
    backdropPath,
    posterPath,
    date,
    genres,
    voteAverage,
    tagline,
    overview,
    trailers,
    runtime,
    creditPerson,
    genreType,
    year,
}: Props) {
    const [activeTrailer, setActiveTrailer] = useState<string | null>(null);

    return (
        <>
            {activeTrailer && (
                <TrailerModal
                    videoKey={activeTrailer}
                    onClose={() => setActiveTrailer(null)}
                />
            )}
            <div className="relative">
                <div className="relative h-[460px] w-full overflow-hidden">
                    <Image
                        src={getImageUrl(backdropPath, "original")}
                        alt={title}
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
                                    src={getImageUrl(posterPath, "w300")}
                                    alt={title}
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
                                    {title}
                                    <span className="ml-3 text-2xl font-normal text-gray-400">
                                        ({year})
                                    </span>
                                </h1>
                                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-300">
                                    <span>{date}</span>
                                    <span>•</span>
                                    <span>
                                        {genres.map((g) => g.name).join(", ")}
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
                                    <ScoreRing score={voteAverage} />
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
                                            id,
                                            title,
                                            poster_path: posterPath,
                                            genre_type: genreType,
                                        }}
                                    />
                                    <span className="text-xs text-gray-400">
                                        Favourite
                                    </span>
                                </div>
                            </div>

                            {tagline && (
                                <p className="italic text-gray-400 text-sm">
                                    {tagline}
                                </p>
                            )}

                            <div>
                                <h3 className="mb-1 font-semibold text-white">
                                    Overview
                                </h3>
                                <p className="max-w-2xl text-sm leading-relaxed text-gray-300">
                                    {overview}
                                </p>
                            </div>

                            {creditPerson && (
                                <div>
                                    <p className="text-sm font-semibold text-white">
                                        {creditPerson.name}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {creditPerson.role}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
