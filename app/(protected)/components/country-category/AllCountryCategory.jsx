"use client";

import { useEffect, useMemo, useState } from "react";
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel } from "@tanstack/react-table";
import { Pencil, Trash2, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardToolbar, CardTable, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DataGrid } from "@/components/ui/data-grid";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { getImageUrl } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { fetchCountryCategoriesThunk, deleteCountryCategoryThunk, setCategoryToEdit } from "@/store/slices/countryCategorySlice";
import toast from "react-hot-toast";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AllCountryCategory() {
    const dispatch = useDispatch();
    const { categories, loading, error } = useSelector((state) => state.countryCategory);
    
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        dispatch(fetchCountryCategoriesThunk(token));
    }, [dispatch]);

    const filteredData = useMemo(() => {
        if (!searchQuery) return categories;
        return categories.filter(c =>
            c.categoryName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.countryId?.name?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, categories]);

    const handleDelete = (category) => {
        setCategoryToDelete(category);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (categoryToDelete) {
            const token = localStorage.getItem("token");
            await dispatch(deleteCountryCategoryThunk({ token, id: categoryToDelete._id }));
            setIsDeleteDialogOpen(false);
            setCategoryToDelete(null);
        }
    };

    const columns = useMemo(() => [
        {
            id: "image",
            accessorFn: (row) => row.image,
            header: () => <span className="font-bold text-gray-700">Image</span>,
            cell: ({ row }) => {
                const imgUrl = getImageUrl(row.original.image);
                return (
                    <div className="relative w-16 h-10 rounded overflow-hidden border shadow-sm bg-gray-50">
                        {imgUrl ? (
                            <img 
                                src={imgUrl} 
                                alt={row.original.categoryName} 
                                className="w-full h-full object-cover" 
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                No Img
                            </div>
                        )}
                    </div>
                );
            },
            size: 100,
        },
        {
            id: "categoryName",
            accessorFn: (row) => row.categoryName,
            header: () => <span className="font-bold text-gray-700">Category Name</span>,
            cell: ({ row }) => (
                <span className="font-semibold text-gray-900">{row.original.categoryName}</span>
            ),
            size: 250,
        },
        {
            id: "country",
            accessorFn: (row) => row.countryId?.name,
            header: () => <span className="font-bold text-gray-700">Country</span>,
            cell: ({ row }) => (
                <span className="text-gray-600 bg-gray-100 px-2 py-0.5 rounded text-sm font-medium border border-gray-200">
                    {row.original.countryId?.name || "N/A"}
                </span>
            ),
            size: 200,
        },
        {
            id: "createdAt",
            accessorFn: (row) => row.createdAt,
            header: () => <span className="font-bold text-gray-700">Created At</span>,
            cell: ({ row }) => (
                <span className="text-gray-500 text-sm">
                    {row.original.createdAt ? new Date(row.original.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    }) : "N/A"}
                </span>
            ),
            size: 150,
        },
        {
            id: "actions",
            header: () => <span className="font-bold text-gray-700 block text-right">Actions</span>,
            cell: ({ row }) => (
                <div className="flex justify-end gap-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button 
                                    onClick={() => dispatch(setCategoryToEdit(row.original))}
                                    className="p-2 cursor-pointer rounded-lg text-primary hover:bg-primary/10 transition-colors"
                                >
                                    <Pencil size={18} />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>Edit Category</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button 
                                    onClick={() => handleDelete(row.original)}
                                    className="p-2 cursor-pointer rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>Delete Category</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            ),
            size: 100,
        }
    ], []);

    const table = useReactTable({
        columns,
        data: filteredData,
        pageCount: Math.ceil((filteredData?.length || 0) / pagination.pageSize),
        getRowId: (row) => String(row._id),
        state: { pagination, sorting },
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    if (loading && categories.length === 0) return <div className="p-10 text-center">Loading categories...</div>;
    if (error) return <div className="p-10 text-center text-red-600">{error}</div>;

    return (
        <DataGrid table={table} recordCount={filteredData?.length || 0}>
            <Card>
                <CardHeader className="py-3.5">
                    <CardTitle>Country Categories</CardTitle>
                    <CardToolbar className="relative">
                        <Search className="absolute start-2 text-primary top-1/2 -translate-y-1/2" />
                        <Input
                            placeholder="Search categories..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="ps-9 max-w-[300px] w-full"
                        />
                        {searchQuery && <Button variant="ghost" className="absolute end-1.5 top-1/2 -translate-y-1/2 h-6 w-6" onClick={() => setSearchQuery("")}><X size={14} /></Button>}
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

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent className="max-w-[400px]">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-bold flex items-center gap-2">
                            <Trash2 className="text-red-600 w-5 h-5" />
                            Yeah! Confirm Deletion
                        </AlertDialogTitle>
                        <AlertDialogDescription className="pt-2">
                            Are you sure you want to delete <span className="font-bold text-gray-900">"{categoryToDelete?.categoryName}"</span>? 
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-6 gap-3">
                        <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 border-none">Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={confirmDelete}
                            className="bg-red-600 hover:bg-red-700 text-white border-none"
                        >
                            Yes, Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DataGrid>
    );
}
