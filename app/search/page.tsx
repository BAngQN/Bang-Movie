import { Suspense } from "react";
import SearchContent from "./_SearchContent";

export default function SearchPage() {
    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center py-32">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                </div>
            }
        >
            <SearchContent />
        </Suspense>
    );
}
