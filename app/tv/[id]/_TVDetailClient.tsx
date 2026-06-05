import type { TVDetail, Video, Credits, TVShow } from "@/types";
import { DetailBackdrop } from "@/components/ui/DetailBackdrop";
import { TVCastSeasons } from "./_TVCastSeasons";
import { TrailerSection } from "@/components/ui/TrailerSection";
import { SimilarSection } from "@/components/ui/SimilarSection";
import { TVSidebar } from "./_TVSidebar";

interface Props {
    show: TVDetail;
    trailers: Video[];
    credits: Credits;
    similar: TVShow[];
}

export default function TVDetailClient({
    show,
    trailers,
    credits,
    similar,
}: Props) {
    const year = show.first_air_date
        ? new Date(show.first_air_date).getFullYear()
        : "";
    const epRuntime = show.episode_run_time?.[0]
        ? `${show.episode_run_time[0]}m / ep`
        : null;
    const creator = show.created_by?.[0];
    const seasons = show.seasons?.filter((s) => s.season_number > 0) ?? [];

    return (
        <>
            <DetailBackdrop
                id={show.id}
                title={show.name}
                backdropPath={show.backdrop_path}
                posterPath={show.poster_path}
                date={show.first_air_date}
                genres={show.genres}
                voteAverage={show.vote_average}
                tagline={show.tagline}
                overview={show.overview}
                trailers={trailers}
                runtime={epRuntime}
                creditPerson={
                    creator
                        ? { name: creator.name, role: "Creator" }
                        : undefined
                }
                genreType="tv"
                year={year}
            />

            <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8">
                <div className="min-w-0 flex-1 space-y-10">
                    <TVCastSeasons credits={credits} seasons={seasons} />
                    <TrailerSection trailers={trailers} />
                    <SimilarSection similar={similar} />
                </div>
                <TVSidebar show={show} />
            </div>
        </>
    );
}
