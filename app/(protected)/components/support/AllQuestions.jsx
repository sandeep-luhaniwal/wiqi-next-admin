"use client";

import { useEffect, useMemo, useState } from "react";
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel } from "@tanstack/react-table";
import { Search, X, MessageSquare, Mail, User, Phone, ExternalLink, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardToolbar, CardTable, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DataGrid } from "@/components/ui/data-grid";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuestionsThunk } from "@/store/slices/supportSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AllQuestions() {
    const dispatch = useDispatch();
    const { questions, loading, error } = useSelector((state) => state.support);
    
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedQuestion, setSelectedQuestion] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        dispatch(fetchQuestionsThunk(token));
    }, [dispatch]);

    const filteredData = useMemo(() => {
        if (!searchQuery) return questions;
        const q = searchQuery.toLowerCase();
        return questions.filter(item =>
            item.question?.toLowerCase().includes(q) ||
            item.userId?.firstName?.toLowerCase().includes(q) ||
            item.userId?.lastName?.toLowerCase().includes(q) ||
            item.userId?.email?.toLowerCase().includes(q) ||
            item.userId?.userName?.toLowerCase().includes(q)
        );
    }, [searchQuery, questions]);

    const columns = useMemo(() => [
        {
            id: "user",
            accessorFn: (row) => `${row.userId?.firstName} ${row.userId?.lastName}`,
            header: () => <span className="font-bold text-gray-700">User</span>,
            cell: ({ row }) => (
                <Link 
                    href={`/user/${row.original.userId?._id}`}
                    className="flex items-center gap-3 py-1 group hover:bg-slate-50 rounded-lg transition-colors p-1 pr-4"
                >
                    <Avatar className="h-10 w-10 border-2 border-primary/10 rounded-full group-hover:border-primary/30 transition-all">
                        <AvatarImage src={row.original.userId?.image} alt={row.original.userId?.userName} />
                        <AvatarFallback className="bg-primary/5 text-primary">
                            <User size={18} />
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-900 leading-tight group-hover:text-primary transition-colors flex items-center gap-1">
                            {row.original.userId?.firstName} {row.original.userId?.lastName}
                            <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </span>
                        <span className="text-xs text-primary font-medium">@{row.original.userId?.userName}</span>
                    </div>
                </Link>
            ),
            size: 220,
        },
        {
            id: "contact",
            accessorFn: (row) => row.userId?.email,
            header: () => <span className="font-bold text-gray-700">Contact Info</span>,
            cell: ({ row }) => (
                <div className="flex flex-col gap-0.5 text-sm">
                    <div className="flex items-center gap-1.5 text-gray-600">
                        <Mail size={14} className="text-primary/60" />
                        <span className="truncate max-w-[180px]">{row.original.userId?.email || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-600">
                        <Phone size={14} className="text-primary/60" />
                        <span>{row.original.userId?.phone || "N/A"}</span>
                    </div>
                </div>
            ),
            size: 220,
        },
        {
            id: "question",
            accessorFn: (row) => row.question,
            header: () => <span className="font-bold text-gray-700">Question</span>,
            cell: ({ row }) => (
                <div 
                    className="bg-gray-50 p-3 rounded-xl border border-gray-100 max-w-[400px] cursor-pointer hover:bg-gray-100/80 transition-all active:scale-[0.98]"
                    onClick={() => setSelectedQuestion(row.original)}
                >
                    <p className="text-gray-800 text-sm font-medium leading-relaxed italic line-clamp-2">
                        "{row.original.question}"
                    </p>
                </div>
            ),
            size: 400,
        },
        {
            id: "createdAt",
            accessorFn: (row) => row.createdAt,
            header: () => <span className="font-bold text-gray-700">Submitted At</span>,
            cell: ({ row }) => (
                <div className="flex flex-col text-sm">
                    <span className="font-semibold text-gray-700">
                        {row.original.createdAt ? new Date(row.original.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        }) : "N/A"}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">
                         {row.original.createdAt ? new Date(row.original.createdAt).toLocaleTimeString(undefined, {
                            hour: '2-digit',
                            minute: '2-digit'
                        }) : ""}
                    </span>
                </div>
            ),
            size: 150,
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

    if (loading && questions.length === 0) return <div className="p-10 text-center text-gray-400">Loading support questions...</div>;
    if (error) return <div className="p-10 text-center text-red-600">{error}</div>;

    return (
        <>
            <DataGrid table={table} recordCount={filteredData?.length || 0}>
                <Card>
                    <CardHeader className="py-3.5">
                        <CardTitle className="flex items-center gap-2">
                            <MessageSquare className="text-primary w-5 h-5" />
                            Help & Support Questions
                        </CardTitle>
                        <CardToolbar className="relative">
                            <Search className="absolute start-2 text-primary top-1/2 -translate-y-1/2" />
                            <Input
                                placeholder="Search questions or users..."
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
            </DataGrid>

            {/* Question Details Popup */}
            <Dialog open={!!selectedQuestion} onOpenChange={(open) => !open && setSelectedQuestion(null)}>
                <DialogContent className="w-[95vw] sm:max-w-2xl bg-white/95 backdrop-blur-xl border-none shadow-2xl rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-8 overflow-y-auto max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl sm:text-2xl font-black text-slate-900">
                            <MessageSquare className="text-primary h-5 w-5 sm:h-6 sm:w-6" /> Support
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium text-xs sm:text-sm">
                            Submitted by {selectedQuestion?.userId?.firstName} {selectedQuestion?.userId?.lastName}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 sm:space-y-6 pt-2 sm:pt-4">
                        <div className="bg-slate-50 p-4 sm:p-6 rounded-[1rem] sm:rounded-[1.5rem] border border-slate-100">
                            <p className="text-slate-800 text-base sm:text-lg leading-relaxed font-medium italic">
                                "{selectedQuestion?.question}"
                            </p>
                        </div>

                        <Separator className="bg-slate-100" />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div className="flex items-center gap-3 bg-slate-50/50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-100">
                                <Calendar className="text-primary w-4 h-4 sm:w-5 sm:h-5" />
                                <div className="flex flex-col">
                                    <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400">Date</span>
                                    <span className="text-xs sm:text-sm font-bold text-slate-700">
                                        {selectedQuestion?.createdAt && new Date(selectedQuestion.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-slate-50/50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-100">
                                <Clock className="text-primary w-4 h-4 sm:w-5 sm:h-5" />
                                <div className="flex flex-col">
                                    <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400">Time</span>
                                    <span className="text-xs sm:text-sm font-bold text-slate-700">
                                        {selectedQuestion?.createdAt && new Date(selectedQuestion.createdAt).toLocaleTimeString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 pt-2 sm:pt-4">
                            <Button 
                                variant="outline" 
                                className="order-2 sm:order-1 rounded-xl h-11 sm:h-12 font-bold border-slate-200"
                                onClick={() => setSelectedQuestion(null)}
                            >
                                Close
                            </Button>
                            <Button asChild className="order-1 sm:order-2 rounded-xl h-11 sm:h-12 font-bold shadow-lg shadow-primary/10">
                                <Link href={`/user/${selectedQuestion?.userId?._id}`}>
                                    View User Profile
                                </Link>
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
