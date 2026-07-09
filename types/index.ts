export interface Movie {
    id: number;
    title: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date: string;
    vote_average: number;
    vote_count: number;
    genre_ids: number[];
    adult: boolean;
    original_language: string;
    popularity: number;
}

export interface TVShow {
    id: number;
    name: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    first_air_date: string;
    vote_average: number;
    vote_count: number;
    genre_ids: number[];
    original_language: string;
    popularity: number;
}

export interface Genre {
    id: number;
    name: string;
}

// Re-export common types
export type { TMDBResponse } from "./common";

// ─── Detail types ─────────────────────────────────────────────────────────────
export interface MovieDetail {
    id: number;
    title: string;
    tagline: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date: string;
    runtime: number | null;
    vote_average: number;
    vote_count: number;
    genres: Genre[];
    status: string;
    original_language: string;
    original_title: string;
    popularity: number;
    budget: number;
    revenue: number;
    homepage: string | null;
    imdb_id: string | null;
    production_companies: ProductionCompany[];
}

export interface TVDetail {
    id: number;
    name: string;
    tagline: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    first_air_date: string;
    last_air_date: string;
    vote_average: number;
    vote_count: number;
    genres: Genre[];
    status: string;
    original_language: string;
    original_name: string;
    popularity: number;
    number_of_seasons: number;
    number_of_episodes: number;
    episode_run_time: number[];
    homepage: string | null;
    networks: Network[];
    created_by: Creator[];
    seasons: Season[];
}

export interface ProductionCompany {
    id: number;
    name: string;
    logo_path: string | null;
}

export interface Network {
    id: number;
    name: string;
    logo_path: string | null;
}

export interface Creator {
    id: number;
    name: string;
    profile_path: string | null;
}

export interface Season {
    id: number;
    name: string;
    season_number: number;
    episode_count: number;
    poster_path: string | null;
    air_date: string | null;
    overview: string;
}

export interface Video {
    id: string;
    key: string;
    name: string;
    site: string;
    type: string;
    official: boolean;
    published_at: string;
}

export interface CastMember {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
    order: number;
}

export interface CrewMember {
    id: number;
    name: string;
    job: string;
    department: string;
    profile_path: string | null;
}

export interface Credits {
    cast: CastMember[];
    crew: CrewMember[];
}

export interface Collection {
    id: number;
    name: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
}

export interface FavoriteItem {
    id: number;
    title: string;
    poster_path: string | null;
    genre_type: "movie" | "tv";
    added_at: number; // timestamp
}

export interface MovieListResponse {
    page: number;
    results: Movie[];
    total_results: number;
    total_pages: number;
}

export interface TVListResponse {
    page: number;
    results: TVShow[];
    total_results: number;
    total_pages: number;
}
