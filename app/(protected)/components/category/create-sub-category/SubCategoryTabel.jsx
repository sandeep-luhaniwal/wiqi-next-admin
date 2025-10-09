"use client";

import { useEffect, useMemo, useState } from "react";
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel } from "@tanstack/react-table";
import { Pencil, Trash2, Search, X, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardToolbar, CardTable, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useSubCategory } from "./sub-category-context";
import { DataGrid } from "@/components/ui/data-grid";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import Link from "next/link";
import Image from "next/image";

export default function SubCategoryTable() {
    const { subCategories, setSubCategories, setSubCategoryToEdit, refreshFlag } = useSubCategory();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch subcategories
    useEffect(() => {
        const fetchSubCategories = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                if (!token) throw new Error("Token not found");

                const res = await fetch("https://wiqiapi.testenvapp.com/api/admin/getSubCategory?limit=100000", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                console.log("uisdyadfsiuy", data)
                if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch");
                setSubCategories(data.data.data || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchSubCategories();
    }, [refreshFlag]);

    // Filter by search
    const filteredData = useMemo(() => {
        if (!searchQuery) return subCategories;
        return subCategories.filter(sub =>
            sub.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sub.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sub.categoryId?.name?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, subCategories]);

    // Columns definition
    const columns = useMemo(() => [
        {
            id: "image",
            accessorFn: row => row.image,
            header: () => <span className="font-bold">Image</span>,
            cell: ({ row }) => row.original.image ? (
                <Image width={48} height={48} src={row.original.image} alt={row.original.title} className="w-12 h-12 rounded object-cover border" />
            ) : <Image src={'/media/images/svg/userprofile.svg'} width={48} height={48} alt='no img found' />,
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
                    <span className="text-gray-400">N/A</span>
                ),
            size: 150,
        },
        {
            id: "title",
            accessorFn: row => row.title,
            header: () => <span className="font-bold">Title</span>,
            cell: ({ row }) => (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="truncate block max-w-[300px] cursor-help">{row.original.title}</span>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">{row.original.title}</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ),
            size: 300,
        },
        {
            id: "parent",
            accessorFn: row => row.categoryId?.name,
            header: () => <span className="font-bold">Parent Category</span>,
            cell: ({ row }) => <span className="truncate block max-w-[150px]">{row.original.categoryId?.name || "Null"}</span>,
            size: 150,
        },
        {
            id: "type",
            accessorFn: row => row.type,
            header: () => <span className="font-bold">Type</span>,
            cell: ({ row }) => <span className="capitalize truncate block max-w-[150px]">{row.original.type}</span>,
            size: 100,
        },
        {
            id: "URL",
            accessorFn: row => row.url,
            header: () => <span className="font-bold">URL</span>,
            cell: ({ row }) => (
                row.original.url ? (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    href={row.original.url}
                                    target="_blank"
                                    className="text-primary duration-300 max-w-max hover:text-blue-800 flex items-center gap-1 text-sm"
                                >
                                    <Link2 size={16} /> Visit
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{row.original.url}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                ) : <span className="text-gray-400">N/A</span>
            ),
            size: 85,
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
                                    setSubCategoryToEdit(row.original);
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                }} className="text-primary duration-300 cursor-pointer hover:text-blue-800"><Pencil size={18} /></button>
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
    ], [setSubCategoryToEdit]);

    const table = useReactTable({
        columns,
        data: filteredData,
        pageCount: Math.ceil(filteredData?.length / pagination.pageSize),
        getRowId: row => String(row._id),
        state: { pagination, sorting },
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        columnResizeMode: "onChange",
    });

    if (loading) return <div className="flex justify-center items-center min-h-[200px]">Loading subcategories...</div>;
    if (error) return <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>;

    return (
        <DataGrid table={table} recordCount={filteredData?.length || 0}>
            <Card>
                <CardHeader className="py-3.5">
                    <CardTitle>SubCategories</CardTitle>
                    <CardToolbar className="relative">
                        <Search className="absolute start-2 text-primary duration-300 top-1/2 -translate-y-1/2" />
                        <Input
                            placeholder="Search subcategories..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="ps-9 max-w-[300px] w-full"
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
