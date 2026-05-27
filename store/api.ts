import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
    Movie,
    TVShow,
    Genre,
    TMDBResponse,
    MovieDetail,
    TVDetail,
    Video,
    Credits,
    Collection,
} from "@/types";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY!;

export const tmdbApiSlice = createApi({
    reducerPath: "tmdbApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://api.themoviedb.org/3",
        prepareHeaders: (headers) => {
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getTrending: builder.query<Movie[], "day" | "week">({
            query: (timeWindow = "week") =>
                `/trending/movie/${timeWindow}?api_key=${API_KEY}`,
            transformResponse: (response: TMDBResponse<Movie>) =>
                response.results,
        }),

        getNowPlaying: builder.query<Movie[], number | void>({
            query: (page = 1) =>
                `/movie/now_playing?api_key=${API_KEY}&page=${page}`,
            transformResponse: (response: TMDBResponse<Movie>) =>
                response.results,
        }),

        getPopular: builder.query<Movie[], number | void>({
            query: (page = 1) =>
                `/movie/popular?api_key=${API_KEY}&page=${page}`,
            transformResponse: (response: TMDBResponse<Movie>) =>
                response.results,
        }),

        getTopRated: builder.query<Movie[], number | void>({
            query: (page = 1) =>
                `/movie/top_rated?api_key=${API_KEY}&page=${page}`,
            transformResponse: (response: TMDBResponse<Movie>) =>
                response.results,
        }),

        getUpcoming: builder.query<Movie[], number | void>({
            query: (page = 1) =>
                `/movie/upcoming?api_key=${API_KEY}&page=${page}`,
            transformResponse: (response: TMDBResponse<Movie>) =>
                response.results,
        }),

        getUpcomingFull: builder.query<TMDBResponse<Movie>, number | void>({
            query: (page = 1) =>
                `/movie/upcoming?api_key=${API_KEY}&page=${page}`,
        }),

        getPopularFull: builder.query<TMDBResponse<Movie>, number | void>({
            query: (page = 1) =>
                `/movie/popular?api_key=${API_KEY}&page=${page}`,
        }),

        getTopRatedFull: builder.query<TMDBResponse<Movie>, number | void>({
            query: (page = 1) =>
                `/movie/top_rated?api_key=${API_KEY}&page=${page}`,
        }),

        getTrendingTV: builder.query<TVShow[], "day" | "week">({
            query: (timeWindow = "week") =>
                `/trending/tv/${timeWindow}?api_key=${API_KEY}`,
            transformResponse: (response: TMDBResponse<TVShow>) =>
                response.results,
        }),

        getPopularTV: builder.query<TVShow[], number | void>({
            query: (page = 1) => `/tv/popular?api_key=${API_KEY}&page=${page}`,
            transformResponse: (response: TMDBResponse<TVShow>) =>
                response.results,
        }),

        getMovieGenres: builder.query<Genre[], void>({
            query: () => `/genre/movie/list?api_key=${API_KEY}`,
            transformResponse: (response: { genres: Genre[] }) =>
                response.genres,
        }),

        getTVGenres: builder.query<Genre[], void>({
            query: () => `/genre/tv/list?api_key=${API_KEY}`,
            transformResponse: (response: { genres: Genre[] }) =>
                response.genres,
        }),

        discoverMovies: builder.query<
            { results: Movie[]; total_pages: number; total_results: number },
            { genreId?: number; page?: number; sortBy?: string }
        >({
            query: ({ genreId, page = 1, sortBy = "popularity.desc" }) => {
                const params = new URLSearchParams({
                    api_key: API_KEY,
                    page: String(page),
                    sort_by: sortBy,
                });
                if (genreId) params.set("with_genres", String(genreId));
                return `/discover/movie?${params}`;
            },
        }),

        discoverTV: builder.query<
            { results: TVShow[]; total_pages: number; total_results: number },
            { genreId?: number; page?: number; sortBy?: string }
        >({
            query: ({ genreId, page = 1, sortBy = "popularity.desc" }) => {
                const params = new URLSearchParams({
                    api_key: API_KEY,
                    page: String(page),
                    sort_by: sortBy,
                });
                if (genreId) params.set("with_genres", String(genreId));
                return `/discover/tv?${params}`;
            },
        }),

        searchMovies: builder.query<Movie[], { query: string; page?: number }>({
            query: ({ query, page = 1 }) =>
                `/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`,
            transformResponse: (response: TMDBResponse<Movie>) =>
                response.results,
        }),

        searchMoviesFull: builder.query<
            TMDBResponse<Movie>,
            { query: string; page?: number }
        >({
            query: ({ query, page = 1 }) =>
                `/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`,
        }),

        searchTVShows: builder.query<
            TMDBResponse<TVShow>,
            { query: string; page?: number }
        >({
            query: ({ query, page = 1 }) =>
                `/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`,
        }),

        searchCollections: builder.query<
            TMDBResponse<Collection>,
            { query: string; page?: number }
        >({
            query: ({ query, page = 1 }) =>
                `/search/collection?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`,
        }),

        // ─── Detail ────────────────────────────────────────────────────────────

        getMovieDetail: builder.query<MovieDetail, number>({
            query: (id) => `/movie/${id}?api_key=${API_KEY}`,
        }),

        getMovieVideos: builder.query<Video[], number>({
            query: (id) => `/movie/${id}/videos?api_key=${API_KEY}`,
            transformResponse: (response: { results: Video[] }) =>
                response.results.filter(
                    (v) => v.type === "Trailer" && v.site === "YouTube",
                ),
        }),

        getMovieCredits: builder.query<Credits, number>({
            query: (id) => `/movie/${id}/credits?api_key=${API_KEY}`,
        }),

        getSimilarMovies: builder.query<Movie[], number>({
            query: (id) => `/movie/${id}/similar?api_key=${API_KEY}`,
            transformResponse: (response: TMDBResponse<Movie>) =>
                response.results.slice(0, 12),
        }),

        getTVDetail: builder.query<TVDetail, number>({
            query: (id) => `/tv/${id}?api_key=${API_KEY}`,
        }),

        getTVVideos: builder.query<Video[], number>({
            query: (id) => `/tv/${id}/videos?api_key=${API_KEY}`,
            transformResponse: (response: { results: Video[] }) =>
                response.results.filter(
                    (v) => v.type === "Trailer" && v.site === "YouTube",
                ),
        }),

        getTVCredits: builder.query<Credits, number>({
            query: (id) => `/tv/${id}/credits?api_key=${API_KEY}`,
        }),

        getSimilarTV: builder.query<TVShow[], number>({
            query: (id) => `/tv/${id}/similar?api_key=${API_KEY}`,
            transformResponse: (response: TMDBResponse<TVShow>) =>
                response.results.slice(0, 12),
        }),
    }),
});

export const {
    useGetTrendingQuery,
    useGetNowPlayingQuery,
    useGetPopularQuery,
    useGetTopRatedQuery,
    useGetUpcomingQuery,
    useGetTrendingTVQuery,
    useGetPopularTVQuery,
    useGetMovieGenresQuery,
    useGetTVGenresQuery,
    useDiscoverMoviesQuery,
    useDiscoverTVQuery,
    useSearchMoviesQuery,
    useGetMovieDetailQuery,
    useGetMovieVideosQuery,
    useGetMovieCreditsQuery,
    useGetSimilarMoviesQuery,
    useGetTVDetailQuery,
    useGetTVVideosQuery,
    useGetTVCreditsQuery,
    useGetSimilarTVQuery,
    useSearchMoviesFullQuery,
    useSearchTVShowsQuery,
    useSearchCollectionsQuery,
    useGetUpcomingFullQuery,
    useGetPopularFullQuery,
    useGetTopRatedFullQuery,
} = tmdbApiSlice;
