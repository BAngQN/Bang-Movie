"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import Image from "next/image";
import { getImageUrl } from "@/types/common";
import type { Movie } from "@/types";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface HeroBannerProps {
    movies: Movie[];
}

export function HeroBanner({ movies }: HeroBannerProps) {
    if (!movies.length) return null;

    return (
        <div className="relative w-full aspect-[16/7] overflow-hidden rounded-lg">
            <Swiper
                modules={[Navigation, Autoplay, Pagination]}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                loop
                className="h-full w-full"
            >
                {movies.slice(0, 5).map((movie) => (
                    <SwiperSlide key={movie.id}>
                        <div className="relative h-full w-full">
                            <Image
                                src={getImageUrl(
                                    movie.backdrop_path,
                                    "original",
                                )}
                                alt={movie.title}
                                fill
                                className="object-cover"
                                priority
                                sizes="100vw"
                            />
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            {/* Title */}
                            <div className="absolute bottom-8 left-8">
                                <h2 className="text-3xl font-bold uppercase tracking-widest text-white drop-shadow-lg md:text-5xl">
                                    {movie.title}
                                </h2>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
