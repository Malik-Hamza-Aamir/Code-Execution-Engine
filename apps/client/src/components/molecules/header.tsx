import { useState } from "react";
import { Menu, X, Code2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    const navLinks = [
        { name: "Problems", to: "/problems" },
        { name: "Submissions", to: "/submissions" },
        { name: "Contests", to: "/contests" },
        { name: "Leaderboard", to: "/leaderboard" },
    ];

    return (
        <header className="bg-slate-800 text-slate-100 shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
                <Link
                    to="/"
                    className="flex items-center space-x-2 text-amber-400 font-bold text-xl"
                >
                    <Code2 className="w-6 h-6" />
                    <span>CodeArena</span>
                </Link>

                <nav className="hidden md:flex space-x-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.to}
                            className="hover:text-amber-400 transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                <div className="hidden md:flex items-center space-x-4">
                    <input
                        type="text"
                        placeholder="Search problems..."
                        className="bg-slate-700 px-3 py-1.5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <Link
                        to="/profile"
                        className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-md text-sm font-medium"
                    >
                        Profile
                    </Link>
                </div>

                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden text-slate-200 focus:outline-none"
                >
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {menuOpen && (
                <nav className="md:hidden bg-slate-700 px-4 py-2 space-y-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.to}
                            className="block py-1 text-slate-100 hover:text-amber-400 transition-colors"
                            onClick={() => setMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        to="/profile"
                        className="block py-1 text-slate-100 hover:text-amber-400 transition-colors"
                        onClick={() => setMenuOpen(false)}
                    >
                        Profile
                    </Link>
                </nav>
            )}
        </header>
    );
}
