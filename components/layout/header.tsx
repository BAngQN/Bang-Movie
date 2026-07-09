"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useGetMovieGenresQuery, useGetTVGenresQuery } from "@/store/api";
import { useAppSelector } from "@/store/hooks";

export function Header() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [openDropdown, setOpenDropdown] = useState<"movies" | "tv" | null>(
        null,
    );
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const { data: movieGenres = [] } = useGetMovieGenresQuery();
    const { data: tvGenres = [] } = useGetTVGenresQuery();
    const { user, loading } = useAppSelector((s) => s.auth);

    const openMenu = (menu: "movies" | "tv") => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        setOpenDropdown(menu);
    };

    const closeMenu = () => {
        closeTimer.current = setTimeout(() => setOpenDropdown(null), 150);
    };

    const keepOpen = () => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
    };

    const handleSearch = () => {
        const q = searchQuery.trim();
        if (!q) return;
        router.push(`/search?q=${encodeURIComponent(q)}&type=movie&page=1`);
        setSearchQuery("");
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#1a1a2e]/95 backdrop-blur-sm">
            <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600">
                        <svg
                            className="h-5 w-5 text-white"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                        </svg>
                    </div>
                </Link>

                {/* Navigation */}
                <nav className="hidden lg:flex items-center gap-6">
                    {/* Movies dropdown */}
                    <div
                        className="relative"
                        onMouseEnter={() => openMenu("movies")}
                        onMouseLeave={closeMenu}
                    >
                        <Link
                            href="/movies"
                            className="flex items-center gap-1 text-sm font-medium text-gray-300 transition-colors hover:text-white"
                        >
                            Movies
                            <svg
                                className="h-3 w-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </Link>
                        {openDropdown === "movies" && (
                            <div
                                className="absolute left-0 top-full pt-2 z-50"
                                onMouseEnter={keepOpen}
                                onMouseLeave={closeMenu}
                            >
                                <div className="w-48 rounded-lg bg-[#1a1a2e] border border-gray-700 shadow-xl py-2">
                                    {movieGenres.slice(0, 6).map((genre) => (
                                        <Link
                                            key={genre.id}
                                            href={`/movies?genreId=${genre.id}&genre=${encodeURIComponent(genre.name)}`}
                                            onClick={() =>
                                                setOpenDropdown(null)
                                            }
                                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                                        >
                                            {genre.name}
                                        </Link>
                                    ))}
                                    <div className="my-1 border-t border-gray-700" />
                                    <Link
                                        href="/movies"
                                        onClick={() => setOpenDropdown(null)}
                                        className="block px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors"
                                    >
                                        View all genres →
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* TV Show dropdown */}
                    <div
                        className="relative"
                        onMouseEnter={() => openMenu("tv")}
                        onMouseLeave={closeMenu}
                    >
                        <Link
                            href="/tv-shows"
                            className="flex items-center gap-1 text-sm font-medium text-gray-300 transition-colors hover:text-white"
                        >
                            Tv Show
                            <svg
                                className="h-3 w-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </Link>
                        {openDropdown === "tv" && (
                            <div
                                className="absolute left-0 top-full pt-2 z-50"
                                onMouseEnter={keepOpen}
                                onMouseLeave={closeMenu}
                            >
                                <div className="w-48 rounded-lg bg-[#1a1a2e] border border-gray-700 shadow-xl py-2">
                                    {tvGenres.slice(0, 6).map((genre) => (
                                        <Link
                                            key={genre.id}
                                            href={`/tv-shows?genreId=${genre.id}&genre=${encodeURIComponent(genre.name)}`}
                                            onClick={() =>
                                                setOpenDropdown(null)
                                            }
                                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                                        >
                                            {genre.name}
                                        </Link>
                                    ))}
                                    <div className="my-1 border-t border-gray-700" />
                                    <Link
                                        href="/tv-shows"
                                        onClick={() => setOpenDropdown(null)}
                                        className="block px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors"
                                    >
                                        View all genres →
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Favorite */}
                    <Link
                        href="/favorites"
                        className="flex items-center gap-1 text-sm font-medium text-gray-300 transition-colors hover:text-red-400"
                    >
                        <svg
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                        </svg>
                        Favorite
                    </Link>
                </nav>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Search */}
                <div className="hidden sm:flex items-center">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === "Enter" && handleSearch()
                            }
                            className="w-48 rounded-sm border border-gray-600 bg-transparent px-3 py-1.5 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                        />
                        <button
                            onClick={handleSearch}
                            aria-label="Search"
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        >
                            <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    {loading ? (
                        <div className="h-7 w-7 animate-pulse rounded-full bg-gray-700" />
                    ) : user?.displayName ? (
                        <div className="relative">
                            <button
                                onClick={() => setUserMenuOpen((v) => !v)}
                                className="flex items-center gap-2 rounded-full border border-gray-600 px-2 py-1 text-sm text-white hover:border-gray-400 transition-colors"
                            >
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold uppercase">
                                    {user.displayName?.[0] ??
                                        user.email?.[0] ??
                                        "U"}
                                </div>
                                <span className="hidden max-w-[100px] truncate text-xs sm:block">
                                    {user.displayName ?? user.email}
                                </span>
                            </button>
                            {userMenuOpen && (
                                <div className="absolute right-0 top-full mt-2 w-44 rounded-lg border border-gray-700 bg-[#1a1a2e] py-1 shadow-xl z-50">
                                    <div className="border-b border-gray-700 px-4 py-2">
                                        <p className="truncate text-xs text-gray-400">
                                            {user.email}
                                        </p>
                                    </div>
                                    <button
                                        onClick={async () => {
                                            await signOut(auth);
                                            setUserMenuOpen(false);
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-800 transition-colors"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link
                                href="/auth/login"
                                className="rounded border border-gray-500 px-3 py-1 text-xs font-medium text-white transition-colors hover:border-white"
                            >
                                LOG IN
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
