"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ResetPasswordSchema, ResetPasswordType } from "@/types/changePassword";
import { changePassword } from "@/actions/signin";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useState } from "react";
import { ClipLoader } from "react-spinners";

const ChangePassword = () => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ResetPasswordType>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordType) => {
    if (!token) {
      toast.error("Please sign in to change password");
      return;
    }

    setIsLoading(true);
    try {
      const response = await changePassword(
        {
          current_password: data.currentPassword,
          new_password: data.newPassword,
          new_password_confirmation: data.confirmPassword,
        },
        token
      );

      if (response.statusCode === 200 || response.statusCode === 201) {
        toast.success(response.message || "Password changed successfully");
        form.reset();
      } else {
        toast.error(response.error || "Failed to change password");
      }
    } catch (error) {
      console.error("Password change error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-primary-foreground rounded-lg py-6 shadow-lg">
      <h2 className="text-[16px] px-3 lg:px-6 font-bold mb-4">
        Change Password
      </h2>
      <hr />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 px-3 lg:px-6 pt-3"
        >
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    className="py-5"
                    placeholder="Enter current password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    className="py-5"
                    placeholder="Enter new password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    className="py-5"
                    placeholder="Confirm new password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="w-[40%] bg-[#FAB435] text-[#3A3A3A] dark:text-[#3A3A3A] font-semibold hover:text-white"
          >
            {isLoading ? (
              <>
                Updating...
                <ClipLoader size={16} color="#3A3A3A" className="ml-2" />
              </>
            ) : (
              "Update Password"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ChangePassword;