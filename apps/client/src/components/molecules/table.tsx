import React, { useState, useMemo } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

type Column<T> = {
    field: keyof T;
    header: string;
    sorting?: boolean;
    clickable?: boolean; // allow click on specific columns or cells
};

type TableProps<T> = {
    data: T[];
    columns: Column<T>[];
    pagination?: boolean;
    rowsPerPage?: number;
    onRowClick?: (row: T) => void;
};

export function Table<T extends Record<string, any>>({
    data,
    columns,
    pagination = false,
    rowsPerPage = 5,
    onRowClick,
}: TableProps<T>) {
    const [sortField, setSortField] = useState<keyof T | null>(null);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [currentPage, setCurrentPage] = useState(1);

    const sortedData = useMemo(() => {
        if (!sortField) return data;
        return [...data].sort((a, b) => {
            const aVal = a[sortField];
            const bVal = b[sortField];
            if (aVal == null) return 1;
            if (bVal == null) return -1;
            if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
            if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });
    }, [data, sortField, sortOrder]);

    const paginatedData = useMemo(() => {
        if (!pagination) return sortedData;
        const start = (currentPage - 1) * rowsPerPage;
        return sortedData.slice(start, start + rowsPerPage);
    }, [sortedData, pagination, currentPage, rowsPerPage]);

    const handleSort = (field: keyof T) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    const handleRowClick = (row: T, col: Column<T>) => {
        if (col.clickable && onRowClick) {
            onRowClick(row);
        }
    };

    const totalPages = Math.ceil(data.length / rowsPerPage);

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm shadow-sm">
                <thead className="bg-slate-900 text-slate-100">
                    <tr className="border-b border-slate-700">
                        {columns.map((col) => (
                            <th
                                key={String(col.field)}
                                className={`py-3 px-4 font-medium ${col.sorting ? "cursor-pointer select-none" : ""
                                    }`}
                                onClick={() => col.sorting && handleSort(col.field)}
                            >
                                <div className="flex items-center gap-2">
                                    {col.header}
                                    {col.sorting &&
                                        sortField === col.field &&
                                        (sortOrder === "asc" ? (
                                            <ChevronUp size={16} />
                                        ) : (
                                            <ChevronDown size={16} />
                                        ))}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.length > 0 ? (
                        paginatedData.map((row, i) => (
                            <tr
                                key={i}
                                className="border-b border-slate-200 hover:bg-slate-100 transition-colors"
                            >
                                {columns.map((col) => (
                                    <td
                                        key={String(col.field)}
                                        className={`py-3 px-4 ${col.clickable ? "cursor-pointer text-blue-600 hover:underline" : ""
                                            }`}
                                        onClick={() => handleRowClick(row, col)}
                                    >
                                        {String(row[col.field])}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="py-6 text-center text-slate-500">
                                No data available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {pagination && totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-slate-600">
                        Page {currentPage} of {totalPages}
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            className="px-3 py-1 border rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-50"
                            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Prev
                        </button>
                        <button
                            className="px-3 py-1 border rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-50"
                            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Table;