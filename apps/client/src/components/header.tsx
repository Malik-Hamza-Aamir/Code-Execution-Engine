import { Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

export function Header() {
    const [hasToken, setHasToken] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setHasToken(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setHasToken(false);
        setDropdownOpen(false);
    };

    return (
        <nav className="bg-gray-900 text-gray-200 border-b border-gray-700 h-14 px-6 flex items-center justify-between">
            <div className="flex items-center h-full">
                <Link 
                    to="/" 
                    className="text-xl font-bold text-blue-400 hover:text-blue-300 mr-10"
                >
                    LEETCODE
                </Link>
                
                <div className="flex space-x-6 h-full">
                    <NavLink 
                        to="/" 
                        className={({ isActive }) => 
                            `flex items-center px-2 border-b-2 border-transparent hover:text-white transition-colors ${
                                isActive ? "text-white border-blue-400" : "text-gray-400"
                            }`
                        }
                    >
                        Explore
                    </NavLink>
                    <NavLink 
                        to="/problems" 
                        className={({ isActive }) => 
                            `flex items-center px-2 border-b-2 border-transparent hover:text-white transition-colors ${
                                isActive ? "text-white border-blue-400" : "text-gray-400"
                            }`
                        }
                    >
                        Problems
                    </NavLink>
                </div>
            </div>

            <div className="relative">
                {hasToken ? (
                    <div className="flex items-center">
                        <button 
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-300"
                        >
                            U
                        </button>
                        
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-700">
                                <Link 
                                    to="/settings" 
                                    className="block px-4 py-2 text-gray-200 hover:bg-gray-700"
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    Settings
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-gray-700"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <NavLink 
                        to="/login" 
                        className={({ isActive }) => 
                            `px-4 py-2 rounded-md font-medium transition-colors ${
                                isActive ? "bg-blue-600 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"
                            }`
                        }
                    >
                        Login
                    </NavLink>
                )}
            </div>
        </nav>
    );
}

export default Header;