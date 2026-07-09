"use client";

import { useRef } from "react";
import Link from "next/link";
import type { Movie, TVShow, Genre } from "@/types";
import { MovieCard } from "./MovieCard";
import { ScrollView } from "./ScrollView";

interface MovieCarouselProps {
    title: string;
    items: (Movie | TVShow)[];
    genres?: Genre[];
    viewAllHref?: string;
}

export function MovieCarousel({
    title,
    items,
    genres = [],
    viewAllHref,
}: MovieCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (!scrollRef.current) return;
        const scrollAmount = 600;
        scrollRef.current.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

    if (!items.length) return null;

    return (
        <section className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">{title}</h2>
                {viewAllHref && (
                    <Link
                        href={viewAllHref}
                        className="text-sm text-red-500 hover:underline"
                    >
                        View all
                    </Link>
                )}
            </div>

            {/* Carousel */}
            <div className="group/carousel relative">
                {/* Left Arrow */}
                <button
                    onClick={() => scroll("left")}
                    className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white opacity-0 transition-opacity group-hover/carousel:opacity-100 hover:bg-black/80"
                    aria-label="Scroll left"
                >
                    <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                </button>

                {/* Cards */}
                <ScrollView ref={scrollRef}>
                    {items.map((item) => (
                        <MovieCard key={item.id} item={item} genres={genres} />
                    ))}
                </ScrollView>

                {/* Right Arrow */}
                <button
                    onClick={() => scroll("right")}
                    className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white opacity-0 transition-opacity group-hover/carousel:opacity-100 hover:bg-black/80"
                    aria-label="Scroll right"
                >
                    <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </button>
            </div>
        </section>
    );
}
