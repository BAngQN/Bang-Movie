"use client";
import { useRouter } from "next/navigation";
import { startTransition } from "react";

interface ErrorPageProps {
    error: Error;
    reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
    const router = useRouter();
    const handleRefresh = () => {
        startTransition(() => {
            router.refresh();
            reset();
        });
    };
    return (
        <div className="flex flex-col items-center justify-center h-screen space-y-4">
            <h1 className="text-4xl font-bold">Something went wrong</h1>
            <p className="text-lg text-gray-600">
                An unexpected error has occurred. Please try again later.
            </p>
            <p className="text-sm text-gray-500 font-bold uppercase">
                {error.message}
            </p>
            <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
                Try Again
            </button>
        </div>
    );
}
