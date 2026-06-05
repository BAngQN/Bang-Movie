interface SearchNotFoundProps {
    type: "movie" | "tv" | "collection";
    query: string;
}

export default function SearchNotFound({ type, query }: SearchNotFoundProps) {
    return (
        <div className="flex flex-col items-center gap-3 py-16 text-gray-500">
            <svg
                className="h-12 w-12 opacity-30"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
            <p>
                No{" "}
                {type === "movie"
                    ? "movies"
                    : type === "tv"
                      ? "TV shows"
                      : "collections"}{" "}
                found for &ldquo;{query}&rdquo;.
            </p>
        </div>
    );
}
