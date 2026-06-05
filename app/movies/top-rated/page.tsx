import { MovieListPage } from "@/components/ui/MovieListPage";
import { getTopRatedMovies } from "@/lib/tmdb";

type TopRatedPageProps = {
    searchParams?: Promise<{ page?: string | string[] }>;
};

export default async function TopRatedPage({
    searchParams,
}: TopRatedPageProps) {
    const params = (await searchParams) ?? {};
    const rawPage = Array.isArray(params.page) ? params.page[0] : params.page;
    const page = Math.max(1, Number(rawPage ?? "1") || 1);
    const data = await getTopRatedMovies(page);
    return (
        <MovieListPage
            title="Top Rated Movies"
            movies={data?.results ?? []}
            totalResults={data?.total_results ?? 0}
            totalPages={Math.min(data?.total_pages ?? 1, 20)}
            page={page}
            buildPageHref={(p) => `/movies/top-rated?page=${p}`}
        />
    );
}
