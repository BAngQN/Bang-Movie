import Image from "next/image";
import Link from "next/link";
import type { Movie, TVShow } from "@/types";
import { getImageUrl } from "@/types/common";
import { FavoriteButton } from "./FavoriteButton";

interface MovieCardProps {
    item: Movie | TVShow;
    genres?: { id: number; name: string }[];
}

function getTitle(item: Movie | TVShow): string {
    return "title" in item ? item.title : item.name;
}

function getDate(item: Movie | TVShow): string {
    return "release_date" in item ? item.release_date : item.first_air_date;
}

export function MovieCard({ item, genres = [] }: MovieCardProps) {
    const title = getTitle(item);
    const date = getDate(item);
    const year = date ? new Date(date).getFullYear() : "";
    const genreNames = item.genre_ids
        .slice(0, 2)
        .map((id) => genres.find((g) => g.id === id)?.name)
        .filter(Boolean)
        .join(", ");
    const isTV = !("title" in item);
    const href = isTV ? `/tv/${item.id}` : `/movie/${item.id}`;
    const genreType = isTV ? "tv" : "movie";

    return (
        <Link href={href} className="group/card flex-shrink-0 w-[160px]">
            {/* Poster */}
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg">
                <Image
                    src={getImageUrl(item.poster_path, "w300")}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover/card:scale-105"
                    sizes="160px"
                />
                {/* Favorite button */}
                <div className="absolute top-2 right-2 opacity-0 group-hover/card:opacity-100 transition-opacity">
                    <FavoriteButton
                        item={{
                            id: item.id,
                            title,
                            poster_path: item.poster_path,
                            genre_type: genreType,
                        }}
                    />
                </div>
            </div>

            {/* Info */}
            <div className="mt-2 space-y-0.5">
                <p className="text-[10px] text-gray-400">
                    {item.original_language.toUpperCase()}, {year}
                </p>
                <h3 className="text-sm font-semibold text-white leading-tight line-clamp-2 group-hover/card:text-blue-400 transition-colors">
                    {title}
                </h3>
                {genreNames && (
                    <p className="text-[10px] text-gray-500">{genreNames}</p>
                )}
            </div>
        </Link>
    );
}
