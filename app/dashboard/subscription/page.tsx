"use client";
import StatCard from "@/components/Cards";
import Headercontent from "@/components/Headercontent";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { CiCalendarDate } from "react-icons/ci";

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

interface SubscriptionItem {
  period: string;
  service: string;
  numberOfStaffs: number;
  equipments: number;
  status: "Pending" | "Payed";
}
interface PaymentItem {
  Reference: string;
  service: string;
  numberOfStaffs: number;
  status: "Pending" | "Payed";
  date: "22, January 2025"
}

const subscriptionData: SubscriptionItem[] = [
  {
    period: "January - March",
    service: "Man Guarding",
    numberOfStaffs: 8,
    equipments: 8,
    status: "Pending",
  },
  {
    period: "January - March",
    service: "Security",
    numberOfStaffs: 3,
    equipments: 3,
    status: "Pending",
  },
  {
    period: "January - March",
    service: "Security",
    numberOfStaffs: 7,
    equipments: 7,
    status: "Pending",
  },
  {
    period: "January - March",
    service: "Man Guarding",
    numberOfStaffs: 9,
    equipments: 9,
    status: "Payed",
  },
  {
    period: "January - March",
    service: "Operations",
    numberOfStaffs: 1,
    equipments: 1,
    status: "Payed",
  },
];
const paymentHistory: PaymentItem[] = [
  {
    Reference: "12345",
    service: "Man Guarding",
    numberOfStaffs: 8,
    status: "Pending",
    date: "22, January 2025"
  },
  {
    Reference: "67891",
    service: "Peace Keeping",
    numberOfStaffs: 8,
    status: "Payed",
    date: "22, January 2025"
  },
  {
    Reference: "64830",
    service: "Man Guarding",
    numberOfStaffs: 8,
    status: "Pending",
    date: "22, January 2025"
  },
  {
    Reference: "748505",
    service: "Peace Keeping",
    numberOfStaffs: 8,
    status: "Payed",
    date: "22, January 2025"
  },
  
];

const SubScription = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <div className=" mt-10">
      <div className="flex items-center justify-between ">
        <Headercontent
          subTitle="Subscriptions "
          // subTitle="Ann Hotels"
          // description="Start with a clear overview of what matters most"
        />

        <Button className="bg-[#FAB435]"> Make Payment</Button>
      </div>
      <div className="flex items-center flex-col md:flex-row justify-between gap-4 pt-4">
        <StatCard icon={FaRegMoneyBillAlt} label="Active Plan" value="20" />
        <StatCard
          icon={CiCalendarDate}
          label="Validity Period"
          value="Jan, 2026 - Feb 2026"
        />
        <StatCard
          icon={CiCalendarDate}
          label="Next Payment Date"
          value="24 Jan, 2026"
        />
      </div>

      <div className="flex justify-between items-center bg-primary-foreground p-4 rounded-lg mt-10">
        <div>
          <h1 className="text-[14px] text-[#979797]">All Plans</h1>
          <h2 className="text-[16px] whitespace-nowrap lg:font-bold text-[#3A3A3A] dark:text-[#979797]">
            Security, Operations, Man Guarding
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-[#FAB435]/30 text-[#E59300]"
          >
            + Request New Service
          </Button>

          <Button className="bg-[#FAB435]"> Make Payment</Button>
        </div>
      </div>

      <div className="w-full mt-7 space-y-6 ">
        {/* Subscription Info Card */}
        <Card className="border-none bg-primary-foreground shadow-lg">
          {/* Header */}
          <CardHeader className="flex items-center justify-between ">
            <h1 className="text-[14px] font-bold text-[#3A3A3A] dark:text-white">
              All Subscriptions
            </h1>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="service">service</SelectItem>
                <SelectItem value="pay">pay</SelectItem>
                <SelectItem value="service">service</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>

          {/* Table */}
          <CardContent>
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
                  {subscriptionData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium text-[14px] text-[#3A3A3A] dark:text-[#979797]">
                        {item.period}
                      </TableCell>
                      <TableCell className="font-medium text-[14px] text-[#3A3A3A] dark:text-[#979797]">
                        {item.service}
                      </TableCell>
                      <TableCell className="font-medium text-[14px] text-[#3A3A3A] dark:text-[#979797]">
                        {item.numberOfStaffs}
                      </TableCell>
                      <TableCell className="font-medium text-[14px] text-[#3A3A3A] dark:text-[#979797]">
                        {item.equipments}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            item.status === "Payed"
                              ? " text-[#5ECF53] bg-transparent"
                              : " text-[#E89500] bg-transparent"
                          }
                        >
                          <span
                            className={`inline-block w-2 h-2 rounded-full mr-2 ${
                              item.status === "Payed"
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
            </div>
          </CardContent>
        </Card>
      </div>

      <AddNewService open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
};

export default SubScription;
