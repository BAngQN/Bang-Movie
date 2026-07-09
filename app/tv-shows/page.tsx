import { getDiscoverTV, getTVGenres } from "@/lib/tmdb";
import { getImageUrl } from "@/types/common";
import type { TVShow } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { GenreSidebar } from "@/components/ui/GenreSidebar";
import { StarRating } from "@/components/ui/StarRating";
import { Pagination } from "@/components/ui/Pagination";

type TVShowsPageProps = {
    searchParams?: Promise<{
        genreId?: string;
        genre?: string;
        page?: string;
    }>;
};

export default async function TVShowsPage({ searchParams }: TVShowsPageProps) {
    const params = await searchParams;
    const genreId = params?.genreId ? Number(params.genreId) : undefined;
    const genreName = params?.genre
        ? decodeURIComponent(params.genre)
        : undefined;
    const page = Number(params?.page) || 1;

    const [data, genres] = await Promise.all([
        getDiscoverTV(genreId, page),
        getTVGenres(),
    ]);

    const shows = data.results as TVShow[];
    const totalPages = Math.min(data.total_pages, 500);

    return (
        <div className="mx-auto max-w-7xl px-4 py-8">
            <div className="flex gap-8">
                <GenreSidebar
                    genres={genres}
                    selectedId={genreId}
                    allLabel="All TV Shows"
                    basePath="/tv-shows"
                />

                <main className="flex-1 min-w-0">
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-white">
                            {genreName ?? "All TV Shows"}
                        </h1>
                        <span className="text-sm text-gray-400">
                            {data.total_results.toLocaleString()} results
                        </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                        {shows.map((show) => (
                            <Link
                                key={show.id}
                                href={`/tv/${show.id}`}
                                className="group/card"
                            >
                                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-gray-800">
                                    <Image
                                        src={getImageUrl(
                                            show.poster_path,
                                            "w300",
                                        )}
                                        alt={show.name}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover/card:scale-105"
                                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                                    />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity group-hover/card:opacity-100 flex items-center justify-center">
                                        <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
                                            View details
                                        </span>
                                    </div>
                                    <div className="absolute top-2 right-2 rounded bg-black/70 px-1.5 py-0.5">
                                        <StarRating score={show.vote_average} />
                                    </div>
                                </div>
                                <div className="mt-2 space-y-0.5">
                                    <p className="text-xs text-gray-400">
                                        {show.first_air_date
                                            ? new Date(
                                                  show.first_air_date,
                                              ).getFullYear()
                                            : ""}
                                    </p>
                                    <h3 className="text-sm font-semibold text-white leading-tight line-clamp-2 group-hover/card:text-blue-400 transition-colors">
                                        {show.name}
                                    </h3>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        basePath="/tv-shows"
                        genreId={genreId}
                        genreName={genreName}
                    />
                </main>
            </div>
        </div>
    );
}
