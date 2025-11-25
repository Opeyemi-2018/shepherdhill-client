import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
const AccountInformation = () => {
  return (
    <div className="bg-primary-foreground shadow-lg rounded-lg py-6">
      <h2 className="text-[16px]  font-bold mb-4 px-6">Account Information</h2>
      <hr />
      <div className="space-y-4 px-6 pt-3">
        <div>
          <Label className=" text-[14px] font-medium mb-2">Full Name</Label>
          <input
            type="text"
            placeholder="Enter your full name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <Label className=" text-[14px] font-medium mb-2">Email</Label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <Label className=" text-[14px] font-medium mb-2">Address</Label>
          <input
            type="tel"
            placeholder="Enter your address"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-[#979797] font-regular text-[14px] mt-1">
            This address will be used as your billing address
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountInformation;
