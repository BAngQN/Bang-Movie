"use client";

import Link from "next/link";

interface Props {
    page: number;
    totalPages: number;
    // URL-based navigation (server components): pass basePath + optional filter params
    basePath?: string;
    genreId?: number;
    genreName?: string;
    // Callback-based navigation (client components)
    onPage?: (p: number) => void;
}

export function Pagination({
    page,
    totalPages,
    basePath,
    genreId,
    genreName,
    onPage,
}: Props) {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
        return Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
    });

    const getHref = (p: number) => {
        const params = new URLSearchParams();
        params.set("page", String(p));
        if (genreId) params.set("genreId", String(genreId));
        if (genreName) params.set("genre", encodeURIComponent(genreName));
        return `${basePath}?${params}`;
    };

    if (basePath) {
        return (
            <div className="mt-10 flex items-center justify-center gap-2">
                {page > 1 ? (
                    <Link
                        href={getHref(page - 1)}
                        className="rounded px-3 py-1.5 text-sm font-medium text-gray-300 border border-gray-600 hover:border-white hover:text-white transition-colors"
                    >
                        ← Prev
                    </Link>
                ) : (
                    <span className="rounded px-3 py-1.5 text-sm font-medium text-gray-300 border border-gray-600 opacity-40 cursor-not-allowed">
                        ← Prev
                    </span>
                )}
                {pages.map((p) => (
                    <Link
                        key={p}
                        href={getHref(p)}
                        className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                            p === page
                                ? "bg-blue-600 text-white"
                                : "text-gray-300 border border-gray-600 hover:border-white hover:text-white"
                        }`}
                    >
                        {p}
                    </Link>
                ))}
                {page < totalPages ? (
                    <Link
                        href={getHref(page + 1)}
                        className="rounded px-3 py-1.5 text-sm font-medium text-gray-300 border border-gray-600 hover:border-white hover:text-white transition-colors"
                    >
                        Next →
                    </Link>
                ) : (
                    <span className="rounded px-3 py-1.5 text-sm font-medium text-gray-300 border border-gray-600 opacity-40 cursor-not-allowed">
                        Next →
                    </span>
                )}
            </div>
        );
    }

    return (
        <div className="mt-10 flex items-center justify-center gap-2">
            <button
                onClick={() => onPage?.(Math.max(1, page - 1))}
                disabled={page === 1}
                className="rounded px-3 py-1.5 text-sm font-medium text-gray-300 border border-gray-600 hover:border-white hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
                ← Prev
            </button>
            {pages.map((p) => (
                <button
                    key={p}
                    onClick={() => onPage?.(p)}
                    className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                        p === page
                            ? "bg-blue-600 text-white"
                            : "text-gray-300 border border-gray-600 hover:border-white hover:text-white"
                    }`}
                >
                    {p}
                </button>
            ))}
            <button
                onClick={() => onPage?.(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="rounded px-3 py-1.5 text-sm font-medium text-gray-300 border border-gray-600 hover:border-white hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
                Next →
            </button>
        </div>
    );
}
