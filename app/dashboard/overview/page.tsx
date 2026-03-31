/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import StatCard from "@/components/Cards";
import DateTimeDisplay from "@/components/DateTime";
import Headercontent from "@/components/Headercontent";
import { FaUsers } from "react-icons/fa6";
import { MdOutlinePayments } from "react-icons/md";
import {
  Loader2,
  Download,
  UploadCloud,
  Landmark,
  Copy,
  CheckCircle2,
  FileText,
  Clock,
  Eye,
  X
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import PaymentHistory from "../payment-history/page";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "sonner";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface DashboardData {
  company_name: string;
  active_staff: number;
  total_payment: number;
  active_subscription: string;
  validity_period: string;
  next_payment_date: string;
  payment_rows?: any[];
}

const Overview = () => {
  const { user, token } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState<number | null>(null);
  const [isDownloading, setIsDownloading] = useState<number | null>(null);

  const {
    data: subscriptionData,
    isLoading: isLoadingSubscriptions,
    error: subscriptionError,
    updateFilters
  } = useSubscription();

  // --- MANUAL PAYMENT MODAL STATE ---
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isSubmittingManual, setIsSubmittingManual] = useState(false);
  const [selectedSubForManual, setSelectedSubForManual] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const [manualFormData, setManualFormData] = useState({
    payment_date: "",
    teller_reference: "",
    proof_of_payment: null as File | null,
  });

  // --- DOCUMENT PREVIEW MODAL STATE ---
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) return;
      try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/client/dashboard`,
            {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
            }
        );

        if (!response.ok) throw new Error("Failed to fetch dashboard data");

        const result = await response.json();
        if (result.status && result.data) {
          setDashboardData(result.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoadingDashboard(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  // --- ONLINE PAYMENT ---
  const handlePayment = async (subscriptionId: number) => {
    if (!subscriptionId) {
      toast.error("Invalid subscription selected");
      return;
    }

    setIsProcessingPayment(subscriptionId);
    try {
      const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/client/initialize`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              subscription_id: subscriptionId,
              callback_url: `${window.location.origin}/dashboard/payment-verify`,
            }),
          }
      );

      const result = await response.json();

      if (result.status && result.authorization_url) {
        toast.success("Redirecting to payment gateway...");
        window.location.href = result.authorization_url;
      } else {
        toast.error(result.message || "Could not initialize payment.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsProcessingPayment(null);
    }
  };

  // --- MANUAL PAYMENT LOGIC ---
  const openManualPaymentModal = (subscriptionId: number) => {
    setSelectedSubForManual(subscriptionId);
    setManualFormData({
      payment_date: new Date().toISOString().split('T')[0],
      teller_reference: "",
      proof_of_payment: null,
    });
    setCopied(false);
    setIsManualModalOpen(true);
  };

  const handleCopyAccount = () => {
    navigator.clipboard.writeText("0123456789");
    setCopied(true);
    toast.success("Account number copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSubForManual) return toast.error("No subscription selected.");
    if (!manualFormData.payment_date) return toast.error("Payment date is required.");
    if (!manualFormData.proof_of_payment) return toast.error("Please upload your proof of payment.");

    if (manualFormData.proof_of_payment.size > 2 * 1024 * 1024) {
      return toast.error("File size must be less than 2MB.");
    }

    setIsSubmittingManual(true);

    try {
      const formData = new FormData();
      formData.append("subscription_id", selectedSubForManual.toString());
      formData.append("payment_date", manualFormData.payment_date);
      if (manualFormData.teller_reference) {
        formData.append("teller_reference", manualFormData.teller_reference);
      }
      formData.append("proof_of_payment", manualFormData.proof_of_payment);

      const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/client/initialize/manual`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          }
      );

      const result = await response.json();

      if (response.ok && result.status) {
        toast.success(result.message || "Manual payment submitted successfully!");
        setIsManualModalOpen(false);
        if (updateFilters) updateFilters({});
      } else {
        toast.error(result.message || "Failed to submit manual payment.");
      }
    } catch (error) {
      console.error("Manual Payment Error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmittingManual(false);
    }
  };

  // --- OPEN DOCUMENT PREVIEW (PDF SUPPORTED) ---
  const openPreview = (url: string | undefined) => {
    if (!url) {
      toast.error("No document available to view.");
      return;
    }

    // Extract just the file path
    let filePath = url;
    if (url.includes('storage/')) {
      filePath = url.split('storage/').pop() || url;
    }

    // Construct exact custom URL
    const customUrl = `${process.env.NEXT_PUBLIC_API_URL}/storage/app/public/${filePath}`;
    setPreviewUrl(customUrl);
    setIsPreviewModalOpen(true);
  };

  // --- DOWNLOAD RECEIPT (GENERATED PDF) ---
  const handleDownloadReceipt = async (item: any) => {
    setIsDownloading(item.id);

    try {
      const doc = new jsPDF();
      const paymentRef = dashboardData?.payment_rows?.[0]?.reference || `REF-${Math.floor(Math.random() * 1000000)}`;
      const paymentDate = dashboardData?.payment_rows?.[0]?.date || new Date().toLocaleDateString();

      doc.setFontSize(20);
      doc.setTextColor(40, 40, 40);
      doc.text("Payment Receipt", 14, 22);

      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
      doc.text(`Company: ${dashboardData?.company_name || "N/A"}`, 14, 32);
      doc.text(`Reference: ${paymentRef}`, 14, 38);
      doc.text(`Date: ${paymentDate}`, 14, 44);

      autoTable(doc, {
        startY: 55,
        headStyles: { fillColor: [250, 180, 53] },
        head: [["Period", "Service", "Number of Staffs", "Equipments", "Status"]],
        body: [
          [
            item.period || "N/A",
            item.service || "N/A",
            item.number_of_staff || "0",
            item.equipments || "0",
            (item.status || "paid").toUpperCase()
          ],
        ],
      });

      const finalY = (doc as any).lastAutoTable.finalY || 60;
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text("Thank you for your business!", 14, finalY + 20);

      doc.save(`Receipt_${dashboardData?.company_name?.replace(/\s+/g, '_') || 'Payment'}.pdf`);
      toast.success("Receipt downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate receipt.");
    } finally {
      setIsDownloading(null);
    }
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <Headercontent
              title="Welcome "
              subTitle={user?.name || "Guest"}
              description="Start with a clear overview of what matters most"
          />
          <DateTimeDisplay />
        </div>

        <div className="flex items-center flex-col md:flex-row justify-between gap-4 pt-4">
          <StatCard
              icon={FaUsers}
              label="Active Staffs"
              value={isLoadingDashboard ? "Loading..." : formatNumber(dashboardData?.active_staff || 0)}
          />
          <StatCard
              icon={MdOutlinePayments}
              label="Total Payment"
              value={isLoadingDashboard ? "Loading..." : formatNumber(dashboardData?.total_payment || 0)}
          />
        </div>

        <div className="w-full mt-4">
          <Card className="border-none bg-primary-foreground shadow-lg">
            <CardHeader className="flex items-center justify-between px-6 ">
              <h1 className="text-[14px] font-bold text-[#3A3A3A] dark:text-white">
                Subscriptions
              </h1>
              <Button variant="outline" className="bg-[#FAB435]/30 text-[#E89500] border-none">
                See all
              </Button>
            </CardHeader>

            <CardHeader className="px-2 lg:px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-black shadow-lg rounded-lg flex flex-col justify-center p-3">
                  <CardDescription className="text-[14px] text-[#979797] font-regular mb-1">
                    Active Operative
                  </CardDescription>
                  <h2 className="text-[16px] text-[#3A3A3A] font-bold dark:text-white">
                    {isLoadingSubscriptions ? "Loading..." : subscriptionData?.cards?.active_plans || "N/A"}
                  </h2>
                </div>

                <div className="bg-white dark:bg-black shadow-lg rounded-lg flex flex-col justify-center p-3">
                  <CardDescription className="text-[14px] text-[#979797] font-regular mb-1">
                    Validity Period
                  </CardDescription>
                  <h2 className="text-[16px] text-[#3A3A3A] font-bold dark:text-white">
                    {isLoadingSubscriptions ? "Loading..." : subscriptionData?.cards?.validity_period || "N/A"}
                  </h2>
                </div>

                <div className="bg-white dark:bg-black shadow-lg rounded-lg flex flex-col justify-center p-3">
                  <CardDescription className="text-[14px] text-[#979797] font-regular mb-1">
                    Next Payment Date
                  </CardDescription>
                  <h2 className="text-[16px] text-[#3A3A3A] font-bold dark:text-white mb-2">
                    {isLoadingSubscriptions ? "Loading..." : subscriptionData?.cards?.next_payment_date || "N/A"}
                  </h2>

                  <Button
                      size="sm"
                      disabled={isProcessingPayment !== null || isLoadingSubscriptions}
                      onClick={() => {
                        // UPDATED: Finds the next unpaid item, ignoring pending items ONLY if they have proof of payment
                        const nextUnpaid = subscriptionData?.items?.data?.find(
                            (i: any) => i.status !== 'paid' && !(i.status === 'pending' && i.proof_of_payment)
                        );
                        if(nextUnpaid) {
                          handlePayment(nextUnpaid.id);
                        } else {
                          toast.info("No unpaid subscriptions found, or they are currently under review.");
                        }
                      }}
                      className="bg-[#FAB435]/30 text-[#E89500] lg:w-[45%] border-none hover:bg-[#FAB435]/50 transition-colors"
                  >
                    {isProcessingPayment && !subscriptionData?.items?.data?.find((i: any) => i.id === isProcessingPayment) ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : "Make Payment"}
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-2 lg:p-6">
              <div className="">
                {subscriptionError && (
                    <div className="text-red-500 text-center py-4">{subscriptionError}</div>
                )}

                {isLoadingSubscriptions ? (
                    <div className="text-center py-10"><p className="text-[#979797]">Loading subscriptions...</p></div>
                ) : subscriptionData?.items?.data?.length === 0 ? (
                    <div className="text-center py-10"><p className="text-[#979797]">No subscriptions found</p></div>
                ) : (
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50 text-[#3A3A3A]/50 text-[12px] font-medium">
                          <TableHead>Period</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead>Number of Staffs</TableHead>
                          <TableHead>Equipments</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {subscriptionData?.items?.data?.map((item: any, index: number) => (
                            <TableRow key={item.id || index}>
                              <TableCell className="font-medium text-[14px] text-[#3A3A3A] dark:text-[#979797]">{item.period || "N/A"}</TableCell>
                              <TableCell className="font-medium text-[14px] text-[#3A3A3A] dark:text-[#979797]">{item.service || "N/A"}</TableCell>
                              <TableCell className="font-medium text-[14px] text-[#3A3A3A] dark:text-[#979797]">{item.number_of_staff || 0}</TableCell>
                              <TableCell className="font-medium text-[14px] text-[#3A3A3A] dark:text-[#979797]">{item.equipments || 0}</TableCell>
                              <TableCell>
                                <Badge className={item.status === "paid" ? "text-[#5ECF53] bg-transparent" : "text-[#E89500] bg-transparent"}>
                                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${item.status === "paid" ? "bg-[#5ECF53]" : "bg-[#E89500]"}`} />
                                  {item.status || "N/A"}
                                </Badge>
                              </TableCell>

                              <TableCell>
                                {item.status?.toLowerCase() === "paid" ? (
                                    <div className="flex items-center gap-2">
                                      <Button
                                          variant="outline"
                                          size="sm"
                                          disabled={isDownloading === item.id}
                                          onClick={() => handleDownloadReceipt(item)}
                                          className="flex items-center gap-2"
                                      >
                                        {isDownloading === item.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Download className="h-4 w-4" />
                                        )}
                                        Receipt
                                      </Button>

                                      {item.proof_of_payment && (
                                          <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => openPreview(item.proof_of_payment)}
                                              className="text-gray-500 hover:text-blue-500"
                                              title="View Uploaded Document"
                                          >
                                            <Eye className="h-4 w-4" />
                                          </Button>
                                      )}
                                    </div>
                                ) : item.status?.toLowerCase() === "pending" && item.proof_of_payment ? (
                                    // UPDATED: Now requires `item.proof_of_payment` to be truthy to show "Under Review"
                                    <div className="flex items-center gap-2">
                                      <div className="flex items-center gap-2 text-[#E89500] bg-[#FAB435]/10 px-3 py-1.5 rounded-md w-fit text-sm font-medium border border-[#FAB435]/20">
                                        <Clock className="h-4 w-4" />
                                        Under Review
                                      </div>

                                      <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => openPreview(item.proof_of_payment)}
                                          className="text-gray-500 hover:text-[#E89500] bg-muted/50"
                                          title="View Submitted Proof"
                                      >
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                    </div>
                                ) : (
                                    // UPDATED: Fallback UI when unpaid, OR when pending but `proof_of_payment` is null
                                    <div className="flex items-center gap-2">
                                      <Button
                                          variant="outline"
                                          size="sm"
                                          disabled={isProcessingPayment === item.id}
                                          onClick={() => handlePayment(item.id)}
                                          className="text-[#E89500] border-[#E89500] hover:bg-[#E89500] hover:text-white transition-colors"
                                      >
                                        {isProcessingPayment === item.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : "Pay Online"}
                                      </Button>

                                      <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => openManualPaymentModal(item.id)}
                                          className="text-gray-500 hover:text-[#E89500]"
                                          title="Submit Transfer Proof"
                                      >
                                        <UploadCloud className="h-4 w-4" />
                                      </Button>
                                    </div>
                                )}
                              </TableCell>
                            </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <PaymentHistory />

        {/* --- MANUAL PAYMENT DIALOG --- */}
        <Dialog open={isManualModalOpen} onOpenChange={setIsManualModalOpen}>
          <DialogContent className="sm:max-w-[700px] md:max-w-[800px] p-0 overflow-hidden">
            <div className="p-6 border-b bg-muted/20">
              <DialogTitle className="text-xl flex items-center gap-2">
                <Landmark className="h-5 w-5 text-[#E89500]" />
                Manual Bank Transfer
              </DialogTitle>
              <DialogDescription className="mt-2">
                Please transfer your subscription fee to the account below, then upload your payment receipt to be verified.
              </DialogDescription>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              <div className="p-6 bg-muted/10 border-r md:border-b-0 border-b">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-4">
                  Company Bank Details
                </h3>

                <div className="space-y-4">
                  <div className="bg-white dark:bg-background border rounded-lg p-4 shadow-sm">
                    <p className="text-xs text-muted-foreground mb-1">Bank Name</p>
                    <p className="font-medium text-foreground">Guaranty Trust Bank (GTB)</p>
                  </div>

                  <div className="bg-white dark:bg-background border rounded-lg p-4 shadow-sm">
                    <p className="text-xs text-muted-foreground mb-1">Account Name</p>
                    <p className="font-medium text-foreground">Your Company Name Ltd</p>
                  </div>

                  <div className="bg-white dark:bg-background border rounded-lg p-4 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Account Number</p>
                      <p className="font-bold text-lg text-foreground tracking-widest">0123456789</p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCopyAccount}
                        className={copied ? "text-green-500" : "text-muted-foreground hover:text-[#E89500]"}
                    >
                      {copied ? <CheckCircle2 className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>
              </div>

              <form onSubmit={handleManualSubmit} className="p-6 flex flex-col justify-between">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="payment_date" className="text-sm font-medium">Date of Transfer</Label>
                    <Input
                        id="payment_date"
                        type="date"
                        required
                        max={new Date().toISOString().split("T")[0]}
                        value={manualFormData.payment_date}
                        onChange={(e) =>
                            setManualFormData({ ...manualFormData, payment_date: e.target.value })
                        }
                        className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="teller_reference" className="text-sm font-medium">Reference Number (Optional)</Label>
                    <Input
                        id="teller_reference"
                        placeholder="e.g. TRN-987654321"
                        value={manualFormData.teller_reference}
                        onChange={(e) =>
                            setManualFormData({ ...manualFormData, teller_reference: e.target.value })
                        }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Proof of Payment</Label>
                    <div className="relative border-2 border-dashed rounded-lg p-4 hover:bg-muted/50 transition-colors text-center">
                      <Input
                          id="proof_of_payment"
                          type="file"
                          accept=".jpg,.jpeg,.png,.pdf"
                          required
                          onChange={(e) =>
                              setManualFormData({
                                ...manualFormData,
                                proof_of_payment: e.target.files ? e.target.files[0] : null,
                              })
                          }
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />

                      <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
                        {manualFormData.proof_of_payment ? (
                            <>
                              <FileText className="h-8 w-8 text-[#E89500]" />
                              <p className="text-sm font-medium text-foreground truncate max-w-[200px]">
                                {manualFormData.proof_of_payment.name}
                              </p>
                              <p className="text-xs text-muted-foreground">Click to change file</p>
                            </>
                        ) : (
                            <>
                              <UploadCloud className="h-8 w-8 text-muted-foreground" />
                              <p className="text-sm font-medium text-foreground">Click or drag file to upload</p>
                              <p className="text-xs text-muted-foreground">JPEG, PNG, or PDF (Max 2MB)</p>
                            </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <DialogFooter className="pt-8">
                  <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsManualModalOpen(false)}
                      disabled={isSubmittingManual}
                      className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                      type="submit"
                      className="w-full sm:w-auto bg-[#FAB435] hover:bg-[#FAB435]/80 text-white"
                      disabled={isSubmittingManual}
                  >
                    {isSubmittingManual ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                    ) : (
                        "Submit Receipt"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </div>
          </DialogContent>
        </Dialog>

        {/* --- DOCUMENT PREVIEW DIALOG (NOW HANDLES PDFS) --- */}
        <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
          <DialogContent className="max-w-[80vw] h-[85vh] p-0 flex flex-col overflow-hidden bg-black/90 border-0">
            <div className="flex justify-between items-center p-4 bg-black/50 text-white">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#FAB435]" />
                Document Preview
              </h2>
              <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="text-white hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 w-full h-full relative flex items-center justify-center overflow-hidden p-4">
              {previewUrl && (
                  // Detect PDF by extension
                  previewUrl.toLowerCase().split('?')[0].endsWith('.pdf') ? (
                      <object
                          data={previewUrl}
                          type="application/pdf"
                          className="w-full h-full rounded bg-white"
                      >
                        <iframe
                            src={previewUrl}
                            className="w-full h-full rounded bg-white"
                            title="PDF Document Viewer"
                        />
                      </object>
                  ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                          src={previewUrl}
                          alt="Payment Proof"
                          className="max-w-full max-h-full object-contain rounded"
                      />
                  )
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
  );
};

export default Overview;