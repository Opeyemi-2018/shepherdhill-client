/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
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
import { usePayment } from "@/hooks/usePayment";
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

function PaymentHistory() {
  const { data, isLoading, error } = usePayment();

  return (
    <div className="mt-10">
      <Headercontent subTitle="Payment " />
      <div className="pt-4">
        <StatCard
          icon={CiCalendarDate}
          label={
            isLoading ? "Loading..." : data?.header.title || "Payment History"
          }
          value={isLoading ? "Loading..." : data?.header.total_amount || "NGN"}
        />
      </div>
      <div className="w-full mt-7 space-y-6 ">
        <Card className="border-none bg-primary-foreground shadow-lg">
          <CardHeader className="flex items-center justify-between p-2 lg:p-6">
            <h1 className="text-[14px] font-bold text-[#3A3A3A] dark:text-white">
              {isLoading
                ? "Loading..."
                : data?.header.title || "Payment History"}
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
            {error && (
              <div className="text-red-500 text-center py-4">{error}</div>
            )}

            {isLoading ? (
              <div className="text-center py-10">
                <p className="text-[#979797]">Loading payment history...</p>
              </div>
            ) : data?.rows.data.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-[#979797]">No payment history found</p>
              </div>
            ) : (
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
                      <TableHead className="text-[#3A3A3A]/50 text-[12px] font-medium dark:text-white">
                        Date
                      </TableHead>
                      <TableHead className="text-[#3A3A3A]/50 text-[12px] font-medium dark:text-white">
                        Download
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.rows.data.map((item: { id: any; payment_id: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; type: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; staff: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; status: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; date: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }, index: any) => (
                      <TableRow key={item.id || index}>
                        <TableCell className="font-medium text-[14px] text-[#3A3A3A] dark:text-[#979797]">
                          {item.payment_id}
                        </TableCell>
                        <TableCell className="font-medium text-[14px] text-[#3A3A3A] dark:text-[#979797]">
                          {item.type}
                        </TableCell>
                        <TableCell className="font-medium text-[14px] text-[#3A3A3A] dark:text-[#979797]">
                          {item.staff}
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

                {data && data.rows.total > 0 && (
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-[#979797]">
                      Showing {data.rows.from || 0} to {data.rows.to || 0} of{" "}
                      {data.rows.total} payments
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default PaymentHistory;
