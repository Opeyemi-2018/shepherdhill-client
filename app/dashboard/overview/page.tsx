"use client";

import StatCard from "@/components/Cards";
import DateTimeDisplay from "@/components/DateTime";
import Headercontent from "@/components/Headercontent";
import { FaUsers } from "react-icons/fa6";
import { MdOutlinePayments } from "react-icons/md";

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

interface DashboardData {
  company_name: string;
  active_staff: number;
  total_payment: number;
  active_subscription: string;
  validity_period: string;
  next_payment_date: string;
}

const Overview = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);

  const {
    data: subscriptionData,
    isLoading: isLoadingSubscriptions,
    error: subscriptionError,
  } = useSubscription();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/client/dashboard`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            credentials: "include",
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
  }, []);

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
          value={
            isLoadingDashboard
              ? "Loading..."
              : formatNumber(dashboardData?.active_staff || 0)
          }
        />
        <StatCard
          icon={MdOutlinePayments}
          label="Total Payment"
          value={
            isLoadingDashboard
              ? "Loading..."
              : formatNumber(dashboardData?.total_payment || 0)
          }
        />
      </div>

      <div className="w-full mt-7 space-y-6">
        <Card className="border-none bg-primary-foreground shadow-lg">
          <CardHeader className="flex items-center justify-between p-2 lg:p-6">
            <h1 className="text-[14px] font-bold text-[#3A3A3A] dark:text-white">
              Subscriptions
            </h1>
            <Button
              variant="outline"
              className="bg-[#FAB435]/30 text-[#E89500] border-none"
            >
              See all
            </Button>
          </CardHeader>

          <CardHeader className="p-2 lg:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-black shadow-lg rounded-lg flex flex-col justify-center p-3">
                <CardDescription className="text-[14px] text-[#979797] font-regular mb-1">
                  Active Subscription
                </CardDescription>
                <h2 className="text-[16px] text-[#3A3A3A] font-bold dark:text-white">
                  {isLoadingSubscriptions
                    ? "Loading..."
                    : subscriptionData?.cards?.active_plans || "N/A"}
                </h2>
              </div>

              {/* Validity Period */}
              <div className="bg-white dark:bg-black shadow-lg rounded-lg flex flex-col justify-center p-3">
                <CardDescription className="text-[14px] text-[#979797] font-regular mb-1">
                  Validity Period
                </CardDescription>
                <h2 className="text-[16px] text-[#3A3A3A] font-bold dark:text-white">
                  {isLoadingSubscriptions
                    ? "Loading..."
                    : subscriptionData?.cards?.validity_period || "N/A"}
                </h2>
              </div>

              {/* Next Payment Date */}
              <div className="bg-white dark:bg-black shadow-lg rounded-lg flex flex-col justify-center p-3">
                <CardDescription className="text-[14px] text-[#979797] font-regular mb-1">
                  Next Payment Date
                </CardDescription>
                <h2 className="text-[16px] text-[#3A3A3A] font-bold dark:text-white">
                  {isLoadingSubscriptions
                    ? "Loading..."
                    : subscriptionData?.cards?.next_payment_date || "N/A"}
                </h2>
                <Button
                  size="sm"
                  className="bg-[#FAB435]/30 text-[#E89500] lg:w-[35%] border-none"
                >
                  Make Payment
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Table */}
          <CardContent className="p-2 lg:p-6">
            <div className="">
              {subscriptionError && (
                <div className="text-red-500 text-center py-4">
                  {subscriptionError}
                </div>
              )}

              {isLoadingSubscriptions ? (
                <div className="text-center py-10">
                  <p className="text-[#979797]">Loading subscriptions...</p>
                </div>
              ) : subscriptionData?.items?.data?.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-[#979797]">No subscriptions found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 text-[#3A3A3A]/50 text-[12px] font-medium">
                      <TableHead className="text-[#3A3A3A]/50 text-[12px] font-medium dark:text-white">
                        Period
                      </TableHead>
                      <TableHead className="text-[#3A3A3A]/50 text-[12px] font-medium dark:text-white">
                        Service
                      </TableHead>
                      <TableHead className="text-[#3A3A3A]/50 text-[12px] font-medium dark:text-white">
                        Number of Staffs
                      </TableHead>
                      <TableHead className="text-[#3A3A3A]/50 text-[12px] font-medium dark:text-white">
                        Equipments
                      </TableHead>
                      <TableHead className="text-[#3A3A3A]/50 text-[12px] font-medium dark:text-white">
                        Status
                      </TableHead>
                      <TableHead className="text-[#3A3A3A]/50 text-[12px] font-medium dark:text-white">
                        Download
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscriptionData?.items?.data?.map((item, index) => (
                      <TableRow key={item.id || index}>
                        <TableCell className="font-medium text-[14px] text-[#3A3A3A] dark:text-[#979797]">
                          {item.period || "N/A"}
                        </TableCell>
                        <TableCell className="font-medium text-[14px] text-[#3A3A3A] dark:text-[#979797]">
                          {item.service || "N/A"}
                        </TableCell>
                        <TableCell className="font-medium text-[14px] text-[#3A3A3A] dark:text-[#979797]">
                          {item.number_of_staffs || 0}
                        </TableCell>
                        <TableCell className="font-medium text-[14px] text-[#3A3A3A] dark:text-[#979797]">
                          {item.equipments || 0}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              item.status === "paid"
                                ? "text-[#5ECF53] bg-transparent"
                                : "text-[#E89500] bg-transparent"
                            }
                          >
                            <span
                              className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                item.status === "paid"
                                  ? "bg-[#5ECF53]"
                                  : "bg-[#E89500]"
                              }`}
                            />
                            {item.status || "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            Download
                          </Button>
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
