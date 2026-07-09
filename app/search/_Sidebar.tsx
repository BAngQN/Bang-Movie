"use client";

import { SearchType } from "./_SearchContent";

interface SidebarProps {
    type: string;
    categories: { key: SearchType; label: string; count: number }[];
    navigate: (type: SearchType) => void;
}

export default function Sidebar({ type, categories, navigate }: SidebarProps) {
    return (
        <>
            <aside className="hidden w-56 shrink-0 lg:block">
                <div className="rounded-lg border border-gray-800 bg-[#1a1a2e] overflow-hidden">
                    <div className="border-b border-gray-800 bg-blue-600 px-4 py-3">
                        <span className="font-semibold text-white text-sm">
                            Search Results
                        </span>
                    </div>
                    {categories.map(({ key, label, count }) => (
                        <button
                            key={key}
                            onClick={() => navigate(key)}
                            className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition hover:bg-gray-800 ${
                                type === key
                                    ? "font-semibold text-white bg-gray-800/60"
                                    : "text-gray-400"
                            }`}
                        >
                            <span>{label}</span>
                            <span
                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                    type === key
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-700 text-gray-300"
                                }`}
                            >
                                {count.toLocaleString()}
                            </span>
                        </button>
                    ))}
                </div>
            </aside>

            {/* Mobile category tabs */}
            <div className="flex w-full flex-col gap-4 lg:hidden">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                    {categories.map(({ key, label, count }) => (
                        <button
                            key={key}
                            onClick={() => navigate(key)}
                            className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition ${
                                type === key
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                            }`}
                        >
                            {label}
                            <span className="rounded-full bg-black/30 px-1.5 py-0.5 text-xs">
                                {count.toLocaleString()}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
}
