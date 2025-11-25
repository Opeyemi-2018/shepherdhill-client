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

const ChangePassword = () => {
  const form = useForm<ResetPasswordType>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ResetPasswordType) => {
    console.log(data);
    // Handle password update logic here
  };

  return (
    <div className="bg-primary-foreground py-6 rounded-lg py-6 shadow-lg">
      <h2 className="text-[16px] px-6 font-bold mb-4">Change Password</h2>
      <hr />
      <Form {...form} >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-6 pt-3">
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
            className="w-[40%] bg-[#FAB435] text-[#3A3A3A] dark:text-[#3A3A3A] font-semibold hover:text-white"
          >
            Update Password
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ChangePassword;
