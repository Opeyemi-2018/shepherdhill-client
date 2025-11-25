import z from "zod";

export const EscalationSchema = z.object({
  escalationType: z.string().min(1, "escalation type is required"),
  staffId: z.string().min(1, "pls provide staff ID"),
  description: z.string().min(1, "description is required"),
  image: z
    .instanceof(File, { message: "please upload an image" })
    .refine((file) => file.size <= 5000000, "image must be less than 5MB")
    .refine(
      (file) =>
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          file.type
        ),
      "only .jpg, .jpeg, .png and .webp formats are supported"
    )
    .optional(),
});

export type EscalationType = z.infer<typeof EscalationSchema>;
