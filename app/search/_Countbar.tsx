export default function CountBar({ totalResults }: { totalResults: number }) {
    return (
        <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-400">
                {totalResults.toLocaleString()} result
                {totalResults !== 1 ? "s" : ""} found
            </p>
        </div>
    );
}
