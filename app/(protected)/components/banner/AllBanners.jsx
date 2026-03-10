"use client";

import { useEffect, useMemo, useState } from "react";
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel } from "@tanstack/react-table";
import { Pencil, Trash2, Search, X, Link2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardToolbar, CardTable, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useBanner } from "./banner-context";
import { DataGrid } from "@/components/ui/data-grid";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import Link from "next/link";
import { getBanners, deleteBanner, bannerStatus } from "@/app/api/banner/banner";
import Image from "next/image";
import toast from "react-hot-toast";

export default function AllBanners() {
    const { banners, setBanners, setBannerToEdit, refreshFlag } = useBanner();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                const data = await getBanners(token);
                setBanners(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchBanners();
    }, [refreshFlag, setBanners]);

    const filteredData = useMemo(() => {
        if (!searchQuery) return banners;
        return banners.filter(banner =>
            banner.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            banner.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            banner.type?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, banners]);

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await deleteBanner(token, id);
            toast.success("Banner deleted successfully!");
            setBanners(prev => prev.filter(banner => banner._id !== id));
        } catch (err) {
            toast.error(err.message || "Failed to delete banner");
        }
    };

    const handleStatusToggle = async (id, currentStatus) => {
        try {
            const token = localStorage.getItem("token");
            const newStatus = currentStatus === true || currentStatus === "active" ? false : true;
            await bannerStatus(token, id, newStatus);
            toast.success(`Banner ${newStatus ? "activated" : "deactivated"}!`);
            setBanners(prev => prev.map(banner => 
                banner._id === id ? { ...banner, status: newStatus } : banner
            ));
        } catch (err) {
            toast.error(err.message || "Failed to update banner status");
        }
    };

    const columns = useMemo(() => [
        {
            id: "image",
            accessorFn: (row) => row.image,
            header: () => <span className="font-bold">Image</span>,
            cell: ({ row }) => row.original.image ? 
                <Image width={100} height={50} src={row.original.image} alt="banner" className="w-[100px] h-[50px] rounded object-cover border" /> :
                <Image src={'/media/images/svg/userprofile.svg'} width={100} height={50} alt='no img found' className="w-[100px] h-[50px]" />,
            size: 120, 
        },
        {
            id: "title",
            accessorFn: (row) => row.title || row.name,
            header: () => <span className="font-bold">Title</span>,
            cell: ({ row }) => (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="truncate block max-w-[200px] cursor-help font-medium">{row.original.title || row.original.name}</span>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">{row.original.title || row.original.name}</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ),
            size: 200,
        },
        {
            id: "index",
            accessorFn: (row) => row.index,
            header: () => <span className="font-bold">Index</span>,
            cell: ({ row }) => (
                <span className="font-medium text-center block">
                    {row.original.index || "N/A"}
                </span>
            ),
            size: 80,
        },
        {
            id: "type",
            accessorFn: (row) => row.type,
            header: () => <span className="font-bold">Type</span>,
            cell: ({ row }) => (
                <span className="capitalize px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                    {row.original.type || "N/A"}
                </span>
            ),
            size: 100,
        },
        {
            id: "url",
            accessorFn: (row) => row.url,
            header: () => <span className="font-bold">URL</span>,
            cell: ({ row }) => row.original.url ? (
                <Link
                    href={row.original.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary duration-300 hover:text-blue-800 flex items-center gap-1 text-sm"
                >
                    <Link2 size={16} className="w-4 h-4" /> Visit
                </Link>
            ) : <span className="text-gray-400">N/A</span>,
            size: 90,
        },
        {
            id: "status",
            accessorFn: (row) => row.status,
            header: () => <span className="font-bold">Status</span>,
            cell: ({ row }) => (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                onClick={() => handleStatusToggle(row.original._id, row.original.status)}
                                className={`px-2 py-1 rounded text-sm font-medium cursor-pointer ${
                                    row.original.status === true || row.original.status === "active"
                                        ? "bg-green-100 text-green-800 hover:bg-green-200" 
                                        : "bg-red-100 text-red-800 hover:bg-red-200"
                                }`}
                            >
                                {row.original.status === true || row.original.status === "active" ? "Active" : "Inactive"}
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>Click to toggle status</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ),
            size: 100,
        },
        {
            id: "actions",
            header: () => <span className="font-bold block text-right">Actions</span>,
            cell: ({ row }) => (
                <div className="flex justify-end gap-3 items-center">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <button className="text-blue-600 cursor-pointer hover:text-blue-800">
                                            <Eye size={18} />
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl">
                                        <DialogHeader>
                                            <DialogTitle>Banner Details</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="font-semibold">Title:</label>
                                                    <p>{row.original.title || row.original.name}</p>
                                                </div>
                                                <div>
                                                    <label className="font-semibold">Type:</label>
                                                    <p className="capitalize">{row.original.type}</p>
                                                </div>
                                                <div>
                                                    <label className="font-semibold">Index:</label>
                                                    <p>{row.original.index || "N/A"}</p>
                                                </div>
                                                <div>
                                                    <label className="font-semibold">Status:</label>
                                                    <span className={`px-2 py-1 rounded text-sm ${
                                                        row.original.status === true || row.original.status === "active"
                                                            ? "bg-green-100 text-green-800" 
                                                            : "bg-red-100 text-red-800"
                                                    }`}>
                                                        {row.original.status === true || row.original.status === "active" ? "Active" : "Inactive"}
                                                    </span>
                                                </div>
                                            </div>
                                            {row.original.url && (
                                                <div>
                                                    <label className="font-semibold">URL:</label>
                                                    <p className="break-all">{row.original.url}</p>
                                                </div>
                                            )}
                                            {row.original.image && (
                                                <div>
                                                    <label className="font-semibold">Image:</label>
                                                    <div className="mt-2">
                                                        <Image 
                                                            src={row.original.image} 
                                                            alt="banner" 
                                                            width={500} 
                                                            height={120} 
                                                            className="rounded border max-w-full h-auto"
                                                            style={{minWidth: '490px', maxWidth: '510px', minHeight: '110px', maxHeight: '125px'}}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </TooltipTrigger>
                            <TooltipContent>View Details</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                   
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button onClick={() => {
                                    setBannerToEdit(row.original);
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                                    className="text-primary duration-300 cursor-pointer hover:text-blue-800">
                                    <Pencil size={18} />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>Edit</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <button className="text-red-600 cursor-pointer hover:text-red-800">
                                            <Trash2 size={18} />
                                        </button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Delete Banner</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to delete this banner? This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction 
                                                onClick={() => handleDelete(row.original._id)}
                                                className="bg-red-600 hover:bg-red-700"
                                            >
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </TooltipTrigger>
                            <TooltipContent>Delete</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            ),
            size: 150,
        }
    ], [setBannerToEdit]);

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

    if (loading) return <div className="flex justify-center items-center min-h-[200px]">Loading banners...</div>;
    if (error) return <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>;

    return (
        <DataGrid table={table} recordCount={filteredData?.length || 0}>
            <Card>
                <CardHeader className="py-3.5">
                    <CardTitle>Banners</CardTitle>
                    <CardToolbar className="relative">
                        <Search className="absolute start-2 text-primary top-1/2 -translate-y-1/2" />
                        <Input
                            placeholder="Search banners..."
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