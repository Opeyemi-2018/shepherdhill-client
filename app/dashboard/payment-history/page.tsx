import StatCard from "@/components/Cards";
import Headercontent from "@/components/Headercontent";
import { Badge } from "@/components/ui/badge";
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
import { CiCalendarDate } from "react-icons/ci";

interface PaymentItem {
  Reference: string;
  service: string;
  numberOfStaffs: number;
  status: "Pending" | "paid";
  date: string;
}

const paymentHistory: PaymentItem[] = [
  {
    Reference: "12345",
    service: "Man Guarding",
    numberOfStaffs: 8,
    status: "Pending",
    date: "22, January 2025",
  },
  {
    Reference: "67891",
    service: "Peace Keeping",
    numberOfStaffs: 8,
    status: "paid",
    date: "22, January 2025",
  },
  {
    Reference: "64830",
    service: "Man Guarding",
    numberOfStaffs: 8,
    status: "Pending",
    date: "22, January 2025",
  },
  {
    Reference: "748505",
    service: "Peace Keeping",
    numberOfStaffs: 8,
    status: "paid",
    date: "22, January 2025",
  },
];
function PaymentHistory() {
  return (
    <div className="mt-10">
      <Headercontent
        subTitle="Payment "
        // subTitle="Ann Hotels"
        // description="Start with a clear overview of what matters most"
      />
      <div className="pt-4">
        <StatCard
          icon={CiCalendarDate}
          label="Validity Period"
          value="Jan, 2026 - Feb 2026"
        />
      </div>
      <div className="w-full mt-7 space-y-6 ">
        {/* Subscription Info Card */}
        <Card className="border-none bg-primary-foreground shadow-lg">
          {/* Header */}
          <CardHeader className="flex items-center justify-between p-2 lg:p-6">
            <h1 className="text-[14px] font-bold text-[#3A3A3A] dark:text-white">
              Payment History
            </h1>
            <Button
              variant="outline"
              className="bg-[#FAB435]/30 text-[#E89500] border-none"
            >
              See all
            </Button>
          </CardHeader>

          {/* Table */}
          <CardContent className="p-2 lg:p-6">
            <div className="">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 text-[#3A3A3A]/50 text-[12px] font-medium">
                    <TableHead className="text-[#3A3A3A]/50 text-[12px] font-medium dark:text-white">
                      Reference
                    </TableHead>
                    <TableHead className="text-[#3A3A3A]/50 text-[12px] font-medium dark:text-white">
                      Service
                    </TableHead>
                    <TableHead className="text-[#3A3A3A]/50 text-[12px] font-medium dark:text-white">
                      Number of Staffs
                    </TableHead>
                    <TableHead className="text-[#3A3A3A]/50 text-[12px] font-medium dark:text-white">
                      Status
                    </TableHead>
                    Date
                    <TableHead className="text-[#3A3A3A]/50 text-[12px] font-medium dark:text-white">
                      Download
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentHistory.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium text-[14px] text-[#3A3A3A] dark:text-[#979797]">
                        {item.Reference}
                      </TableCell>
                      <TableCell className="font-medium text-[14px] text-[#3A3A3A] dark:text-[#979797]">
                        {item.service}
                      </TableCell>
                      <TableCell className="font-medium text-[14px] text-[#3A3A3A] dark:text-[#979797]">
                        {item.numberOfStaffs}
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
                      <TableCell className="font-medium text-[14px] text-[#3A3A3A] dark:text-[#979797]">
                        {item.date}
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
    </div>
  );
}

export default PaymentHistory;
