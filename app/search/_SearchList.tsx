import { Collection, Movie, TVShow } from "@/types";
import ResultCard from "./_ResultCard";

interface SearchListProps {
    type: "movie" | "tv" | "collection";
    movieData?: Movie[];
    tvData?: TVShow[];
    collectionData?: Collection[];
}

export default function SearchList({
    type,
    movieData,
    tvData,
    collectionData,
}: SearchListProps) {
    return (
        <div className="flex flex-col gap-3">
            {type === "movie" &&
                (movieData ?? []).map((item: Movie) => (
                    <ResultCard
                        key={item.id}
                        poster={item.poster_path}
                        title={item.title}
                        date={item.release_date}
                        overview={item.overview}
                        href={`/movie/${item.id}`}
                        rating={item.vote_average}
                    />
                ))}
            {type === "tv" &&
                (tvData ?? []).map((item: TVShow) => (
                    <ResultCard
                        key={item.id}
                        poster={item.poster_path}
                        title={item.name}
                        date={item.first_air_date}
                        overview={item.overview}
                        href={`/tv/${item.id}`}
                        rating={item.vote_average}
                    />
                ))}
            {type === "collection" &&
                (collectionData ?? []).map((item: Collection) => (
                    <ResultCard
                        key={item.id}
                        poster={item.poster_path}
                        title={item.name}
                        date=""
                        overview={item.overview}
                        href={`/collection/${item.id}`}
                    />
                ))}
        </div>
    );
}
