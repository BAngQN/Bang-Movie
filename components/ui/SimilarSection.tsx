import { MovieCard } from "@/components/ui/MovieCard";
import type { Movie, TVShow } from "@/types";

interface Props {
    similar: (Movie | TVShow)[];
}

export function SimilarSection({ similar }: Props) {
    if (similar.length === 0) return null;

    return (
        <section>
            <h2 className="mb-4 text-xl font-bold text-white">
                More Like This
            </h2>
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
                {similar.map((item) => (
                    <MovieCard key={item.id} item={item} />
                ))}
            </div>
        </section>
    );
}
