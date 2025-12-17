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

interface SubscriptionItem {
  period: string;
  service: string;
  numberOfStaffs: number;
  equipments: number;
  status: "Pending" | "paid";
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
    status: "paid",
  },
  {
    period: "January - March",
    service: "Operations",
    numberOfStaffs: 1,
    equipments: 1,
    status: "paid",
  },
];

const Overview = () => {
  return (
    <div className=" mt-10">
      <div className="flex items-center justify-between ">
        <Headercontent
          title="Welcome "
          subTitle="Eko Hotels"
          description="Start with a clear overview of what matters most"
        />

        <DateTimeDisplay />
      </div>
      <div className="flex items-center flex-col md:flex-row justify-between gap-4 pt-4">
        <StatCard icon={FaUsers} label="Active Staffs" value="2,400,234" />
        <StatCard
          icon={MdOutlinePayments}
          label="Total Payment"
          value="200,000"
        />
      </div>

      <div className="w-full mt-7 space-y-6 ">
        {/* Subscription Info Card */}
        <Card className="border-none bg-primary-foreground shadow-lg ">
          {/* Header */}
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
              {/* Active Subscription */}
              <div className="bg-white dark:bg-black shadow-lg rounded-lg flex flex-col justify-center p-3">
                <CardDescription className="text-[14px] text-[#979797] font-regular mb-1">
                  Active Subscription
                </CardDescription>
                <h2 className="text-[16px] text-[#3A3A3A] font-bold dark:text-white">
                  Man Guarding
                </h2>
              </div>

              {/* Validity Period */}
              <div className="bg-white dark:bg-black shadow-lg rounded-lg flex flex-col justify-center p-3">
                <CardDescription className="text-[14px] text-[#979797] font-regular mb-1">
                  Validity Period
                </CardDescription>
                <h2 className="text-[16px] text-[#3A3A3A] font-bold dark:text-white">
                  Jan, 2026 - Feb 2026
                </h2>
              </div>

              {/* Next Payment Date */}
              <div className="bg-white dark:bg-black shadow-lg rounded-lg flex flex-col justify-center p-3">
                <CardDescription className="text-[14px] text-[#979797] font-regular mb-1">
                  Next Payment Date
                </CardDescription>
                <h2 className="text-[16px] text-[#3A3A3A] font-bold dark:text-white">
                  24 Jan, 2026
                </h2>
                <Button
                  size="sm"
                  className="bg-[#FAB435]/30 text-[#E89500]  lg:w-[35%] border-none"
                >
                  Make Payment
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Table */}
          <CardContent className="p-2 lg:p-6">
            <div className="">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 text-[#3A3A3A]/50 text-[12px] font-medium">
                    <TableHead className=" text-[#3A3A3A]/50 text-[12px] font-medium dark:text-white">
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
            </div>
          </CardContent>
        </Card>
      </div>

      <PaymentHistory />
    </div>
  );
};

export default Overview;
