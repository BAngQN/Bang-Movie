import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t border-gray-800 bg-[#0f0f1a] py-8">
            <div className="mx-auto max-w-7xl px-4 text-center">
                <p className="text-sm">
                    Hello my name is Bang, Enjoy exploring movies and TV shows
                    on Bang Movie!
                </p>
                <p className="text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} Bang Movie. All rights
                    reserved. Data provided by{" "}
                    <Link
                        href="https://www.themoviedb.org/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                    >
                        TMDB
                    </Link>
                </p>
            </div>
        </footer>
    );
}
