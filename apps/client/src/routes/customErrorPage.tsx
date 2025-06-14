import { Link } from "react-router-dom";

export function CustomErrorPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
            <div className="bg-white box-shadow-matas-plus rounded-lg p-10 max-w-lg mx-auto">
                <h1 className="text-6xl font-bold text-blue-600">404</h1>
                <p className="mt-4 text-2xl font-semibold text-gray-700">Page Not Found</p>
                <p className="mt-2 mb-[20px] text-gray-600">The page you're looking for doesn't exist or has been moved.</p>

                <Link
                    to="/"
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md bg-blue-dark transition duration-300 ease-in-out"
                >
                    Go Back to Home
                </Link>
            </div>

            <div className="absolute bottom-4 text-sm text-gray-500">
                © {new Date().getFullYear()} Hamza
            </div>
        </div>
    );
};

export default CustomErrorPage;
