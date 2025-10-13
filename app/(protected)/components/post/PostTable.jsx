'use client';

import { useEffect, useMemo, useState } from "react";
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel } from "@tanstack/react-table";
import { Eye, Trash2, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardToolbar, CardTable, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DataGrid } from "@/components/ui/data-grid";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { getPosts } from "@/app/api/getuserdetails/userdetails";
import Image from "next/image";


export default function PostTable() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [refreshFlag, setRefreshFlag] = useState(false);

    useEffect(() => {
        const fetchPostsData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                const data = await getPosts(token);
                setPosts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPostsData();
    }, [refreshFlag]);

    const filteredData = useMemo(() => {
        if (!searchQuery) return posts;
        return posts.filter(
            post =>
                post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.user?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.user?.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, posts]);

    const columns = useMemo(() => [
        {
            id: "image",
            accessorFn: row => row.image,
            header: () => <span className="font-bold">Image</span>,
            cell: ({ row }) =>
                row.original.image ? (
                    <Image width={48} height={48} src={row.original.image} alt={row.original.title} className="w-12 h-12 rounded object-cover border" />
                ) : (
                    <Image src={'/media/images/svg/userprofile.svg'} width={48} height={48} alt='no img found' />
                ),
            size: 100,
        },
        {
            id: "title",
            accessorFn: row => row.title,
            header: () => <span className="font-bold">Title</span>,
            cell: ({ row }) => row.original.title,
            size: 200,
        },
        {
            id: "type",
            accessorFn: row => row.type,
            header: () => <span className="font-bold">Type</span>,
            cell: ({ row }) => <span className="capitalize">{row.original.type}</span>,
            size: 100,
        },
        {
            id: "view",
            accessorFn: row => row.view,
            header: () => <span className="font-bold">Views</span>,
            cell: ({ row }) => row.original.view,
            size: 80,
        },
        {
            id: "user",
            accessorFn: row => row.user?.firstName,
            header: () => <span className="font-bold">User</span>,
            cell: ({ row }) => `${row.original.user?.firstName || ""} ${row.original.user?.lastName || ""}`,
            size: 150,
        },
        {
            id: "createdAt",
            accessorFn: row => row.createdAt,
            header: () => <span className="font-bold">Created At</span>,
            cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
            size: 120,
        },
        {
            id: "actions",
            header: () => <span className="font-bold block text-right">Actions</span>,
            cell: ({ row }) => (
                <div className="flex justify-end gap-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button className="text-primary hover:text-blue-800">
                                    <Eye size={16} />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>View Post</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button className="text-red-600 hover:text-red-800">
                                    <Trash2 size={16} />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>Delete Post</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            ),
            size: 100,
        },
    ], []);

    const table = useReactTable({
        columns,
        data: filteredData,
        pageCount: Math.ceil(filteredData?.length / pagination.pageSize),
        getRowId: (row, index) => row._id ? String(row._id) : String(index),
        state: { pagination, sorting },
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        columnResizeMode: "onChange",
    });

    if (loading) return <div className="flex justify-center items-center min-h-[200px]">Loading posts...</div>;
    if (error) return <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>;

    return (
        <DataGrid table={table} recordCount={filteredData?.length || 0}>
            <Card>
                <CardHeader className="py-3.5">
                    <CardTitle>Posts</CardTitle>
                    <CardToolbar className="relative">
                        <Search className="absolute start-2 top-1/2 -translate-y-1/2 text-primary" />
                        <Input
                            placeholder="Search posts..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="ps-9 max-w-[300px] w-full"
                        />
                        {searchQuery && (
                            <Button variant="ghost" className="absolute end-1.5 top-1/2 -translate-y-1/2 h-6 w-6" onClick={() => setSearchQuery("")}>
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
