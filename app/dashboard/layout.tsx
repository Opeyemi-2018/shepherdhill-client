import Header from "@/components/Header";
import { ReactNode } from "react";
const Dashboardlayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 pt-5 h-screen">{children}</div>
    </div>
  );
};

export default Dashboardlayout;
