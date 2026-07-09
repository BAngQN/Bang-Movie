export function StarRating({ score }: { score: number }) {
    return (
        <span className="flex items-center gap-1 text-xs text-yellow-400 font-medium">
            ★ {score.toFixed(1)}
        </span>
    );
}
