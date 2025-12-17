"use client";

import { useState } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreVertical, Star, Eye } from "lucide-react";
import { toast } from "sonner";
import { TfiReload } from "react-icons/tfi";

interface Staff {
  id: string;
  name: string;
  email: string;
  timeResume: string;
  status: "Active" | "On Leave" | "Off Duty";
  avatar?: string;
  role: string;
  rating?: number;
  existingReview?: string;
}

const staffData: Staff[] = [
  {
    id: "1",
    name: "John Adebayo",
    email: "john.adebayo@ekohotels.com",
    timeResume: "6:00 AM",
    status: "Active",
    role: "Security Guard",
    rating: 4.5,
    existingReview: "Excellent performance, very punctual and professional.",
  },
  {
    id: "2",
    name: "Sarah Ibrahim",
    email: "sarah.ibrahim@ekohotels.com",
    timeResume: "7:30 AM",
    status: "Active",
    role: "Team Lead",
    rating: 5.0,
    existingReview: "Outstanding leadership skills and dedication to duty.",
  },
  {
    id: "3",
    name: "Michael Okonkwo",
    email: "michael.okonkwo@ekohotels.com",
    timeResume: "6:00 AM",
    status: "On Leave",
    role: "Security Guard",
    rating: 4.0,
  },
  {
    id: "4",
    name: "Fatima Yusuf",
    email: "fatima.yusuf@ekohotels.com",
    timeResume: "8:00 AM",
    status: "Active",
    role: "Supervisor",
    rating: 4.8,
    existingReview:
      "Great supervisor, handles situations calmly and effectively.",
  },
  {
    id: "5",
    name: "David Eze",
    email: "david.eze@ekohotels.com",
    timeResume: "6:00 AM",
    status: "Off Duty",
    role: "Security Guard",
    rating: 3.5,
  },
  {
    id: "6",
    name: "Amina Mohammed",
    email: "amina.mohammed@ekohotels.com",
    timeResume: "9:00 AM",
    status: "Active",
    role: "Security Guard",
    rating: 4.2,
    existingReview: "Reliable and attentive to detail.",
  },
  {
    id: "7",
    name: "Chukwuma Nwankwo",
    email: "chukwuma.nwankwo@ekohotels.com",
    timeResume: "6:00 AM",
    status: "Active",
    role: "Security Guard",
  },
  {
    id: "8",
    name: "Blessing Okoro",
    email: "blessing.okoro@ekohotels.com",
    timeResume: "7:00 AM",
    status: "Active",
    role: "Security Guard",
    rating: 4.6,
  },
];

