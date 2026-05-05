"use client";

import { useEffect, useMemo, useState } from "react";
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, getExpandedRowModel } from "@tanstack/react-table";
import { Pencil, Trash2, Search, X, Star, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardToolbar, CardTable, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DataGrid } from "@/components/ui/data-grid";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { useDispatch, useSelector } from "react-redux";
import { fetchRatingsThunk, deleteRatingThunk, setRatingToEdit } from "@/store/slices/countrySlice";
import { cn } from "@/lib/utils";
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

export default function AllExploreRatings() {
    const dispatch = useDispatch();
    const { ratings, loading, error } = useSelector((state) => state.country);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [ratingToDelete, setRatingToDelete] = useState(null);

    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        dispatch(fetchRatingsThunk(token));
    }, [dispatch]);

    const filteredData = useMemo(() => {
        if (!searchQuery) return ratings;
        const q = searchQuery.toLowerCase();
        return ratings.filter(r =>
            r.inputId?.name?.toLowerCase().includes(q) ||
            r.countryId?.name?.toLowerCase().includes(q) ||
            r.categoryId?.name?.toLowerCase().includes(q) ||
            r.ratings?.some(ratingObj => ratingObj.title?.toLowerCase().includes(q) || String(ratingObj.rating).includes(q))
        );
    }, [searchQuery, ratings]);

    const handleDelete = (rating) => {
        setRatingToDelete(rating);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (ratingToDelete) {
            const token = localStorage.getItem("token");
            await dispatch(deleteRatingThunk({ token, id: ratingToDelete._id }));
            setIsDeleteDialogOpen(false);
            setRatingToDelete(null);
        }
    };

    const columns = useMemo(() => [
        {
            id: "expander",
            header: () => <span className="w-10"></span>,
            cell: ({ row }) => (
                <button
                    onClick={() => row.toggleExpanded()}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                >
                    <Eye size={18} className={row.getIsExpanded() ? "text-primary" : ""} />
                </button>
            ),
            size: 50,
        },
        {
            id: "ratings",
            accessorFn: (row) => row.ratings,
            header: () => <span className="font-bold text-gray-700">Rating</span>,
            cell: ({ row }) => (
                <div className="flex items-center gap-1.5">
                    {row.original.ratings?.length > 0 ? (
                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded border border-yellow-100 text-[10px]">
                            <span className="font-medium text-gray-700">{row.original.ratings[0].title}:</span>
                            <span className="font-bold text-yellow-700">{row.original.ratings[0].rating}</span>
                            <Star size={10} fill="#eab308" className="text-yellow-500" />
                        </div>
                    ) : (
                        <span className="text-gray-400 text-xs italic">N/A</span>
                    )}
                    {row.original.ratings?.length > 1 && (
                        <span className="text-[10px] text-gray-400 font-medium">+{row.original.ratings.length - 1} more</span>
                    )}
                </div>
            ),
            size: 200,
            meta: {
                expandedContent: (data) => (
                    <div className="p-4 bg-gray-50/50 rounded-lg border border-dashed border-gray-200 m-2">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Full Rating Details</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {data.ratings?.map((r) => (
                                <div key={r._id || r.title} className="flex items-center justify-between bg-white p-2.5 rounded-md border border-gray-100 shadow-sm">
                                    <span className="text-sm font-medium text-gray-700">{r.title}</span>
                                    <div className="flex items-center gap-1">
                                        <span className="font-bold text-primary">{r.rating}</span>
                                        <Star size={14} fill="currentColor" className="text-yellow-500" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            }
        },
        {
            id: "option",
            accessorFn: (row) => row.inputId?.name,
            header: () => <span className="font-bold text-gray-700">Option</span>,
            cell: ({ row }) => (
                <span className="font-semibold text-gray-900">{row.original.inputId?.name || "N/A"}</span>
            ),
            size: 180,
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
            size: 150,
        },
        {
            id: "category",
            accessorFn: (row) => row.categoryId?.name,
            header: () => <span className="font-bold text-gray-700">Category</span>,
            cell: ({ row }) => (
                <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-sm font-medium border border-blue-100">
                    {row.original.categoryId?.name || "N/A"}
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
                                    onClick={() => dispatch(setRatingToEdit(row.original))}
                                    className="p-2 rounded-lg cursor-pointer text-primary hover:bg-primary/10 transition-colors"
                                >
                                    <Pencil size={18} />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>Edit Rating</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={() => handleDelete(row.original)}
                                    className="p-2 rounded-lg cursor-pointer text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>Delete Rating</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            ),
            size: 100,
        }
    ], [dispatch]);

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
        getExpandedRowModel: getExpandedRowModel(),
        getRowCanExpand: () => true,
    });

    if (loading && ratings.length === 0) return <div className="p-10 text-center text-gray-500">Loading ratings...</div>;

    return (
        <DataGrid table={table} recordCount={filteredData?.length || 0}>
            <Card>
                <CardHeader className="py-3.5">
                    <CardTitle>Explore Ratings</CardTitle>
                    <CardToolbar className="relative">
                        <Search className="absolute start-2 text-primary top-1/2 -translate-y-1/2" />
                        <Input
                            placeholder="Search ratings..."
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
                        <AlertDialogTitle className="text-xl font-bold flex items-center gap-2 text-red-600">
                            <Trash2 size={24} />
                            Yeah! Confirm Deletion
                        </AlertDialogTitle>
                        <AlertDialogDescription className="pt-2">
                            Are you sure you want to delete this rating? This action cannot be undone.
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
