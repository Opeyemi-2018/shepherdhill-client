"use client";

import StatCard from "@/components/Cards";
import DateTimeDisplay from "@/components/DateTime";
import Headercontent from "@/components/Headercontent";
import { FaUsers } from "react-icons/fa6";
import { MdOutlinePayments } from "react-icons/md";
import { Loader2 } from "lucide-react"; // Import Loader

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
import PaymentHistory from "../payment-history/page";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "sonner";

interface DashboardData {
  company_name: string;
  active_staff: number;
  total_payment: number;
  active_subscription: string;
  validity_period: string;
  next_payment_date: string;
}

const Overview = () => {
  const { user, token } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState<number | null>(null);

  const {
    data: subscriptionData,
    isLoading: isLoadingSubscriptions,
    error: subscriptionError,
  } = useSubscription();

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) return;
      try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/client/dashboard`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

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
              // Redirect back to your verification page after payment
              callback_url: `${window.location.origin}/dashboard/payment-verify`,
            }),
          }
      );

      const result = await response.json();

      if (result.status && result.authorization_url) {
        toast.success("Redirecting to payment gateway...");
        // Redirect user to SaySwitch
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
                    Active Subscription
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

                {/* Next Payment Card */}
                <div className="bg-white dark:bg-black shadow-lg rounded-lg flex flex-col justify-center p-3">
                  <CardDescription className="text-[14px] text-[#979797] font-regular mb-1">
                    Next Payment Date
                  </CardDescription>
                  <h2 className="text-[16px] text-[#3A3A3A] font-bold dark:text-white mb-2">
                    {isLoadingSubscriptions ? "Loading..." : subscriptionData?.cards?.next_payment_date || "N/A"}
                  </h2>

                  {/* Pay Next Bill Button */}
                  <Button
                      size="sm"
                      disabled={isProcessingPayment !== null || isLoadingSubscriptions}
                      // Finds the first unpaid item to pay, or defaults to first item
                      onClick={() => {
                        const nextUnpaid = subscriptionData?.items?.data?.find((i: any) => i.status !== 'paid');
                        if(nextUnpaid) handlePayment(nextUnpaid.id);
                        else toast.info("No pending payments found.");
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

            {/* Table */}
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

                              {/* Action Cell: Pay Now or Download */}
                              <TableCell>
                                {item.status !== "paid" ? (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={isProcessingPayment === item.id}
                                        onClick={() => handlePayment(item.id)}
                                        className="text-[#E89500] border-[#E89500] hover:bg-[#E89500] hover:text-white transition-colors"
                                    >
                                      {isProcessingPayment === item.id ? (
                                          <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : "Pay Now"}
                                    </Button>
                                ) : (
                                    <Button variant="outline" size="sm">
                                      Download
                                    </Button>
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
      </div>
  );
};

export default Overview;