const StaffList = () => {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isViewMode, setIsViewMode] = useState(false);

  const handleReviewClick = (staff: Staff) => {
    setSelectedStaff(staff);
    setIsViewMode(false);
    setReviewRating(staff.rating || 0);
    setReviewText("");
    setIsReviewModalOpen(true);
  };

  const handleViewReview = (staff: Staff) => {
    setSelectedStaff(staff);
    setIsViewMode(true);
    setReviewRating(staff.rating || 0);
    setReviewText(staff.existingReview || "");
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = () => {
    if (!selectedStaff) return;

    if (reviewRating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!reviewText.trim()) {
      toast.error("Please enter a review");
      return;
    }

    toast.success(`Review submitted for ${selectedStaff.name}`);
    setIsReviewModalOpen(false);
    setReviewRating(0);
    setReviewText("");
    setSelectedStaff(null);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="mt-10">
      <Headercontent
        title="Staff Management"
        subTitle="Eko Hotels"
        description="View and manage all staff members assigned to this location"
      />

      <div className="w-full mt-7 space-y-6">
        <Card className="border-none bg-primary-foreground shadow-lg">
          <CardHeader className="flex items-center justify-between p-2 lg:p-6">
            <div>
              <h1 className="text-[14px] font-bold text-[#3A3A3A] dark:text-white">
                Current Staff ({staffData.length})
              </h1>
              <p className="text-[12px] text-[#979797] mt-1">
                Active personnel on duty at Eko Hotels
              </p>
            </div>
            <Button className="bg-[#FAB435]/30 text-[#E89500]">
              <TfiReload className=" text-4xl" />
            </Button>
          </CardHeader>

          <CardContent className="p-2 lg:p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-[#3A3A3A]/50 text-[12px] font-medium dark:text-white">
                      Staff Member
                    </TableHead>
                    <TableHead className="text-[#3A3A3A]/50 text-[12px] font-medium dark:text-white">
                      Email
                    </TableHead>
                    <TableHead className="text-[#3A3A3A]/50 text-[12px] font-medium dark:text-white">
                      Role
                    </TableHead>
                    <TableHead className="text-[#3A3A3A]/50 text-[12px] font-medium dark:text-white">
                      Resume Time
                    </TableHead>
                    <TableHead className="text-[#3A3A3A]/50 text-[12px] font-medium dark:text-white">
                      Status
                    </TableHead>
                    <TableHead className="text-[#3A3A3A]/50 text-[12px] font-medium dark:text-white">
                      Rating
                    </TableHead>
                    <TableHead className="text-[#3A3A3A]/50 text-[12px] font-medium dark:text-white">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffData.map((staff) => (
                    <TableRow key={staff.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={staff.avatar} />
                            <AvatarFallback className="bg-[#FAB435]/20 text-[#E89500] font-semibold">
                              {getInitials(staff.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-[14px] text-[#3A3A3A] dark:text-white">
                            {staff.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-[14px] text-[#979797]">
                        {staff.email}
                      </TableCell>
                      <TableCell className="font-medium text-[14px] text-[#3A3A3A] dark:text-[#979797]">
                        {staff.role}
                      </TableCell>
                      <TableCell className="font-medium text-[14px] text-[#3A3A3A] dark:text-[#979797]">
                        {staff.timeResume}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            staff.status === "Active"
                              ? "text-[#5ECF53] bg-transparent"
                              : staff.status === "On Leave"
                              ? "text-[#E89500] bg-transparent"
                              : "text-[#979797] bg-transparent"
                          }
                        >
                          <span
                            className={`inline-block w-2 h-2 rounded-full mr-2 ${
                              staff.status === "Active"
                                ? "bg-[#5ECF53]"
                                : staff.status === "On Leave"
                                ? "bg-[#E89500]"
                                : "bg-[#979797]"
                            }`}
                          />
                          {staff.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {staff.rating ? (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-[#FAB435] text-[#FAB435]" />
                            <span className="text-[14px] font-medium text-[#3A3A3A] dark:text-white">
                              {staff.rating.toFixed(1)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[12px] text-[#979797]">
                            No rating
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            {staff.existingReview && (
                              <DropdownMenuItem
                                onClick={() => handleViewReview(staff)}
                                className="cursor-pointer"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Review
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleReviewClick(staff)}
                              className="cursor-pointer"
                            >
                              <Star className="mr-2 h-4 w-4" />
                              {staff.existingReview
                                ? "Update Review"
                                : "Add Review"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Review Modal */}
      <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-primary-foreground">
          <DialogHeader>
            <DialogTitle className="text-[20px] font-bold text-[#3A3A3A] dark:text-white">
              {isViewMode
                ? "Staff Review"
                : selectedStaff?.existingReview
                ? "Update Review"
                : "Add Review"}
            </DialogTitle>
          </DialogHeader>

          {selectedStaff && (
            <div className="space-y-6 py-4">
              {/* Staff Info */}
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedStaff.avatar} />
                  <AvatarFallback className="bg-[#FAB435]/20 text-[#E89500] font-semibold">
                    {getInitials(selectedStaff.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-[16px] text-[#3A3A3A] dark:text-white">
                    {selectedStaff.name}
                  </h3>
                  <p className="text-[12px] text-[#979797]">
                    {selectedStaff.role}
                  </p>
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="text-[14px] font-medium text-[#3A3A3A] dark:text-white mb-2 block">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      disabled={isViewMode}
                      onClick={() => !isViewMode && setReviewRating(star)}
                      className={`transition-all ${
                        isViewMode
                          ? "cursor-default"
                          : "cursor-pointer hover:scale-110"
                      }`}
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= reviewRating
                            ? "fill-[#FAB435] text-[#FAB435]"
                            : "text-[#E0E0E0]"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="text-[14px] font-medium text-[#3A3A3A] dark:text-white mb-2 block">
                  Review
                </label>
                <Textarea
                  placeholder="Share your feedback about this staff member..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  disabled={isViewMode}
                  className="min-h-[120px] bg-[#F3F4F6]"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsReviewModalOpen(false)}
            >
              {isViewMode ? "Close" : "Cancel"}
            </Button>
            {!isViewMode && (
              <Button
                onClick={handleSubmitReview}
                className="bg-[#FAB435] hover:bg-[#E89500] text-white"
              >
                Submit Review
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffList;
