"use client";

import {
    useGetUpcomingQuery,
    useGetNowPlayingQuery,
    useGetPopularQuery,
    useGetTopRatedQuery,
    useGetTrendingTVQuery,
    useGetMovieGenresQuery,
} from "@/store/api";
import { HeroBanner } from "@/components/ui/HeroBanner";
import { MovieCarousel } from "@/components/ui/MovieCarousel";

export function HomeContent() {
    const { data: nowPlaying = [], isLoading: nowPlayingLoading } =
        useGetNowPlayingQuery();
    const { data: upcoming = [] } = useGetUpcomingQuery();
    const { data: popular = [] } = useGetPopularQuery();
    const { data: topRated = [] } = useGetTopRatedQuery();
    const { data: trendingTV = [] } = useGetTrendingTVQuery("week");
    const { data: genres = [] } = useGetMovieGenresQuery();

    // Show loading spinner if nowPlaying movies are still loading and we have no data yet
    if (nowPlayingLoading && !nowPlaying.length) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-600 border-t-red-500" />
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Hero Banner */}
            <HeroBanner movies={nowPlaying} />

            {/* Upcoming */}
            <MovieCarousel
                title="Upcoming"
                items={upcoming}
                genres={genres}
                viewAllHref="/movies/upcoming"
            />

            {/* Popular */}
            <MovieCarousel
                title="Popular"
                items={popular}
                genres={genres}
                viewAllHref="/movies/popular"
            />

            {/* Top Rated */}
            <MovieCarousel
                title="Top Rated"
                items={topRated}
                genres={genres}
                viewAllHref="/movies/top-rated"
            />

            {/* Web Series / TV */}
            <MovieCarousel
                title="Web Series"
                items={trendingTV}
                genres={genres}
                viewAllHref="/tv-shows"
            />
        </div>
    );
}
