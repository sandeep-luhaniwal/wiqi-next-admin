'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { Eye, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardFooter,
    CardHeader,
    CardTable,
    CardTitle,
    CardToolbar,
} from '@/components/ui/card';
import { DataGrid } from '@/components/ui/data-grid';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import { DataGridTable } from '@/components/ui/data-grid-table';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

const GetUserTable = () => {
    const router = useRouter();

    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [sorting, setSorting] = useState([{ id: 'firstName', desc: false }]);
    const [searchQuery, setSearchQuery] = useState('');

    // ✅ Fetch users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}api/admin/getUser?limit=10000`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                const data = await res.json();

                if (data.success) {
                    const cleanUsers = data.data.users.map((u) => ({
                        id: u._id,
                        firstName: u.firstName,
                        lastName: u.lastName,
                        userName: u.userName,
                        email: u.email,
                        phone: u.phone,
                        image: u.image,
                        block: u.block ?? false,
                    }));
                    setUsers(cleanUsers);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    // ✅ Search filter
    const filteredData = useMemo(() => {
        if (!searchQuery) return users;
        return users.filter(
            (u) =>
                u.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (u.phone ? String(u.phone).includes(searchQuery) : false)
        );
    }, [searchQuery, users]);

    const columns = useMemo(
        () => [
            {
                id: 'firstName',
                accessorFn: (row) => row.firstName,
                header: () => <span className="font-bold">First Name</span>,
                cell: ({ row }) => row.original.firstName,
                enableSorting: false,
                size: 150,
            },
            {
                id: 'lastName',
                accessorFn: (row) => row.lastName,
                header: () => <span className="font-bold">Last Name</span>,
                cell: ({ row }) => row.original.lastName,
                enableSorting: false,
                size: 150,
            },
            {
                id: 'userName',
                accessorFn: (row) => row.userName,
                header: () => <span className="font-bold">Username</span>,
                cell: ({ row }) => row.original.userName,
                enableSorting: false,
                size: 150,
            },
            {
                id: 'email',
                accessorFn: (row) => row.email,
                header: () => <span className="font-bold">Email</span>,
                cell: ({ row }) => row.original.email,
                enableSorting: false,
                size: 250,
            },
            {
                id: 'phone',
                accessorFn: (row) => row.phone,
                header: () => <span className="font-bold">Phone</span>,
                cell: ({ row }) => row.original.phone || 'N/A',
                enableSorting: false,
                size: 150,
            },
            {
                id: 'image',
                accessorFn: (row) => row.image,
                header: () => <span className="font-bold">Image</span>,
                cell: ({ row }) =>
                    row.original.image ? (
                        <img
                            src={`${row.original.image}`}
                            alt={`${row.original.firstName} ${row.original.lastName}`}
                            className="w-8 h-8 rounded-full object-cover object-center border"
                        />
                    ) : (
                        <span className="text-gray-400 text-sm">No Image</span>
                    ),
                size: 100,
            },
            {
                id: 'actions',
                header: () => <span className="font-bold">Details</span>,
                cell: ({ row }) => (
                    <button
                        onClick={() => router.push(`/admin/user/${row.original.id}`)}
                        className="flex justify-center w-full cursor-pointer text-primary hover:underline"
                    >
                        <Eye className="h-4 w-4" />
                    </button>
                ),
                size: 80,
            },
        ],
        [router]
    );



    const table = useReactTable({
        columns,
        data: filteredData,
        pageCount: Math.ceil((filteredData?.length || 0) / pagination.pageSize),
        getRowId: (row) => String(row.id),
        state: {
            pagination,
            sorting,
        },
        columnResizeMode: 'onChange',
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <DataGrid
            table={table}
            recordCount={filteredData?.length || 0}
            tableLayout={{
                columnsPinnable: true,
                columnsMovable: true,
                columnsVisibility: true,
                rowBorder: true,
            }}
        >
            <Card>
                <CardHeader className="py-3.5">
                    <CardTitle>Users</CardTitle>
                    <CardToolbar className="relative">
                        <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />
                        <Input
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="ps-9 max-w-[200px] w-full"
                        />
                        {searchQuery.length > 0 && (
                            <Button
                                mode="icon"
                                variant="ghost"
                                className="absolute end-1.5 top-1/2 -translate-y-1/2 h-6 w-6"
                                onClick={() => setSearchQuery('')}
                            >
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
};

export default GetUserTable;
