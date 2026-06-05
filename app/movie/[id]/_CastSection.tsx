import { CastList } from "@/components/ui/CastList";
import { ScrollView } from "@/components/ui/ScrollView";
import type { Credits } from "@/types";

interface Props {
    credits: Credits;
}

export function CastSection({ credits }: Props) {
    const topCast = credits?.cast.slice(0, 8) ?? [];

    if (topCast.length === 0) return null;

    return (
        <section>
            <h2 className="mb-4 text-xl font-bold text-white">
                Top Billed Cast
            </h2>
            <ScrollView>
                <CastList cast={topCast} />
            </ScrollView>
        </section>
    );
}
