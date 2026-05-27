"use client";

import { use, useState } from "react";
import Image from "next/image";
import {
    useGetTVDetailQuery,
    useGetTVVideosQuery,
    useGetTVCreditsQuery,
    useGetSimilarTVQuery,
} from "@/store/api";
import { getImageUrl } from "@/types/common";
import { MovieCard } from "@/components/ui/MovieCard";
import { FavoriteButton } from "@/components/ui/FavoriteButton";
import type { Video } from "@/types";

// Score ring
function ScoreRing({ score }: { score: number }) {
    const pct = Math.round(score * 10);
    const color = pct >= 70 ? "#21d07a" : pct >= 50 ? "#d2d531" : "#db2360";
    const r = 18;
    const circ = 2 * Math.PI * r;
    const dash = (pct / 100) * circ;
    return (
        <div className="relative h-14 w-14">
            <svg viewBox="0 0 44 44" className="h-full w-full -rotate-90">
                <circle
                    cx="22"
                    cy="22"
                    r={r}
                    fill="#081c22"
                    stroke="#204529"
                    strokeWidth="4"
                />
                <circle
                    cx="22"
                    cy="22"
                    r={r}
                    fill="none"
                    stroke={color}
                    strokeWidth="4"
                    strokeDasharray={`${dash} ${circ - dash}`}
                    strokeLinecap="round"
                />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                {pct}
                <sup className="text-[8px]">%</sup>
            </span>
        </div>
    );
}

// Trailer modal
function TrailerModal({
    videoKey,
    onClose,
}: {
    videoKey: string;
    onClose: () => void;
}) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-4xl px-4"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute -top-10 right-4 text-2xl text-white hover:text-gray-300"
                >
                    ✕
                </button>
                <div className="aspect-video w-full overflow-hidden rounded-xl">
                    <iframe
                        src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
                        title="Trailer"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                        className="h-full w-full"
                    />
                </div>
            </div>
        </div>
    );
}

