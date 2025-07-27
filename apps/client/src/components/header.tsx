import { Link, NavLink } from "react-router-dom";
import { Dropdownmenu } from ".";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useUser } from "../features/auth/hooks/useUser";

export function Header() {
    const token = localStorage.getItem("token");
    const user = useUser();

    const { logout } = useAuth();

    const handleLogout = () => {
        const url = '/auth/logout';
        if (user !== null) {
            const id = user.id;
            logout(url, id);
        }
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
                            `flex items-center px-2 border-b-2 border-transparent hover:text-white transition-colors ${isActive ? "text-white border-blue-400" : "text-gray-400"
                            }`
                        }
                    >
                        Explore
                    </NavLink>
                    <NavLink
                        to="/problems"
                        className={({ isActive }) =>
                            `flex items-center px-2 border-b-2 border-transparent hover:text-white transition-colors ${isActive ? "text-white border-blue-400" : "text-gray-400"
                            }`
                        }
                    >
                        Problems
                    </NavLink>
                </div>
            </div>

            {
                token !== null ? (
                    <Dropdownmenu align="right">
                        <Dropdownmenu.Trigger>
                            <div className="rounded-full border hover:shadow">
                                <img src="/avatar.jpg" alt="Avatar" className="w-10 h-10 rounded-full" />
                            </div>
                        </Dropdownmenu.Trigger>
                        <Dropdownmenu.Content>
                            <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                            <div onClick={handleLogout} className="block px-4 py-2 hover:bg-gray-100">Logout</div>
                        </Dropdownmenu.Content>
                    </Dropdownmenu>
                ) : (
                    <Link
                        to="/login"
                        className="inline-flex items-center justify-center px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                    >Login</Link>
                )
            }
        </nav>
    );
}

export default Header;