import { Fact } from "@/components/ui/Fact";
import type { MovieDetail } from "@/types";

interface Props {
    movie: MovieDetail;
}

export function MovieSidebar({ movie }: Props) {
    return (
        <aside className="hidden w-56 flex-shrink-0 space-y-4 lg:block">
            <Fact label="Status" value={movie.status} />
            <Fact
                label="Original Language"
                value={movie.original_language.toUpperCase()}
            />
            <Fact
                label="Budget"
                value={movie.budget ? `$${movie.budget.toLocaleString()}` : "—"}
            />
            <Fact
                label="Revenue"
                value={
                    movie.revenue ? `$${movie.revenue.toLocaleString()}` : "—"
                }
            />
            {movie.homepage && (
                <div>
                    <p className="font-semibold text-white">Homepage</p>
                    <a
                        href={movie.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-all text-sm text-blue-400 hover:underline"
                    >
                        Visit site
                    </a>
                </div>
            )}
        </aside>
    );
}
