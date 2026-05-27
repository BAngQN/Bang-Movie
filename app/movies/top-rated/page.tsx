"use client";

import { useState } from "react";
import { useGetTopRatedFullQuery } from "@/store/api";
import { MovieListPage } from "@/components/ui/MovieListPage";

export default function TopRatedPage() {
    const [page, setPage] = useState(1);
    const { data, isFetching } = useGetTopRatedFullQuery(page);
    return (
        <MovieListPage
            title="Top Rated Movies"
            movies={data?.results ?? []}
            totalResults={data?.total_results ?? 0}
            totalPages={Math.min(data?.total_pages ?? 1, 20)}
            page={page}
            setPage={setPage}
            isFetching={isFetching}
        />
    );
}
