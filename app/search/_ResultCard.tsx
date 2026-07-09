import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/types/common";
import StarIcon from "./_StarIcon";

interface ResultCardProps {
    poster: string | null;
    title: string;
    date: string;
    overview: string;
    href: string;
    rating?: number;
}

export default function ResultCard({
    poster,
    title,
    date,
    overview,
    href,
    rating,
}: ResultCardProps) {
    const year = date ? new Date(date).getFullYear() : null;
    return (
        <Link
            href={href}
            className="group flex gap-4 rounded-lg border border-gray-800 bg-[#1a1a2e] p-3 transition hover:border-gray-600 hover:bg-[#1f1f35]"
        >
            <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded">
                <Image
                    src={getImageUrl(poster, "w200")}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="64px"
                />
            </div>
            <div className="flex min-w-0 flex-col gap-1 py-1">
                <h3 className="truncate font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    {year && <span>{year}</span>}
                    {rating !== undefined && rating > 0 && (
                        <span className="flex items-center gap-1">
                            <StarIcon />
                            {rating.toFixed(1)}
                        </span>
                    )}
                </div>
                {overview && (
                    <p className="line-clamp-2 text-xs text-gray-400 leading-relaxed">
                        {overview}
                    </p>
                )}
            </div>
        </Link>
    );
}
