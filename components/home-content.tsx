import { HeroBanner } from "@/components/ui/HeroBanner";
import { MovieCarousel } from "@/components/ui/MovieCarousel";
import {
    getMovieGenres,
    getNowPlayingMovies,
    getPopularMovies,
    getTopRatedMovies,
    getTrendingMovies,
    getUpcomingMovies,
} from "@/lib/tmdb";
import { Suspense } from "react";
import { CarouselLoading } from "./ui/CarouselLoading";

export async function HomeContent() {
    const [
        nowPlayRes,
        upcomingRes,
        popularRes,
        topRatedRes,
        trendingTVRes,
        genresRes,
    ] = await Promise.all([
        getNowPlayingMovies(),
        getUpcomingMovies(),
        getPopularMovies(),
        getTopRatedMovies(),
        getTrendingMovies("week"),
        getMovieGenres(),
    ]);

    return (
        <div className="space-y-10">
            {/* Hero Banner */}
            <HeroBanner movies={nowPlayRes.results} />

            {/* Upcoming */}
            <Suspense fallback={<CarouselLoading />}>
                <MovieCarousel
                    title="Upcoming"
                    items={upcomingRes.results}
                    genres={genresRes}
                    viewAllHref="/movies/upcoming"
                />
            </Suspense>

            {/* Popular */}
            <Suspense fallback={<CarouselLoading />}>
                <MovieCarousel
                    title="Popular"
                    items={popularRes.results}
                    genres={genresRes}
                    viewAllHref="/movies/popular"
                />
            </Suspense>

            {/* Top Rated */}
            <Suspense fallback={<CarouselLoading />}>
                <MovieCarousel
                    title="Top Rated"
                    items={topRatedRes.results}
                    genres={genresRes}
                    viewAllHref="/movies/top-rated"
                />
            </Suspense>

            {/* Web Series / TV */}
            <Suspense fallback={<CarouselLoading />}>
                <MovieCarousel
                    title="Web Series"
                    items={trendingTVRes.results}
                    genres={genresRes}
                    viewAllHref="/tv-shows"
                />
            </Suspense>
        </div>
    );
}
