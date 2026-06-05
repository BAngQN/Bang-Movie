"use client";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationProps) {
    const capped = Math.min(totalPages, 500);
    if (capped <= 1) return null;

    const pages: (number | "…")[] = [];
    if (capped <= 7) {
        for (let i = 1; i <= capped; i++) pages.push(i);
    } else {
        pages.push(1);
        if (currentPage > 3) pages.push("…");
        for (
            let i = Math.max(2, currentPage - 1);
            i <= Math.min(capped - 1, currentPage + 1);
            i++
        )
            pages.push(i);
        if (currentPage < capped - 2) pages.push("…");
        pages.push(capped);
    }

    return (
        <div className="mt-8 flex items-center justify-center gap-1">
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="rounded px-3 py-1.5 text-sm text-gray-400 hover:text-white disabled:opacity-30"
            >
                ← Prev
            </button>
            {pages.map((p, i) =>
                p === "…" ? (
                    <span key={`ellipsis-${i}`} className="px-2 text-gray-500">
                        …
                    </span>
                ) : (
                    <button
                        key={p}
                        onClick={() => onPageChange(p as number)}
                        className={`min-w-[36px] rounded px-2 py-1.5 text-sm transition ${
                            p === currentPage
                                ? "bg-blue-600 text-white"
                                : "text-gray-400 hover:bg-gray-700 hover:text-white"
                        }`}
                    >
                        {p}
                    </button>
                ),
            )}
            <button
                disabled={currentPage === capped}
                onClick={() => onPageChange(currentPage + 1)}
                className="rounded px-3 py-1.5 text-sm text-gray-400 hover:text-white disabled:opacity-30"
            >
                Next →
            </button>
        </div>
    );
}
