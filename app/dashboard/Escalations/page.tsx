"use client";

import { useState, useEffect, useRef } from "react"; // Added useRef
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";
import { Loader2, MessageSquare, Paperclip, Send, FileText, X } from "lucide-react"; // Added X
import { toast } from "sonner";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// ... (other imports remain same)
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

// --- Interfaces ---
// ... (Interfaces remain same)

interface User { id: number; name: string; }
interface Reply { id: number; message: string; created_at: string; user: User; attachment?: string; }
interface Employee { id: number; name: string; email: string; phone: string; }
interface Against { id: number; employee: Employee; }
interface Complaint { id: number; title: string; description: string; status: string; priority: string; complaint_date: string; created_at: string; attachment?: string; complaint_against: string; against?: Against; replies?: Reply[]; }

const EscalationList = () => {
    const { token, user } = useAuth();
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [replyMessage, setReplyMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [loadingDetails, setLoadingDetails] = useState(false);

    // --- New State for Attachment ---
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchComplaints = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/client/all-escalations`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setComplaints(data.data.data);
            }
        } catch (error) {
            console.error("Fetch error", error);
            toast.error("Failed to fetch escalations");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchComplaints();
    }, [token]);

    const openComplaint = async (id: number) => {
        setLoadingDetails(true);
        setIsSheetOpen(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/client/escalations/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setSelectedComplaint(data.data);
            }
        } catch (error) {
            toast.error("Failed to load conversation");
        } finally {
            setLoadingDetails(false);
        }
    };

    // --- Updated handleReply to support Files ---
    const handleReply = async () => {
        if (!replyMessage.trim() && !selectedFile) return;
        if (!selectedComplaint) return;

        setIsSending(true);
        try {
            const formData = new FormData();
            formData.append("message", replyMessage);
            if (selectedFile) {
                formData.append("attachment", selectedFile);
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/client/escalations/${selectedComplaint.id}/reply`, {
                method: "POST",
                headers: {
                    // Note: Do NOT set Content-Type header when sending FormData
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            const data = await res.json();
            if (data.success) {
                toast.success("Reply sent");
                setReplyMessage("");
                setSelectedFile(null); // Clear file
                openComplaint(selectedComplaint.id);
            }
        } catch (error) {
            toast.error("Failed to send reply");
        } finally {
            setIsSending(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800";
            case "resolved": return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800";
            case "closed": return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
            default: return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800";
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'high': return 'text-red-600 border-red-200 bg-red-50 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800';
            case 'medium': return 'text-orange-600 border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800';
            default: return 'text-gray-600 border-gray-200 bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
        }
    };

    const getImageUrl = (path?: string) => {
        if (!path) return null;
        if (path.startsWith("http")) return path;
        return `${process.env.NEXT_PUBLIC_API_URL}/storage/${path}`;
    };

    return (
        <div className="mt-10 space-y-6">
            {/* ... (Table and List Code remains same) */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">My Escalations</h1>
                    <p className="text-muted-foreground text-sm">Track and manage your submitted complaints</p>
                </div>
                <Button onClick={() => router.push("/dashboard/account-setting")} className="bg-[#FAB435] text-black hover:bg-[#E59300] dark:text-black font-medium">
                    + New Escalation
                </Button>
            </div>

            <Card className="border-none shadow-md bg-card">
                <CardContent className="p-0">
                    {loading ? (
                        <div className="p-16 text-center text-muted-foreground flex flex-col items-center">
                            <Loader2 className="h-8 w-8 animate-spin mb-2" />
                            Loading escalations...
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
                                    <TableHead className="w-[80px] text-muted-foreground">Ticket</TableHead>
                                    <TableHead className="text-muted-foreground">Date</TableHead>
                                    <TableHead className="text-muted-foreground">Type</TableHead>
                                    <TableHead className="text-muted-foreground">Staff Involved</TableHead>
                                    <TableHead className="text-muted-foreground">Attachment</TableHead>
                                    <TableHead className="text-muted-foreground">Priority</TableHead>
                                    <TableHead className="text-muted-foreground">Status</TableHead>
                                    <TableHead className="text-right text-muted-foreground">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {complaints.map((item) => (
                                    <TableRow key={item.id} className="hover:bg-muted/50 border-border">
                                        <TableCell className="font-medium text-foreground">
                                            #{item.id.toString().padStart(3, '0')}
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-muted-foreground">
                                                {item.complaint_date ? format(new Date(item.complaint_date), "MMM dd, yyyy") : "N/A"}
                                            </span>
                                        </TableCell>
                                        <TableCell className="font-medium text-foreground">{item.title}</TableCell>
                                        <TableCell>
                                            {item.against?.employee?.name ? (
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                                                            {item.against.employee.name.charAt(0).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-sm text-foreground">{item.against.employee.name}</span>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground italic">Unknown</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {item.attachment ? (
                                                <Link
                                                    href={getImageUrl(item.attachment) || "#"}
                                                    target="_blank"
                                                    className="inline-flex items-center gap-1 text-primary hover:underline text-xs"
                                                >
                                                    <Paperclip className="h-3 w-3" /> View
                                                </Link>
                                            ) : (
                                                <span className="text-muted-foreground text-xs">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`capitalize ${getPriorityColor(item.priority)}`}>
                                                {item.priority}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getStatusColor(item.status)} variant="outline">
                                                {item.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" onClick={() => openComplaint(item.id)} className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                                                <MessageSquare className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="w-[400px] sm:w-[540px] flex flex-col h-full border-l border-border bg-background">
                    <SheetHeader className="mb-4 pb-4 border-b border-border">
                        <div className="flex justify-between items-start">
                            <div>
                                <SheetTitle className="text-lg font-bold text-foreground">{selectedComplaint?.title || "Details"}</SheetTitle>
                                <SheetDescription className="mt-1 text-muted-foreground">
                                    Ticket #{selectedComplaint?.id} • {selectedComplaint?.complaint_date}
                                </SheetDescription>
                            </div>
                            {selectedComplaint && (
                                <Badge className={getStatusColor(selectedComplaint.status)} variant="outline">
                                    {selectedComplaint.status}
                                </Badge>
                            )}
                        </div>
                    </SheetHeader>

                    {loadingDetails ? (
                        <div className="flex-1 flex items-center justify-center">
                            <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
                        </div>
                    ) : (
                        <>
                            {/* Original Complaint Box */}
                            <div className="bg-muted/40 dark:bg-muted/10 p-4 rounded-lg mb-4 border border-border">
                                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Original Complaint</h4>
                                <p className="text-sm text-foreground leading-relaxed">
                                    {selectedComplaint?.description}
                                </p>
                                {selectedComplaint?.attachment && (
                                    <div className="mt-3 pt-3 border-t border-border">
                                        <Link
                                            href={getImageUrl(selectedComplaint.attachment) || "#"}
                                            target="_blank"
                                            className="inline-flex items-center gap-2 text-xs text-primary font-medium hover:underline"
                                        >
                                            <FileText className="h-3 w-3" /> View Attachment
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 flex flex-col overflow-hidden">
                                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Conversation</h4>
                                <ScrollArea className="flex-1 pr-4 -mr-4">
                                    <div className="space-y-4 pb-4">
                                        {selectedComplaint?.replies?.map((reply) => {
                                            const isMe = reply.user.id.toString() === user?.id?.toString();
                                            return (
                                                <div key={reply.id} className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""}`}>
                                                    <Avatar className="h-8 w-8 mt-1">
                                                        <AvatarFallback className={isMe ? "bg-[#FAB435] text-black" : "bg-muted text-muted-foreground"}>
                                                            {reply.user.name[0]}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                                                        isMe ? "bg-[#FAB435]/20 text-foreground dark:text-yellow-100 rounded-tr-none" : "bg-muted/50 border border-border text-foreground rounded-tl-none shadow-sm dark:bg-muted/20"
                                                    }`}>
                                                        <div className={`flex items-center gap-2 mb-1 ${isMe ? "justify-end" : ""}`}>
                                                            <span className="font-bold text-xs text-foreground">{reply.user.name}</span>
                                                            <span className="text-[10px] text-muted-foreground">
                                                                {format(new Date(reply.created_at), "HH:mm")}
                                                            </span>
                                                        </div>
                                                        <p className="leading-relaxed opacity-90">{reply.message}</p>
                                                        {/* --- Added View Attachment in Replies --- */}
                                                        {reply.attachment && (
                                                            <div className="mt-2 pt-2 border-t border-white/10">
                                                                <Link
                                                                    href={getImageUrl(reply.attachment) || "#"}
                                                                    target="_blank"
                                                                    className="flex items-center gap-1 text-[10px] underline"
                                                                >
                                                                    <Paperclip className="h-3 w-3" /> View File
                                                                </Link>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </ScrollArea>
                            </div>

                            {/* --- Enhanced Input Area with File Support --- */}
                            <SheetFooter className="mt-4 pt-4 border-t border-border bg-background flex-col gap-2">
                                {selectedFile && (
                                    <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-md text-xs w-full">
                                        <FileText className="h-3 w-3 text-primary" />
                                        <span className="flex-1 truncate">{selectedFile.name}</span>
                                        <button onClick={() => setSelectedFile(null)} className="text-muted-foreground hover:text-destructive">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                )}

                                <div className="flex w-full items-center gap-2">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                    />
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="shrink-0"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Paperclip className="h-4 w-4" />
                                    </Button>

                                    <Input
                                        placeholder="Type your reply..."
                                        value={replyMessage}
                                        onChange={(e) => setReplyMessage(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleReply()}
                                        className="flex-1 bg-background border-input text-foreground"
                                    />
                                    <Button size="icon" onClick={handleReply} disabled={isSending || (!replyMessage.trim() && !selectedFile)} className="bg-[#FAB435] text-black hover:bg-[#d49625]">
                                        {isSending ? <Loader2 className="animate-spin h-4 w-4" /> : <Send className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </SheetFooter>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default EscalationList;