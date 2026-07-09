export function Fact({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="font-semibold text-white">{label}</p>
            <p className="text-sm text-gray-400">{value}</p>
        </div>
    );
}
