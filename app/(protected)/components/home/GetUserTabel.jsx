'use client';

import { getUsers } from '@/app/api/getuserdetails/userdetails';
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
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import { DataGridTable } from '@/components/ui/data-grid-table';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { Eye, Search, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

const GetUserTable = () => {
    const router = useRouter();

    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [sorting, setSorting] = useState([{ id: 'firstName', desc: false }]);
    const [searchQuery, setSearchQuery] = useState('');

    // ✅ Fetch users using API helper
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const userData = await getUsers(token);
                setUsers(userData);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchData();
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
                        <Image width={48} height={48}
                            src={`${row.original.image}`}
                            alt={`${row.original.firstName} ${row.original.lastName}`}
                            className="w-12 h-12 rounded-full object-cover object-center border border-primary"
                        />
                    ) : (
                        // <span className="text-gray-400 text-sm">No Image</span>
                        <Image src={'/media/images/svg/userprofile.svg'} className='border rounded-full border-primary' width={48} height={48} alt='no img found' />
                    ),
                size: 100,
            },
            {
                id: 'actions',
                header: () => <span className="font-bold">Details</span>,
                cell: ({ row }) => (
                    <button
                        onClick={() => router.push(`/user/${row.original.id}`)}
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
