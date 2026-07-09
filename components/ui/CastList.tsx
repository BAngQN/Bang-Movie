import Image from "next/image";
import { getImageUrl } from "@/types/common";
import type { CastMember } from "@/types";

interface Props {
    cast: CastMember[];
}

/** Renders the cast cards. Wrap with ScrollView (movie) or a plain div (TV). */
export function CastList({ cast }: Props) {
    return (
        <>
            {cast.map((member) => (
                <div
                    key={member.id}
                    className="w-[120px] flex-shrink-0 overflow-hidden rounded-lg bg-[#1a1a2e] shadow"
                >
                    <div className="relative h-[135px] w-full bg-gray-800">
                        <Image
                            src={getImageUrl(member.profile_path, "w200")}
                            alt={member.name}
                            fill
                            className="object-cover object-top"
                            sizes="120px"
                        />
                    </div>
                    <div className="p-2">
                        <p className="text-xs font-semibold leading-tight text-white">
                            {member.name}
                        </p>
                        <p className="mt-0.5 line-clamp-2 text-[10px] leading-tight text-gray-400">
                            {member.character}
                        </p>
                    </div>
                </div>
            ))}
        </>
    );
}
