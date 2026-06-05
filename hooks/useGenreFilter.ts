"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export function useGenreFilter(basePath: string) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const genreId = searchParams.get("genreId")
        ? Number(searchParams.get("genreId"))
        : undefined;
    const genreName = searchParams.get("genre") ?? undefined;

    const [page, setPage] = useState(1);

    const selectGenre = (id: number, name: string) => {
        setPage(1);
        router.push(
            `${basePath}?genreId=${id}&genre=${encodeURIComponent(name)}`,
        );
    };

    const clearGenre = () => {
        setPage(1);
        router.push(basePath);
    };

    return { genreId, genreName, page, setPage, selectGenre, clearGenre };
}
