"use client";

import { useEffect, useState, useCallback } from "react";
import Headercontent from "@/components/Headercontent";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
// 1. IMPORT EYE ICON
import { Loader2, Search, FilterX, ChevronLeft, ChevronRight, Eye } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// 2. IMPORT SHADCN DIALOG COMPONENTS
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

// 3. UPDATED INTERFACE TO MATCH YOUR API RESPONSE
interface AuditLog {
    id: number;
    user_id: string;
    user_name: string;
    user_email: string;
    user_role: string;
    action_type: string;
    feature: string;
    target: string;
    description: string;
    ip_address: string;
    user_agent: string;
    old_values: any | null;
    new_values: any | null;
    status: string;
    created_at: string;
    updated_at: string;
}

interface PaginationData {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
}

const AuditLogs = () => {
    const { token } = useAuth();

    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pagination, setPagination] = useState<PaginationData | null>(null);

    // Filter States
    const [search, setSearch] = useState("");
    const [actionType, setActionType] = useState("all");
    const [feature, setFeature] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [page, setPage] = useState(1);

    // 4. MODAL STATES
    const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchLogs = useCallback(async () => {
        if (!token) return;
        setIsLoading(true);

        try {
            const params = new URLSearchParams({
                page: page.toString(),
                per_page: "15",
            });

            if (search) params.append("search", search);
            if (actionType !== "all") params.append("action_type", actionType);
            if (feature !== "all") params.append("feature", feature);
            if (startDate) params.append("start_date", startDate);
            if (endDate) params.append("end_date", endDate);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/audit-log?${params.toString()}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );

            const result = await response.json();

            if (response.ok && result.success) {
                setLogs(result.data);
                setPagination(result.pagination);
            } else {
                toast.error("Failed to fetch audit logs.");
            }
        } catch (error) {
            console.error("Audit log fetch error:", error);
            toast.error("An error occurred while fetching data.");
        } finally {
            setIsLoading(false);
        }
    }, [token, page, search, actionType, feature, startDate, endDate]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchLogs();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [fetchLogs]);

    const clearFilters = () => {
        setSearch("");
        setActionType("all");
        setFeature("all");
        setStartDate("");
        setEndDate("");
        setPage(1);
    };

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getActionBadgeStyle = (type: string) => {
        switch (type?.toLowerCase()) {
            case "create":
            case "created": return "text-green-600 bg-green-100 border-green-200 dark:bg-green-900/30 dark:border-green-800";
            case "update":
            case "updated": return "text-blue-600 bg-blue-100 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800";
            case "delete":
            case "deleted": return "text-red-600 bg-red-100 border-red-200 dark:bg-red-900/30 dark:border-red-800";
            case "logged": return "text-purple-600 bg-purple-100 border-purple-200 dark:bg-purple-900/30 dark:border-purple-800";
            default: return "text-gray-600 bg-gray-100 border-gray-200 dark:bg-gray-800 dark:border-gray-700";
        }
    };

    // 5. ACTION HANDLER FOR MODAL
    const handleViewDetails = (log: AuditLog) => {
        setSelectedLog(log);
        setIsModalOpen(true);
    };

    return (
        <div className="mt-10">
            <div className="flex items-center justify-between mb-6">
                <Headercontent
                    title="Audit Logs"
                    subTitle="Track your account activity"
                    description="View a complete history of actions taken on your account."
                />
            </div>

            <Card className="border-none bg-primary-foreground shadow-lg">
                <CardHeader className="px-6 py-4 border-b border-muted">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
                        <div className="lg:col-span-2">
                            <label className="text-xs text-[#979797] mb-1 block">Search</label>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#979797]" />
                                <Input
                                    placeholder="Search logs..."
                                    className="pl-9 bg-background"
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        setPage(1);
                                    }}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-[#979797] mb-1 block">Action Type</label>
                            <Select value={actionType} onValueChange={(val) => { setActionType(val); setPage(1); }}>
                                <SelectTrigger className="bg-background">
                                    <SelectValue placeholder="All Actions" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Actions</SelectItem>
                                    <SelectItem value="created">Created</SelectItem>
                                    <SelectItem value="updated">Updated</SelectItem>
                                    <SelectItem value="deleted">Deleted</SelectItem>
                                    <SelectItem value="viewed">Viewed</SelectItem>
                                    <SelectItem value="logged">Logged In</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="text-xs text-[#979797] mb-1 block">Start Date</label>
                            <Input
                                type="date"
                                className="bg-background"
                                value={startDate}
                                onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
                            />
                        </div>

                        <div>
                            <label className="text-xs text-[#979797] mb-1 block">End Date</label>
                            <Input
                                type="date"
                                className="bg-background"
                                value={endDate}
                                onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
                            />
                        </div>

                        <div>
                            <Button
                                variant="outline"
                                onClick={clearFilters}
                                className="w-full flex items-center gap-2 text-[#979797]"
                            >
                                <FilterX className="h-4 w-4" /> Clear
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <div className="w-full overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50 text-[#3A3A3A]/50 text-[12px] font-medium border-b">
                                    <TableHead className="pl-6 py-4">Date & Time</TableHead>
                                    <TableHead>Action</TableHead>
                                    <TableHead>Feature</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>IP Address</TableHead>
                                    <TableHead className="text-right pr-6">Details</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-48 text-center">
                                            <div className="flex flex-col items-center justify-center text-[#979797]">
                                                <Loader2 className="h-8 w-8 animate-spin mb-2 text-[#FAB435]" />
                                                <p>Loading activity logs...</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : logs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-48 text-center text-[#979797]">
                                            No audit logs found matching your filters.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    logs.map((log) => (
                                        <TableRow key={log.id} className="border-b transition-colors hover:bg-muted/50">
                                            <TableCell className="pl-6 py-4 text-[13px] text-[#3A3A3A] dark:text-[#979797] whitespace-nowrap">
                                                {formatDate(log.created_at)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={`capitalize ${getActionBadgeStyle(log.action_type)}`}>
                                                    {log.action_type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-[13px] text-[#3A3A3A] dark:text-[#979797] capitalize">
                                                {log.feature?.replace(/_/g, " ")}
                                            </TableCell>
                                            <TableCell className="text-[13px] text-[#3A3A3A] dark:text-[#979797] max-w-[250px] truncate" title={log.description}>
                                                {log.description}
                                            </TableCell>
                                            <TableCell className="text-[13px] text-[#979797]">
                                                {log.ip_address || "N/A"}
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                {/* 6. VIEW DETAILS BUTTON */}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleViewDetails(log)}
                                                    className="h-8 w-8 p-0 text-[#E89500] hover:bg-[#FAB435]/20 hover:text-[#E89500]"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>

                {pagination && pagination.total > 0 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-muted bg-muted/20">
                        <p className="text-sm text-[#979797]">
                            Showing <span className="font-medium text-[#3A3A3A] dark:text-white">{pagination.from}</span> to <span className="font-medium text-[#3A3A3A] dark:text-white">{pagination.to}</span> of{" "}
                            <span className="font-medium text-[#3A3A3A] dark:text-white">{pagination.total}</span> entries
                        </p>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1 || isLoading}
                                className="h-8 w-8 p-0"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <div className="text-sm font-medium px-2 text-[#3A3A3A] dark:text-white">
                                Page {page} of {pagination.last_page}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.min(pagination.last_page, p + 1))}
                                disabled={page === pagination.last_page || isLoading}
                                className="h-8 w-8 p-0"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </Card>

            {/* 7. THE DIALOG/MODAL COMPONENT */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Audit Log Details</DialogTitle>
                        <DialogDescription>
                            Comprehensive breakdown of the recorded action.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedLog && (
                        <div className="space-y-6 py-4">
                            {/* General Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-lg border border-border">
                                <div><span className="text-[#979797] block text-xs uppercase mb-1">Date & Time</span> <span className="font-medium">{formatDate(selectedLog.created_at)}</span></div>
                                <div><span className="text-[#979797] block text-xs uppercase mb-1">IP Address</span> <span className="font-medium">{selectedLog.ip_address || "N/A"}</span></div>
                                <div><span className="text-[#979797] block text-xs uppercase mb-1">Action Type</span> <Badge variant="outline" className={`mt-1 capitalize ${getActionBadgeStyle(selectedLog.action_type)}`}>{selectedLog.action_type}</Badge></div>
                                <div><span className="text-[#979797] block text-xs uppercase mb-1">Status</span> <span className="font-medium capitalize text-[#5ECF53]">{selectedLog.status}</span></div>
                                <div><span className="text-[#979797] block text-xs uppercase mb-1">Feature</span> <span className="font-medium">{selectedLog.feature}</span></div>
                                <div><span className="text-[#979797] block text-xs uppercase mb-1">Target</span> <span className="font-medium">{selectedLog.target}</span></div>
                            </div>

                            {/* Descriptions & User Agent */}
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-semibold mb-2">Description</h4>
                                    <p className="text-sm p-3 bg-muted rounded-md text-[#3A3A3A] dark:text-gray-300">
                                        {selectedLog.description}
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold mb-2">User Agent</h4>
                                    <p className="text-xs p-3 bg-muted rounded-md text-[#979797] break-all font-mono">
                                        {selectedLog.user_agent}
                                    </p>
                                </div>
                            </div>

                            {/* Conditional JSON Render for Values */}
                            {(selectedLog.old_values || selectedLog.new_values) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                                    {selectedLog.old_values && (
                                        <div>
                                            <h4 className="text-sm font-semibold mb-2 text-red-500">Old Values</h4>
                                            <pre className="text-xs p-3 bg-red-500/10 border border-red-500/20 rounded-md overflow-x-auto text-[#3A3A3A] dark:text-gray-300">
                                                {JSON.stringify(selectedLog.old_values, null, 2)}
                                            </pre>
                                        </div>
                                    )}

                                    {selectedLog.new_values && (
                                        <div className={!selectedLog.old_values ? "md:col-span-2" : ""}>
                                            <h4 className="text-sm font-semibold mb-2 text-green-500">New Values</h4>
                                            <pre className="text-xs p-3 bg-green-500/10 border border-green-500/20 rounded-md overflow-x-auto text-[#3A3A3A] dark:text-gray-300">
                                                {JSON.stringify(selectedLog.new_values, null, 2)}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AuditLogs;