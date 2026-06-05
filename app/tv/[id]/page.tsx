import { notFound } from "next/navigation";
import {
    getTVDetail,
    getTVVideos,
    getTVCredits,
    getSimilarTV,
} from "@/lib/tmdb";
import TVDetailClient from "./_TVDetailClient";

export default async function TVDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const seriesId = Number(id);

    const [show, trailers, credits, similar] = await Promise.all([
        getTVDetail(seriesId),
        getTVVideos(seriesId),
        getTVCredits(seriesId),
        getSimilarTV(seriesId),
    ]);

    if (!show?.id) notFound();

    return (
        <TVDetailClient
            show={show}
            trailers={trailers}
            credits={credits}
            similar={similar}
        />
    );
}
