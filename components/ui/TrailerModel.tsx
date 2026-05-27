"use client";

export function TrailerModal({
    videoKey,
    onClose,
}: {
    videoKey: string;
    onClose: () => void;
}) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-4xl px-4"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute -top-10 right-4 text-2xl text-white hover:text-gray-300"
                >
                    ✕
                </button>
                <div className="aspect-video w-full overflow-hidden rounded-xl">
                    <iframe
                        src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
                        title="Trailer"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                        className="h-full w-full"
                    />
                </div>
            </div>
        </div>
    );
}
