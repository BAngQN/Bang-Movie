export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-screen space-y-4">
            <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
            <p className="text-lg text-gray-600">
                The page you are looking for does not exist. Please check the
                URL and try again.
            </p>
        </div>
    );
}