//Trailer card
function TrailerCard({
    trailer,
    onClick,
}: {
    trailer: Video;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className="group/trailer flex-shrink-0 w-64 overflow-hidden rounded-lg bg-gray-800"
        >
            <div className="relative h-36 w-full">
                <Image
                    src={`https://img.youtube.com/vi/${trailer.key}/hqdefault.jpg`}
                    alt={trailer.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover/trailer:scale-105"
                    sizes="256px"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover/trailer:bg-black/50">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600/90 text-xl text-white">
                        ▶
                    </span>
                </div>
            </div>
            <p className="p-2 text-left text-xs text-gray-300 line-clamp-2 group-hover/trailer:text-white">
                {trailer.name}
            </p>
        </button>
    );
}

// Fact
function Fact({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="font-semibold text-white">{label}</p>
            <p className="text-sm text-gray-400">{value}</p>
        </div>
    );
}

// Page
export default function TVDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const seriesId = Number(id);

    const [activeTrailer, setActiveTrailer] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"seasons" | "cast">("cast");

    const { data: show, isLoading } = useGetTVDetailQuery(seriesId);
    const { data: trailers = [] } = useGetTVVideosQuery(seriesId);
    const { data: credits } = useGetTVCreditsQuery(seriesId);
    const { data: similar = [] } = useGetSimilarTVQuery(seriesId);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-600 border-t-red-500" />
            </div>
        );
    }
    if (!show)
        return (
            <p className="p-8 text-center text-gray-400">Series not found.</p>
        );

    const year = show.first_air_date
        ? new Date(show.first_air_date).getFullYear()
        : "";
    const epRuntime = show.episode_run_time?.[0]
        ? `${show.episode_run_time[0]}m`
        : null;
    const creator = show.created_by?.[0];
    const topCast = credits?.cast.slice(0, 8) ?? [];
    const seasons = show.seasons?.filter((s) => s.season_number > 0) ?? [];

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
                        src={getImageUrl(show.backdrop_path, "original")}
                        alt={show.name}
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
                                    src={getImageUrl(show.poster_path, "w300")}
                                    alt={show.name}
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
                                    {show.name}
                                    <span className="ml-3 text-2xl font-normal text-gray-400">
                                        ({year})
                                    </span>
                                </h1>
                                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-300">
                                    <span>{show.first_air_date}</span>
                                    <span>•</span>
                                    <span>
                                        {show.genres
                                            .map((g) => g.name)
                                            .join(", ")}
                                    </span>
                                    {epRuntime && (
                                        <>
                                            <span>•</span>
                                            <span>{epRuntime} / ep</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <ScoreRing score={show.vote_average} />
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
                                            id: show.id,
                                            title: show.name,
                                            poster_path: show.poster_path,
                                            genre_type: "tv",
                                        }}
                                    />
                                    <span className="text-xs text-gray-400">
                                        Favourite
                                    </span>
                                </div>
                            </div>

                            {show.tagline && (
                                <p className="italic text-gray-400 text-sm">
                                    {show.tagline}
                                </p>
                            )}

                            <div>
                                <h3 className="mb-1 font-semibold text-white">
                                    Overview
                                </h3>
                                <p className="max-w-2xl text-sm leading-relaxed text-gray-300">
                                    {show.overview}
                                </p>
                            </div>

                            {creator && (
                                <div>
                                    <p className="text-sm font-semibold text-white">
                                        {creator.name}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        Creator
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
                    {/* Tabs: Cast / Seasons */}
                    <section>
                        <div className="mb-4 flex gap-6 border-b border-gray-700">
                            {(["cast", "seasons"] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-2 text-sm font-semibold capitalize transition-colors ${
                                        activeTab === tab
                                            ? "border-b-2 border-blue-500 text-white"
                                            : "text-gray-400 hover:text-white"
                                    }`}
                                >
                                    {tab === "seasons"
                                        ? `Seasons (${seasons.length})`
                                        : "Cast"}
                                </button>
                            ))}
                        </div>

                        {activeTab === "cast" && topCast.length > 0 && (
                            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
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
                            </div>
                        )}

                        {activeTab === "seasons" && seasons.length > 0 && (
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                                {seasons.map((season) => (
                                    <div
                                        key={season.id}
                                        className="group/season overflow-hidden rounded-lg bg-[#1a1a2e] shadow"
                                    >
                                        <div className="relative aspect-[2/3] w-full bg-gray-800">
                                            <Image
                                                src={getImageUrl(
                                                    season.poster_path,
                                                    "w300",
                                                )}
                                                alt={season.name}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width:640px) 50vw, 25vw"
                                            />
                                        </div>
                                        <div className="p-3">
                                            <p className="font-semibold text-white text-sm">
                                                {season.name}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {season.episode_count} episodes
                                                {season.air_date &&
                                                    ` • ${new Date(season.air_date).getFullYear()}`}
                                            </p>
                                            {season.overview && (
                                                <p className="mt-1 text-[11px] text-gray-500 line-clamp-3">
                                                    {season.overview}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

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
                                {similar.map((s) => (
                                    <MovieCard key={s.id} item={s} />
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Sidebar */}
                <aside className="hidden w-56 flex-shrink-0 space-y-4 lg:block">
                    <Fact label="Status" value={show.status} />
                    <Fact
                        label="Network"
                        value={show.networks?.[0]?.name ?? "—"}
                    />
                    <Fact label="Type" value="TV Series" />
                    <Fact
                        label="Original Language"
                        value={show.original_language.toUpperCase()}
                    />
                    <Fact
                        label="Seasons"
                        value={String(show.number_of_seasons)}
                    />
                    <Fact
                        label="Episodes"
                        value={String(show.number_of_episodes)}
                    />
                    {show.homepage && (
                        <div>
                            <p className="font-semibold text-white">Homepage</p>
                            <a
                                href={show.homepage}
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
