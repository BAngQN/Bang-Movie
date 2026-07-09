"use client";

import { useState } from "react";
import { TrailerCard } from "@/components/ui/TrailerCard";
import { TrailerModal } from "@/components/ui/TrailerModel";
import type { Video } from "@/types";

interface Props {
    trailers: Video[];
}

export function TrailerSection({ trailers }: Props) {
    const [activeTrailer, setActiveTrailer] = useState<string | null>(null);

    if (trailers.length === 0) return null;

    return (
        <section>
            {activeTrailer && (
                <TrailerModal
                    videoKey={activeTrailer}
                    onClose={() => setActiveTrailer(null)}
                />
            )}
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
    );
}
