"use client";

import { useState } from "react";
import { useGetUpcomingFullQuery } from "@/store/api";
import { MovieListPage } from "@/components/ui/MovieListPage";

export default function UpcomingPage() {
    const [page, setPage] = useState(1);
    const { data, isFetching } = useGetUpcomingFullQuery(page);
    return (
        <MovieListPage
            title="Upcoming Movies"
            movies={data?.results ?? []}
            totalResults={data?.total_results ?? 0}
            totalPages={Math.min(data?.total_pages ?? 1, 500)}
            page={page}
            setPage={setPage}
            isFetching={isFetching}
        />
    );
}
