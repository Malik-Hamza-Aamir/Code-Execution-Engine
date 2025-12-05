import Table from "../molecules/table";
import { useState } from "react";
import { Shuffle } from "lucide-react"; // Shuffle icon from lucide-react

type Problem = {
    title: string;
    solution: string;
    acceptance: string;
    difficulty: string;
    status: string;
};

const problems: Problem[] = [
    { title: "Two Sum", solution: "", acceptance: "40.2%", difficulty: "Easy", status: "✔️" },
    { title: "Add Two Numbers", solution: "", acceptance: "30.4%", difficulty: "Medium", status: "✔️" },
    { title: "Longest Substring Without Repeating Characters", solution: "", acceptance: "26.1%", difficulty: "Medium", status: "✔️" },
    { title: "Median of Two Sorted Arrays", solution: "", acceptance: "25.3%", difficulty: "Hard", status: "✔️" },
    { title: "Longest Palindromic Substring", solution: "", acceptance: "26.3%", difficulty: "Medium", status: "✔️" },
    { title: "ZigZag Conversion", solution: "", acceptance: "30.4%", difficulty: "Medium", status: "✔️" },
    { title: "Reverse Integer", solution: "", acceptance: "25.1%", difficulty: "Easy", status: "✔️" },
    { title: "String to Integer (atoi)", solution: "", acceptance: "14.4%", difficulty: "Medium", status: "✔️" },
    { title: "Palindrome Number", solution: "", acceptance: "41.6%", difficulty: "Easy", status: "✔️" },
    { title: "Regular Expression Matching", solution: "", acceptance: "24.9%", difficulty: "Hard", status: "✔️" },
    { title: "Container With Most Water", solution: "", acceptance: "42.1%", difficulty: "Medium", status: "✔️" },
    { title: "Integer to Roman", solution: "", acceptance: "49.5%", difficulty: "Medium", status: "✔️" },
    { title: "Roman to Integer", solution: "", acceptance: "51.4%", difficulty: "Easy", status: "✔️" },
    { title: "Longest Common Prefix", solution: "", acceptance: "32.9%", difficulty: "Easy", status: "✔️" },
];

type Column<T> = {
    field: keyof T;
    header: string;
    sorting?: boolean;
    clickable?: boolean;
};

const columns: Column<Problem>[] = [
    { field: "status", header: "#" },
    { field: "title", header: "Title", clickable: true },
    { field: "solution", header: "Solution" },
    { field: "acceptance", header: "Acceptance" },
    { field: "difficulty", header: "Difficulty" },
];

export function Problems() {
    const [selected, setSelected] = useState<Problem | null>(null);

    return (
        <div className="flex gap-6 p-8 bg-gray-50 border w-full">
            <div className="flex-1 border border-gray-200 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
                <div className="flex flex-col gap-3 mb-6">
                    <h2 className="text-lg font-semibold text-gray-800">Category - All</h2>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3 text-sm">
                            <span className="text-gray-700 font-medium">
                                427/1500 Solved
                            </span>

                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg font-medium">
                                Easy 247
                            </span>
                            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg font-medium">
                                Medium 124
                            </span>
                            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-lg font-medium">
                                Hard 56
                            </span>
                        </div>

                        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                            <Shuffle className="w-4 h-4" />
                            Pick One
                        </button>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center w-1/3">
                            <input
                                type="text"
                                placeholder="Search question titles, descriptions or IDs"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                            <select className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500">
                                <option>Difficulty</option>
                                <option>Easy</option>
                                <option>Medium</option>
                                <option>Hard</option>
                            </select>
                            <select className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500">
                                <option>Status</option>
                                <option>Solved</option>
                                <option>Unsolved</option>
                            </select>
                            <select className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500">
                                <option>Lists</option>
                                <option>Top 100</option>
                                <option>Company</option>
                            </select>
                            <select className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500">
                                <option>Tags</option>
                                <option>Array</option>
                                <option>String</option>
                                <option>Dynamic Programming</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="border border-gray-200 rounded-lg hover:border-gray-400 transition-all duration-200">
                    <Table
                        data={problems}
                        columns={columns}
                        pagination
                        rowsPerPage={10}
                        onRowClick={(row) => setSelected(row)}
                    />
                </div>
            </div>

            <div className="w-80 flex flex-col gap-4">
                <div className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200 rounded-xl border border-gray-200 overflow-hidden cursor-pointer hover:border-gray-400">
                    <div className="p-4">
                        <h3 className="text-gray-600 text-sm mb-2">Learn the Basics</h3>
                        <div className="bg-teal-600 text-white rounded-lg p-6 flex flex-col items-start justify-center">
                            <h4 className="text-lg font-semibold mb-1">
                                Introduction to Algorithms
                            </h4>
                            <p className="opacity-80">Recursion I</p>
                            <div className="mt-3 text-xs">5 Chapters • 128 items</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-6 text-center">
                    <h4 className="font-semibold mb-3">Your Progress</h4>
                    <div className="flex justify-center">
                        <div className="relative w-24 h-24">
                            <svg className="w-full h-full" viewBox="0 0 36 36">
                                <circle
                                    cx="18"
                                    cy="18"
                                    r="16"
                                    stroke="#e5e7eb"
                                    strokeWidth="4"
                                    fill="none"
                                />
                                <circle
                                    cx="18"
                                    cy="18"
                                    r="16"
                                    stroke="#10b981"
                                    strokeWidth="4"
                                    strokeDasharray="75 100"
                                    fill="none"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-gray-700 text-sm font-semibold">
                                75%
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-6">
                    <h4 className="font-semibold mb-3">Top Hits</h4>
                    <ul className="text-sm text-gray-600 space-y-2">
                        <li>Top 100 Liked Questions</li>
                        <li>Top Amazon Questions</li>
                        <li>Top Facebook Questions</li>
                        <li>Top Google Questions</li>
                        <li>Top Interview Questions</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Problems;
