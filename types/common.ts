/**
 * Generic TMDB API response wrapper
 */

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
export interface TMDBResponse<T> {
    page: number;
    results: T[];
    total_pages: number;
    total_results: number;
}

// Image URL helper
export function getImageUrl(
    path: string | null,
    size: "w200" | "w300" | "w500" | "w780" | "original" = "w500",
) {
    if (!path) return "/placeholder.svg";
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}
