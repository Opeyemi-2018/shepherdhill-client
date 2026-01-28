"use client";
import StatCard from "@/components/Cards";
import Headercontent from "@/components/Headercontent";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { CiCalendarDate } from "react-icons/ci";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import AddNewService from "@/components/AddNewService";
import { useSubscription } from "@/hooks/useSubscription";

const SubScription = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data, isLoading, error, updateFilters } = useSubscription();

  const allPlans =
    data?.filters.available_services.join(", ") || "No active plans";

  return (
    <div className=" mt-10">
      <div className="flex items-center justify-between ">
        <Headercontent subTitle="Subscriptions " />
        <Button className="bg-[#FAB435]"> Make Payment</Button>
      </div>

      <div className="flex items-center flex-col md:flex-row justify-between gap-4 pt-4">
        <StatCard
          icon={FaRegMoneyBillAlt}
          label="Active Plan"
          value={
            isLoading
              ? "Loading..."
              : data?.cards.active_plans.toString() || "0"
          }
        />
        <StatCard
          icon={CiCalendarDate}
          label="Validity Period"
          value={
            isLoading ? "Loading..." : data?.cards.validity_period || "N/A"
          }
        />
        <StatCard
          icon={CiCalendarDate}
          label="Next Payment Date"
          value={
            isLoading ? "Loading..." : data?.cards.next_payment_date || "N/A"
          }
        />
      </div>

      <div className="flex justify-between items-center bg-primary-foreground p-4 rounded-lg mt-10">
        <div>
          <h1 className="text-[14px] text-[#979797]">All Plans</h1>
          <h2 className="text-[16px] whitespace-nowrap lg:font-bold text-[#3A3A3A] dark:text-[#979797]">
            {isLoading ? "Loading..." : allPlans}
          </h2>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-[#FAB435]/30 text-[#E59300] "
          >
            + Request New Service
          </Button>

          <Button className="bg-[#FAB435]"> Make Payment</Button>
        </div>
      </div>

      <div className="w-full mt-4">
        <Card className="border-none bg-primary-foreground shadow-lg">
          <CardHeader className="flex items-center justify-between px-6">
            <h1 className="text-[14px] font-bold text-[#3A3A3A] dark:text-white">
              All Subscriptions
            </h1>
            <Select onValueChange={(value) => updateFilters({ status: value })}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>

          <CardContent className="p-2 lg:p-6">
            {error && (
              <div className="text-red-500 text-center py-4">{error}</div>
            )}

            {isLoading ? (
              <div className="text-center py-10">
                <p className="text-[#979797]">Loading subscriptions...</p>
              </div>
            ) : data?.items.data.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-[#979797]">No subscriptions found</p>
              </div>
            ) : (
              <div className="">
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
                    {data?.items.data.map((item, index) => (
                      <TableRow key={item.id || index}>
                        <TableCell className="font-medium text-[14px] text-[#3A3A3A] dark:text-[#979797]">
                          {item.period}
                        </TableCell>
                        <TableCell className="font-medium text-[14px] text-[#3A3A3A] dark:text-[#979797]">
                          {item.service}
                        </TableCell>
                        <TableCell className="font-medium text-[14px] text-[#3A3A3A] dark:text-[#979797]">
                          {item.number_of_staff}
                        </TableCell>
                        <TableCell className="font-medium text-[14px] text-[#3A3A3A] dark:text-[#979797]">
                          {item.equipments}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              item.status === "paid"
                                ? " text-[#5ECF53] bg-transparent"
                                : " text-[#E89500] bg-transparent"
                            }
                          >
                            <span
                              className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                item.status === "paid"
                                  ? "bg-[#5ECF53]"
                                  : "bg-[#E89500]"
                              }`}
                            />
                            {item.status}
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

                {data && data.items.total > 0 && (
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-[#979797]">
                      Showing {data.items.from || 0} to {data.items.to || 0} of{" "}
                      {data.items.total} subscriptions
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AddNewService open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
};

export default SubScription;
