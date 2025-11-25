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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { EscalationType, EscalationSchema } from "@/types/escalation";
import { useState } from "react";
import { Upload, X } from "lucide-react";
import Image from "next/image";

const EnquiryEscalation = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<EscalationType>({
    resolver: zodResolver(EscalationSchema),
    defaultValues: {
      escalationType: "",
      staffId: "",
      description: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    form.setValue("image", undefined);
    setImagePreview(null);
  };

  const onSubmit = (data: EscalationType) => {
    console.log(data);
    // Handle form submission here
  };

  return (
    <div className="bg-primary-foreground py-6 rounded-lg shadow-lg">
      <h2 className="text-[16px] font-bold mb-4 px-6">Enquiry Escalation</h2>
      <hr />
      <div className="space-y-4 px-6 mt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="escalationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Escalation Type</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Escalation type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fight">Fight</SelectItem>
                        <SelectItem value="latework">Late Work</SelectItem>
                        <SelectItem value="lazy">Lazy</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="staffId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Staff ID / Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter guard ID or name"
                      {...field}
                      className="py-5"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Upload Image (Optional)</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      {!imagePreview ? (
                        <label
                          htmlFor="image-upload"
                          className="flex flex-col items-center justify-center w-full h-20  border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            {" "}
                            <Upload className="w-5 h-5 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500">
                              Click to upload image
                            </span>
                            <span className="text-xs text-gray-400 mt-1">
                              PNG, JPG, WEBP (max 5MB)
                            </span>
                          </div>
                          <Input
                            id="image-upload"
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            className="hidden"
                            onChange={handleImageChange}
                            {...field}
                          />
                        </label>
                      ) : (
                        <div className="relative">
                          <Image
                            width={100}
                            height={100}
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-48  rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Type your message here."
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-[40%] bg-[#FAB435]/30 text-[#E59300] font-semibold dark:hover:text-black"
            >
              Send Message
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EnquiryEscalation;
