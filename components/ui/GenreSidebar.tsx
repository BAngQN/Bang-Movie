"use client";

import Link from "next/link";
import type { Genre } from "@/types";

interface Props {
    genres: Genre[];
    selectedId: number | undefined;
    allLabel: string;
    // URL-based navigation (server components)
    basePath?: string;
    // Callback-based navigation (client components)
    onSelect?: (id: number, name: string) => void;
    onClear?: () => void;
}

const itemClass = (active: boolean) =>
    `w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-colors border-b border-gray-800 last:border-0 ${
        active
            ? "bg-blue-600/20 text-blue-400 font-medium"
            : "text-gray-300 hover:bg-gray-800 hover:text-white"
    }`;

export function GenreSidebar({
    genres,
    selectedId,
    allLabel,
    basePath,
    onSelect,
    onClear,
}: Props) {
    return (
        <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="rounded-lg border border-gray-700 overflow-hidden">
                <div className="bg-blue-600 px-4 py-3">
                    <h3 className="font-semibold text-white text-sm">Genres</h3>
                </div>
                <ul>
                    <li>
                        {basePath ? (
                            <Link
                                href={basePath}
                                className={itemClass(!selectedId)}
                            >
                                {allLabel}
                                {!selectedId && (
                                    <span className="text-blue-400">›</span>
                                )}
                            </Link>
                        ) : (
                            <button
                                onClick={onClear}
                                className={itemClass(!selectedId)}
                            >
                                {allLabel}
                                {!selectedId && (
                                    <span className="text-blue-400">›</span>
                                )}
                            </button>
                        )}
                    </li>
                    {genres.map((g) => (
                        <li key={g.id}>
                            {basePath ? (
                                <Link
                                    href={`${basePath}?genreId=${g.id}&genre=${encodeURIComponent(g.name)}`}
                                    className={itemClass(selectedId === g.id)}
                                >
                                    {g.name}
                                    {selectedId === g.id && (
                                        <span className="text-blue-400">›</span>
                                    )}
                                </Link>
                            ) : (
                                <button
                                    onClick={() => onSelect?.(g.id, g.name)}
                                    className={itemClass(selectedId === g.id)}
                                >
                                    {g.name}
                                    {selectedId === g.id && (
                                        <span className="text-blue-400">›</span>
                                    )}
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
}
