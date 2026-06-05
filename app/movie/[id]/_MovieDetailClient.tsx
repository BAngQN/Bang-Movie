import type { MovieDetail, Video, Credits, Movie } from "@/types";
import { DetailBackdrop } from "@/components/ui/DetailBackdrop";
import { CastSection } from "./_CastSection";
import { TrailerSection } from "@/components/ui/TrailerSection";
import { SimilarSection } from "@/components/ui/SimilarSection";
import { MovieSidebar } from "./_MovieSidebar";

interface Props {
    movie: MovieDetail;
    trailers: Video[];
    credits: Credits;
    similar: Movie[];
}

export default function MovieDetailClient({
    movie,
    trailers,
    credits,
    similar,
}: Props) {
    const year = movie.release_date
        ? new Date(movie.release_date).getFullYear()
        : "";
    const runtime = movie.runtime
        ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
        : null;
    const director = credits?.crew.find((c) => c.job === "Director");

    return (
        <>
            <DetailBackdrop
                id={movie.id}
                title={movie.title}
                backdropPath={movie.backdrop_path}
                posterPath={movie.poster_path}
                date={movie.release_date}
                genres={movie.genres}
                voteAverage={movie.vote_average}
                tagline={movie.tagline}
                overview={movie.overview}
                trailers={trailers}
                runtime={runtime}
                creditPerson={
                    director
                        ? { name: director.name, role: "Director" }
                        : undefined
                }
                genreType="movie"
                year={year}
            />

            <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8">
                <div className="min-w-0 flex-1 space-y-10">
                    <CastSection credits={credits} />
                    <TrailerSection trailers={trailers} />
                    <SimilarSection similar={similar} />
                </div>
                <MovieSidebar movie={movie} />
            </div>
        </>
    );
}
