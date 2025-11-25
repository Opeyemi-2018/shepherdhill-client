import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { NewplanSchema, NewPlanType } from "@/types/newPlan";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface AddNewServiceprop {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
const AddNewService = ({ open, onOpenChange }: AddNewServiceprop) => {
  const form = useForm<NewPlanType>({
    resolver: zodResolver(NewplanSchema),
    defaultValues: {
      service: "",
      numOfStaff: "",
      location: "",
    },
  });

  const onSubmit = (data: NewPlanType) => {
    toast.success("request successfully sent");
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="dark:border dark:border-white">
        <DialogHeader>
          <DialogTitle>New Plan</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="service"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="guard">Guard</SelectItem>
                      <SelectItem value="peacekeeping">
                        Peace Keeping
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="numOfStaff"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Staff</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="enter  number of staff needed"
                      {...field}
                      className="py-5 "
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="add location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="float-right bg-[#FAB435]/30 text-[#E59300]">
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewService;
