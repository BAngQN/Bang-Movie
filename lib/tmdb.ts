import {
    Credits,
    Genre,
    Movie,
    MovieDetail,
    MovieListResponse,
    TVDetail,
    TVListResponse,
    TVShow,
    Video,
} from "@/types";
import dns from "dns";

const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_API_KEY;

export const TMDB_ENDPOINTS = {
    nowPlaying: "/movie/now_playing",
    upcoming: "/movie/upcoming",
    popular: "/movie/popular",
    topRated: "/movie/top_rated",
    trending: (timeWindow: "day" | "week" = "week") =>
        `/trending/movie/${timeWindow}`,
    genres: "/genre/movie/list",
};

async function tmdb<T>(path: string, init: RequestInit = {}): Promise<T> {
    /**
     * Force IPv4 first to avoid potential issues with IPv6 connectivity in some environments.
     */
    dns.setDefaultResultOrder("ipv4first");
    const sep = path.includes("?") ? "&" : "?";
    const url = `${BASE_URL}${path}${sep}api_key=${API_KEY}`;
    const response = await fetch(url, {
        next: { revalidate: 3600 },
        ...init,
    });
    if (!response.ok) {
        throw new Error(
            `TMDB API request failed: ${response.status} ${response.statusText}`,
        );
    }
    return response.json();
}

export async function getNowPlayingMovies(page: number = 1) {
    return tmdb<{ results: Movie[] }>(
        `${TMDB_ENDPOINTS.nowPlaying}?page=${page}`,
        {
            method: "GET",
        },
    );
}

export async function getUpcomingMovies(page: number = 1) {
    return tmdb<MovieListResponse>(`${TMDB_ENDPOINTS.upcoming}?page=${page}`, {
        method: "GET",
    });
}

export async function getPopularMovies(page: number = 1) {
    return tmdb<MovieListResponse>(`${TMDB_ENDPOINTS.popular}?page=${page}`, {
        method: "GET",
    });
}

export async function getTopRatedMovies(page: number = 1) {
    return tmdb<MovieListResponse>(`${TMDB_ENDPOINTS.topRated}?=page${page}`, {
        method: "GET",
    });
}

export async function getTrendingMovies(
    timeWindow: "day" | "week" = "week",
    page: number = 1,
) {
    return tmdb<MovieListResponse>(
        `${TMDB_ENDPOINTS.trending(timeWindow)}?page=${page}`,
        {
            method: "GET",
        },
    );
}

export async function getMovieGenres() {
    return tmdb<{ genres: { id: number; name: string }[] }>(
        TMDB_ENDPOINTS.genres,
        {
            method: "GET",
        },
    ).then((data) => data.genres);
}

// ─── Detail ────────────────────────────────────────────────────────────
export async function getMovieDetails(movieId: number) {
    return tmdb<MovieDetail>(`/movie/${movieId}`, {
        method: "GET",
    });
}

export async function getMovieVideos(movieId: number) {
    return tmdb<{ results: Video[] }>(`/movie/${movieId}/videos`, {
        method: "GET",
    }).then((data) => {
        console.log("Fetched videos:", data);
        return data.results.filter(
            (video) =>
                video.site === "YouTube" &&
                (video.type === "Trailer" || video.type === "Teaser"),
        );
    });
}

export async function getMovieCredits(movieId: number) {
    return tmdb<Credits>(`/movie/${movieId}/credits`, {
        method: "GET",
    });
}

export async function getSimilarMovies(movieId: number) {
    return tmdb<{ results: Movie[] }>(`/movie/${movieId}/similar`, {
        method: "GET",
    }).then((data) => data.results.slice(0, 12));
}

// ─── TV Shows ────────────────────────────────────────────────────────────

export async function getTVGenres() {
    return tmdb<{ genres: Genre[] }>("/genre/tv/list", {
        method: "GET",
    }).then((data) => data.genres);
}

export async function getDiscoverTV(
    genreId?: number,
    page: number | null = 1,
    sortBy: string | null = "popularity.desc",
) {
    const params = new URLSearchParams();
    if (page) params.set("page", String(page));
    if (sortBy) params.set("sort_by", sortBy);
    if (genreId) params.set("with_genres", String(genreId));
    return tmdb<TVListResponse>(`/discover/tv?${params}`, {
        method: "GET",
    });
}

export async function getTVDetail(seriesId: number) {
    return tmdb<TVDetail>(`/tv/${seriesId}`, { method: "GET" });
}

export async function getTVVideos(seriesId: number) {
    return tmdb<{ results: Video[] }>(`/tv/${seriesId}/videos`, {
        method: "GET",
    }).then((data) =>
        data.results.filter(
            (v) => v.type === "Trailer" && v.site === "YouTube",
        ),
    );
}

export async function getTVCredits(seriesId: number) {
    return tmdb<Credits>(`/tv/${seriesId}/credits`, { method: "GET" });
}

export async function getSimilarTV(seriesId: number) {
    return tmdb<{ results: TVShow[] }>(`/tv/${seriesId}/similar`, {
        method: "GET",
    }).then((data) => data.results.slice(0, 12));
}
