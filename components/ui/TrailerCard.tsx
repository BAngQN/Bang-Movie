"use client";

import { Video } from "@/types";
import Image from "next/image";

interface TrailerCardProps {
    trailer: Video;
    onClick: () => void;
}

export function TrailerCard({ trailer, onClick }: TrailerCardProps) {
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
