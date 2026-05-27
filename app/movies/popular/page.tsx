"use client";

import { useState } from "react";
import { useGetPopularFullQuery } from "@/store/api";
import { MovieListPage } from "@/components/ui/MovieListPage";

export default function PopularPage() {
    const [page, setPage] = useState(1);
    const { data, isFetching } = useGetPopularFullQuery(page);
    return (
        <MovieListPage
            title="Popular Movies"
            movies={data?.results ?? []}
            totalResults={data?.total_results ?? 0}
            totalPages={Math.min(data?.total_pages ?? 1, 20)}
            page={page}
            setPage={setPage}
            isFetching={isFetching}
        />
    );
}
