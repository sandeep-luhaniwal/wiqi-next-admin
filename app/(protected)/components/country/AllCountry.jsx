"use client";

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
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTable, CardTitle, CardToolbar } from "@/components/ui/card";
import { DataGrid } from "@/components/ui/data-grid";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getImageUrl } from "@/lib/utils";
import { deleteCountryThunk, fetchCountriesThunk } from "@/store/slices/countrySlice";
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { Pencil, Search, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import countryList from "react-select-country-list";
import Flag from "react-world-flags";
import { useCountry } from "./country-context";

export default function AllCountry() {
    const { setCountryToEdit, refreshFlag } = useCountry();
    const dispatch = useDispatch();
    const { countries, loading, error } = useSelector((state) => state.country);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [countryToDelete, setCountryToDelete] = useState(null);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const countryOptions = useMemo(() => countryList().getData(), []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        dispatch(fetchCountriesThunk(token));
    }, [dispatch, refreshFlag]);

    const filteredData = useMemo(() => {
        if (!searchQuery) return countries;
        return countries.filter(c =>
            c.countryName?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, countries]);

    const handleDelete = (country) => {
        setCountryToDelete(country);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (countryToDelete) {
            const token = localStorage.getItem("token");
            await dispatch(deleteCountryThunk({ token, id: countryToDelete._id }));
            setIsDeleteDialogOpen(false);
            setCountryToDelete(null);
        }
    };

    const columns = useMemo(() => [
        {
            id: "image",
            accessorFn: (row) => row.image,
            header: () => <span className="font-bold text-gray-700">Flag / Image</span>,
            cell: ({ row }) => {
                const imgUrl = getImageUrl(row.original.image);
                const country = countryOptions.find(c => c.label === row.original.countryName);
                
                return (
                    <div className="flex items-center gap-3">
                        {imgUrl ? (
                            <div className="relative w-12 h-8 rounded overflow-hidden border shadow-sm bg-gray-50">
                                <img 
                                    src={imgUrl} 
                                    alt={row.original.countryName} 
                                    className="w-full h-full object-cover" 
                                />
                            </div>
                        ) : country ? (
                            <div className="w-12 h-8 rounded overflow-hidden border shadow-sm">
                                <Flag code={country.value} className="w-full h-full object-cover" />
                            </div>
                        ) : (
                            <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center border border-dashed border-gray-300">
                                <span className="text-[10px] text-gray-400">No Image</span>
                            </div>
                        )}
                    </div>
                );
            },
            size: 120,
        },
        {
            id: "countryName",
            accessorFn: (row) => row.countryName,
            header: () => <span className="font-bold text-gray-700">Country Name</span>,
            cell: ({ row }) => {
                const country = countryOptions.find(c => c.label === row.original.countryName);
                return (
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900 truncate max-w-[200px]">
                            {row.original.countryName}
                        </span>
                        {country && (
                            <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">
                                ISO: {country.value}
                            </span>
                        )}
                    </div>
                );
            },
            size: 250,
        },
        {
            id: "createdAt",
            accessorFn: (row) => row.createdAt,
            header: () => <span className="font-bold text-gray-700 text-center block">Created At</span>,
            cell: ({ row }) => (
                <span className="text-gray-500 text-sm block text-center">
                    {new Date(row.original.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })}
                </span>
            ),
            size: 150,
        },
        {
            id: "actions",
            header: () => <span className="font-bold text-gray-700 block text-right">Actions</span>,
            cell: ({ row }) => (
                <div className="flex justify-end gap-2 items-center">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button onClick={() => {
                                    setCountryToEdit(row.original);
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                                    className="p-2 rounded-lg cursor-pointer text-primary hover:bg-primary/10 transition-colors">
                                    <Pencil size={18} />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>Edit Country</TooltipContent>
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
                            <TooltipContent>Delete Country</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            ),
            size: 100,
        }
    ], [setCountryToEdit, countryOptions]);

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
        columnResizeMode: "onChange",
    });

    if (loading) return <div className="flex justify-center items-center min-h-[200px]">Loading countries...</div>;
    if (error) return <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>;

    return (
        <DataGrid table={table} recordCount={filteredData?.length || 0}>
            <Card>
                <CardHeader className="py-3.5">
                    <CardTitle>Countries</CardTitle>
                    <CardToolbar className="relative">
                        <Search className="absolute start-2 text-primary top-1/2 -translate-y-1/2" />
                        <Input
                            placeholder="Search countries..."
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

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent className="max-w-[400px]">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-bold flex items-center gap-2">
                            <Trash2 className="text-red-600 w-5 h-5" />
                            Yeah! Confirm Deletion
                        </AlertDialogTitle>
                        <AlertDialogDescription className="pt-2">
                            Are you absolutely sure you want to delete <span className="font-bold text-gray-900">"{countryToDelete?.countryName}"</span>? 
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
