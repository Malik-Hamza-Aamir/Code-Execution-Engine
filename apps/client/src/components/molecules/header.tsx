import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NavLink, Link } from "react-router-dom";
import { HiLightningBolt } from "react-icons/hi";
import Button from "../ui/button";
import { getNameInitials } from "../../utils/helper";
import Dropdownmenu from "../ui/dropdownmenu";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    const navLinks = [
        { name: "Problems", to: "/problems" },
        { name: "Submissions", to: "/submissions" },
        { name: "Contests", to: "/contests" },
        { name: "Leaderboard", to: "/leaderboard" },
    ];

    return (
        <header className="bg-black text-slate-100 shadow-md sticky top-0 z-50 h-[70px] flex items-center">
            <div className="flex items-center justify-between px-8 py-3 w-full">
                <div className="flex items-center gap-8">
                    <NavLink
                        to="/problems"
                        className="flex items-center space-x-2 font-bold text-xl"
                    >
                        <div className='bg-white p-1 rounded-md mx-auto w-[29px]'>
                            <HiLightningBolt className='text-black text-[20px]' />
                        </div>
                        <span className="text-white">CodeCraft</span>
                    </NavLink>

                    <nav className="hidden md:flex space-x-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.to}
                                className="text-gray-400 hover:text-white transition-colors font-normal"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="hidden md:flex items-center">
                    <Dropdownmenu>
                        <Dropdownmenu.Trigger>
                            <Button className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer border border-slate-600 bg-slate-800 hover:bg-slate-700 transition-all duration-200 shadow-sm hover:shadow-md">
                                <div className="bg-gradient-to-r from-white to-white rounded-md px-[6px] py-[2px] text-black font-semibold text-sm flex items-center justify-center h-[28px] w-[31px]">
                                    {getNameInitials("Hamza Aamir")}
                                </div>
                                <span className="font-medium text-white text-sm tracking-wide">Hamza Aamir</span>
                            </Button>
                        </Dropdownmenu.Trigger>

                        <Dropdownmenu.Content className="mt-2 w-44 bg-white/95 backdrop-blur-md rounded-lg shadow-lg border border-slate-200 overflow-hidden animate-fade-in">
                            <div className="flex flex-col text-slate-800 text-sm">
                                <button className="px-4 py-2 text-left hover:bg-slate-100 transition-colors">Settings</button>
                                <button className="px-4 py-2 text-left hover:bg-slate-100 transition-colors border-t border-slate-200">Logout</button>
                            </div>
                        </Dropdownmenu.Content>
                    </Dropdownmenu>
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
