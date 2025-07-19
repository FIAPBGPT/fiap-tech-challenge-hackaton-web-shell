"use client";
import * as React from "react";
import { useState } from "react";
import { FiEdit, FiTrash } from "react-icons/fi";

type Column<T> = {
    key: string;
    label: string;
    render?: (item: T) => React.ReactNode;
};

type Props<T> = {
    data: T[];
    columns: Column<T>[];
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    loading?: boolean;
    defaultRowsPerPage?: number;
};

export default function GenericTable<T extends { id: string }>({
    data,
    columns,
    onEdit,
    onDelete,
    loading,
    defaultRowsPerPage = 10,
}: Props<T>) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

    const totalPages = Math.ceil(data.length / rowsPerPage);
    const paginatedData = data.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(e.target.value));
        setPage(0);
    };

    if (loading) return <p>Carregando...</p>;
    if (data.length === 0) return <p>Nenhum item encontrado.</p>;

    // Number of columns (including actions)
    const colCount = columns.length + (onEdit || onDelete ? 1 : 0);

    return (
        <div className="space-y-4 w-full">
            <div className="row">
                <div className="col-12">
                    <div className="overflow-auto border rounded-md w-full">
                        <table className="min-w-full w-full text-sm text-left border-separate border-spacing-2 bg-gray-100 w-100">
                            <thead
                                className="text-center"
                                style={{ backgroundColor: "#9FCA86" }}
                            >
                                <tr>
                                    {columns.map((col) => (
                                        <th
                                            key={col.key}
                                            className="px-4 py-3 border-b"
                                            style={{ color: "#ffffff", fontWeight: "bold" }}
                                        >
                                            {col.label}
                                        </th>
                                    ))}
                                    {(onEdit || onDelete) && (
                                        <th
                                            className="px-4 py-3 border-b"
                                            style={{ color: "#ffffff", fontWeight: "bold" }}
                                        >
                                            Ações
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody
                                className="text-center"
                                style={{ backgroundColor: "#ffffff", color: "#6A9253" }}
                            >
                                {paginatedData.map((item) => (
                                    <tr key={item.id} className="border-b">
                                        {columns.map((col) => (
                                            <td
                                                key={col.key}
                                                className="px-4 py-2"
                                                style={{ color: "#6A9253" }}
                                            >
                                                {col.render ? col.render(item) : (item as any)[col.key]}
                                            </td>
                                        ))}
                                        {(onEdit || onDelete) && (
                                            <td className="px-4 py-2 whitespace-nowrap">
                                                <div className="flex space-x-4 justify-content-around">
                                                    {onEdit && (
                                                        <div className="relative group">
                                                            <button
                                                                onClick={() => onEdit(item)}
                                                                title="Editar"
                                                            >
                                                                <FiEdit size={18} />
                                                            </button>
                                                        </div>
                                                    )}
                                                    {onDelete && (
                                                        <div className="relative group">
                                                            <button
                                                                onClick={() => onDelete(item)}
                                                                title="Excluir"
                                                                style={{ color: "red" }}
                                                            >
                                                                <FiTrash size={18} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan={colCount}>
                                        <div className="flex justify-content-between align-items-center py-2 px-2" style={{ backgroundColor: "#CAD0C8", color: "#59734A" }}>
                                            {/* Left: Rows per page */}
                                            <div className="flex align-items-center space-x-2">
                                                <span className="me-1">Exibir</span>
                                                <select
                                                    value={rowsPerPage}
                                                    onChange={handleChangeRowsPerPage}
                                                    className="border px-2 py-1 rounded me-1"
                                                >
                                                    {[5, 10, 25, 50, 100].map((opt) => (
                                                        <option key={opt} value={opt}>
                                                            {opt}
                                                        </option>
                                                    ))}
                                                </select>
                                                <span>por página</span>
                                            </div>
                                            {/* Right: Pagination controls */}
                                            <div className="flex align-items-center space-x-4">
                                                <button
                                                    onClick={() => setPage((p) => Math.max(p - 1, 0))}
                                                    disabled={page === 0 || totalPages === 0}
                                                    className={`px-2 py-1 border rounded me-1 ${page === 0 || totalPages === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                                                    style={{ background: "#A67F00", color: "#ffffff" }}
                                                >
                                                    Anterior
                                                </button>
                                                <span className="me-1">
                                                    Página {totalPages === 0 ? 0 : page + 1} de {totalPages}
                                                </span>
                                                <button
                                                    onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
                                                    disabled={page >= totalPages - 1 || totalPages === 0}
                                                    className={`px-2 py-1 border rounded ${page >= totalPages - 1 || totalPages === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                                                    style={{ background: "#59734A", color: "#ffffff" }}
                                                >
                                                    Próxima
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
