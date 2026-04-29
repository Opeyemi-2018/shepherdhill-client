"use client";
import { useState } from "react";
import {
  Menu,
  Sun,
  Moon,
  MoreHorizontal,
  LayoutDashboard,
  History,
} from "lucide-react";
import { MdOutlinePayments } from "react-icons/md";
import { IoIosBook, IoIosSettings } from "react-icons/io";
import { LiaMoneyCheckSolid } from "react-icons/lia";
import AddNewService from "./AddNewService";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/AuthContext";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const pathname = usePathname();

  const { setTheme } = useTheme();
  const { logout } = useAuth();

  const mainNavItems = [
    { name: "Overview", path: "/dashboard/overview", icon: LayoutDashboard },
    {
      name: "Subscription",
      path: "/dashboard/subscription",
      icon: LiaMoneyCheckSolid,
    },
    {
      name: "Payments",
      path: "/dashboard/payment-history",
      icon: MdOutlinePayments,
    },
  ];

  const moreNavItems = [
    { name: "Operatives", path: "/dashboard/staffs", icon: MdOutlinePayments },
    {
      name: "Account Setting",
      path: "/dashboard/account-setting",
      icon: IoIosSettings,
    },
    { name: "Escalations", path: "/dashboard/Escalations", icon: IoIosBook },
    { name: "Audit Logs", path: "/dashboard/audit-logs", icon: History },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard/overview" className="flex items-center">
            <Image
              src="/shepherdhill.svg"
              width={100}
              height={100}
              alt="logo"
              className="w-10 md:w-14 h-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-md transition-all ${
                    isActive(item.path)
                      ? "text-[#FAB435] font-semibold bg-[#FAB435]/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}

            {/* More Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 px-4"
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span>More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {moreNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <DropdownMenuItem key={item.path} asChild>
                      <Link
                        href={item.path}
                        className={`flex items-center gap-3 py-2.5 ${
                          isActive(item.path)
                            ? "text-[#FAB435] font-medium"
                            : ""
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {item.name}
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* ==================== DESKTOP RIGHT SIDE ==================== */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-[#FAB435] hover:bg-[#E59300] text-black font-medium"
            >
              + Request New Service
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Sun className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                  <Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
              onClick={logout}
            >
              Sign Out
            </Button>
          </div>

          {/* ==================== MOBILE RIGHT SIDE ==================== */}
          <div className="lg:hidden flex items-center gap-2">
            <Button
              onClick={() => setIsDialogOpen(true)}
              size="sm"
              className="bg-[#FAB435] hover:bg-[#E59300] text-black font-medium"
            >
              Request
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Sun className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                  <Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] max-w-[300px]">
                <SheetTitle className="px-4 py-3">Menu</SheetTitle>

                <div className="flex flex-col gap-2 ">
                  {[...mainNavItems, ...moreNavItems].map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={() => setOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base ${
                          isActive(item.path)
                            ? "bg-[#FAB435]/10 text-[#FAB435] font-semibold"
                            : "hover:bg-muted"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>

                <Button
                  onClick={logout}
                  variant="destructive"
                  className="w-full mt-8"
                >
                  Sign Out
                </Button>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <AddNewService open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </header>
  );
};

export default Header;
