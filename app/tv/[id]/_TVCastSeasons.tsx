"use client";

import { useState } from "react";
import Image from "next/image";
import type { Credits, Season } from "@/types";
import { getImageUrl } from "@/types/common";
import { CastList } from "@/components/ui/CastList";

interface Props {
    credits: Credits;
    seasons: Season[];
}

export function TVCastSeasons({ credits, seasons }: Props) {
    const [activeTab, setActiveTab] = useState<"cast" | "seasons">("cast");
    const topCast = credits?.cast.slice(0, 8) ?? [];

    return (
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
                    <CastList cast={topCast} />
                </div>
            )}

            {activeTab === "seasons" && seasons.length > 0 && (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {seasons.map((season) => (
                        <div
                            key={season.id}
                            className="overflow-hidden rounded-lg bg-[#1a1a2e] shadow"
                        >
                            <div className="relative aspect-[2/3] w-full bg-gray-800">
                                <Image
                                    src={getImageUrl(season.poster_path, "w300")}
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
    );
}
