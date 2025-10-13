"use client";

import { useEffect, useMemo, useState } from "react";
import { useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel } from "@tanstack/react-table";
import { Pencil, Trash2, Search, X, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardToolbar, CardTable, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DataGrid } from "@/components/ui/data-grid";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import Image from "next/image";
import { useProCategory } from "./pro-category";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";
import { fetchProCategories } from "@/app/api/categories/categories";

export default function ProCategoryTable() {
    const { proCategories, setProCategories, setProCategoryToEdit, refreshFlag, setOpen } = useProCategory();
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

    // Fetch data
  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const data = await fetchProCategories();
      setProCategories(data);
      setLoading(false);
    };
    getData();
  }, [refreshFlag, setProCategories]);

    const filteredData = useMemo(() => {
        if (!searchQuery) return proCategories;
        return proCategories.filter(item =>
            item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.categoryId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.subCategoryId?.name?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, proCategories]);

    const columns = useMemo(() => [
        {
            id: "image",
            accessorFn: row => row.image,
            header: <span className="font-bold">Image</span>,
            cell: ({ row }) =>
                row.original.image ? (
                    <Image src={row.original.image} alt="img" width={48} height={48} className="rounded border w-12 h-12 object-contain" />
                ) : "Null",
            size: 80,
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
            id: "category",
            accessorFn: row => row.categoryId?.name,
            header: <span className="font-bold">Category</span>,
            cell: ({ row }) => row.original.categoryId?.name || "Null",
            size: 120,
        },
        {
            id: "subCategory",
            accessorFn: row => row.subCategoryId?.name,
            header: <span className="font-bold">SubCategory</span>,
            cell: ({ row }) => row.original.subCategoryId?.name || "Null",
            size: 160,
        },
        {
            id: "title",
            accessorFn: row => row.title,
            header: <span className="font-bold">Title</span>,
            cell: ({ row }) => row.original.title,
            size: 250,
        },
        {
            id: "type",
            accessorFn: row => row.type,
            header: <span className="font-bold">Type</span>,
            cell: ({ row }) => row.original.type,
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
                <div className="flex gap-2 justify-end">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button onClick={() => {
                                    setOpen(true);
                                    setProCategoryToEdit(row.original);
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                }} className="text-primary duration-300 cursor-pointer hover:text-blue-800"><Pencil size={18} /></button>
                            </TooltipTrigger>
                            <TooltipContent>Edit</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    {/* <button className="text-red-600">
                        <Trash2 size={16} />
                    </button> */}
                </div>
            ),
            size: 85,
        }
    ], [setProCategoryToEdit]);

    const table = useReactTable({
        columns,
        data: filteredData,
        pageCount: Math.ceil(filteredData.length / pagination.pageSize),
        state: { pagination },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <DataGrid table={table} recordCount={filteredData.length}>
            <Card>
                <CardHeader className="py-3.5">
                    <CardTitle>Pro Categories</CardTitle>
                    <CardToolbar className="relative">
                        <Search className="absolute start-2 top-1/2 -translate-y-1/2 text-primary" />
                        <Input
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="ps-9 max-w-[300px]"
                        />
                        {searchQuery && (
                            <Button variant="ghost" className="absolute end-1 top-1/2 -translate-y-1/2 h-6 w-6" onClick={() => setSearchQuery("")}>
                                <X />
                            </Button>
                        )}
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
