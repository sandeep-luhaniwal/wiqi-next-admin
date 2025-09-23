"use client";

import { useEffect, useMemo, useState } from "react";
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel } from "@tanstack/react-table";
import { Pencil, Trash2, Search, X, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardToolbar, CardTable, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useCategory } from "./category-context";
import { DataGrid } from "@/components/ui/data-grid";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import Link from "next/link";

export default function AllTypeCategory() {
    const { categories, setCategories, setCategoryToEdit, refreshFlag } = useCategory();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                if (!token) throw new Error("Token not found");

                const res = await fetch("https://wiqiapi.testenvapp.com/api/admin/getCategory?limit===10000000", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch");
                setCategories(data.data.data || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, [refreshFlag]);

    const filteredData = useMemo(() => {
        if (!searchQuery) return categories;
        return categories.filter(cat =>
            cat.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cat.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cat.type?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, categories]);

    const columns = useMemo(() => [
        {
            id: "image",
            accessorFn: (row) => row.image,
            header: () => <span className="font-bold">Image</span>,
            cell: ({ row }) => row.original.image ? <img src={row.original.image} alt={row.original.name} className="w-12 h-12 rounded object-cover border" /> : <span className="text-gray-400 text-sm">No Image</span>,
            size: 100,
        },
        {
            id: "name",
            accessorFn: (row) => row.name,
            header: () => <span className="font-bold">Name</span>,
            cell: ({ row }) =>
                row.original.name ? (
                    <span
                        className="font-bold truncate block max-w-[150px]"
                        title={row.original.name}
                    >
                        {row.original.name}
                    </span>
                ) : (
                    <span className="text-gray-400">Null</span>
                ),
            size: 150,
        },
        {
            id: "title",
            accessorFn: (row) => row.title,
            header: () => <span className="font-bold">Title</span>,
            cell: ({ row }) => (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="truncate block max-w-[350px] cursor-help">{row.original.title}</span>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">{row.original.title}</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ),
            size: 350,
        },
        {
            id: "type",
            accessorFn: (row) => row.type,
            header: () => <span className="font-bold">Type</span>,
            cell: ({ row }) => <span className="capitalize truncate block max-w-[150px]" title={row.original.type}>{row.original.type}</span>,
            size: 100,
        },
        {
            id: "URL",
            accessorFn: (row) => row.type,
            header: () => <span className="font-bold">URL</span>,
            cell: ({ row }) => (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className="capitalize truncate block max-w-[150px] cursor-pointer">
                            {row.original.url ? (
                                <Link
                                    href={row.original.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                                >
                                    <Link2 size={16} className="w-4 h-4" /> Visit
                                </Link>
                            ) : (
                                <span className="text-gray-400">Null</span>
                            )}
                        </span>
                    </TooltipTrigger>
                    {row.original.url && (
                        <TooltipContent side="top" className="max-w-xs break-words">
                            {row.original.url}
                        </TooltipContent>
                    )}
                </Tooltip>
            ),
            size: 90,
        },
        {
            id: "actions",
            header: () => <span className="font-bold block text-right">Actions</span>,
            cell: ({ row }) => (
                <div className="flex justify-end gap-3 items-center">

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button onClick={() => {
                                    setCategoryToEdit(row.original);
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                                    className="text-blue-600 cursor-pointer hover:text-blue-800"><Pencil size={18} /></button>
                            </TooltipTrigger>
                            <TooltipContent>Edit</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button className="text-red-600 cursor-pointer hover:text-red-800"><Trash2 size={18} /></button>
                            </TooltipTrigger>
                            <TooltipContent>Delete</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            ),
            size: 90,
        }
    ], [setCategoryToEdit]);

    const table = useReactTable({
        columns,
        data: filteredData,
        pageCount: Math.ceil(filteredData?.length / pagination.pageSize),
        getRowId: (row) => String(row._id),
        state: { pagination, sorting },
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        columnResizeMode: "onChange",
    });

    if (loading) return <div className="flex justify-center items-center min-h-[200px]">Loading categories...</div>;
    if (error) return <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>;

    return (
        <DataGrid table={table} recordCount={filteredData?.length || 0}>
            <Card>
                <CardHeader className="py-3.5">
                    <CardTitle>Categories</CardTitle>
                    <CardToolbar className="relative">
                        <Search className="absolute start-3 top-1/2 -translate-y-1/2" />
                        <Input
                            placeholder="Search categories..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="ps-9 max-w-[200px] w-full"
                        />
                        {searchQuery && <Button variant="ghost" className="absolute end-1.5 top-1/2 -translate-y-1/2 h-6 w-6" onClick={() => setSearchQuery("")}><X /></Button>}
                    </CardToolbar>
                </CardHeader>
                <CardTable>
                    <ScrollArea>
                        <DataGridTable />
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </CardTable>
                <CardFooter>
                    <DataGridPagination />
                </CardFooter>
            </Card>
        </DataGrid>
    );
}
