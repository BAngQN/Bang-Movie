import { notFound } from "next/navigation";
import {
    getMovieCredits,
    getMovieDetails,
    getMovieVideos,
    getSimilarMovies,
} from "@/lib/tmdb";
import MovieDetailClient from "./_MovieDetailClient";

async function fetchMovieData(id: number) {
    const [movie, videosRes, credits, similarRes] = await Promise.all([
        getMovieDetails(id),
        getMovieVideos(id),
        getMovieCredits(id),
        getSimilarMovies(id),
    ]);

    const trailers = videosRes.filter(
        (v) => v.type === "Trailer" && v.site === "YouTube",
    );
    const similar = similarRes.slice(0, 12);

    return { movie, trailers, credits, similar };
}

export default async function MovieDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const movieId = Number(id);

    const { movie, trailers, credits, similar } = await fetchMovieData(movieId);

    if (!movie?.id) notFound();

    return (
        <MovieDetailClient
            movie={movie}
            trailers={trailers}
            credits={credits}
            similar={similar}
        />
    );
}
