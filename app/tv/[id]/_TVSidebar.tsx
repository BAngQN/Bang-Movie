import { Fact } from "@/components/ui/Fact";
import type { TVDetail } from "@/types";

interface Props {
    show: TVDetail;
}

export function TVSidebar({ show }: Props) {
    return (
        <aside className="hidden w-56 flex-shrink-0 space-y-4 lg:block">
            <Fact label="Status" value={show.status} />
            <Fact label="Network" value={show.networks?.[0]?.name ?? "—"} />
            <Fact label="Type" value="TV Series" />
            <Fact
                label="Original Language"
                value={show.original_language.toUpperCase()}
            />
            <Fact label="Seasons" value={String(show.number_of_seasons)} />
            <Fact label="Episodes" value={String(show.number_of_episodes)} />
            {show.homepage && (
                <div>
                    <p className="font-semibold text-white">Homepage</p>
                    <a
                        href={show.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-all text-sm text-blue-400 hover:underline"
                    >
                        Visit site
                    </a>
                </div>
            )}
        </aside>
    );
}
