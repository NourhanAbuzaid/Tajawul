import { z } from "zod";

export const addDestinationSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long").max(100),
  type: z.string().min(2, "Type is required").max(50),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long")
    .max(500),
  coverImage: z.string().url("Cover image must be a valid URL"),

  country: z.string().min(2, "Country is required"),
  city: z.string().min(2, "City is required"),

  address: z
    .string()
    .min(10, "Address must be at least 10 characters long")
    .max(200),

  longitude: z.string().regex(/^-?\d+(\.\d+)?$/, "Invalid longitude format"),
  latitude: z.string().regex(/^-?\d+(\.\d+)?$/, "Invalid latitude format"),

  openTime: z.string(),
  closeTime: z.string(),
  priceRange: z.enum(["low", "mid-range", "luxury"], {
    errorMap: () => ({ message: "Invalid price range" }),
  }),

  contactInfo: z
    .string()
    .min(6, "Contact info must be at least 6 characters long")
    .optional(),

  socialMediaLinks: z
    .string()
    .url("Each social media link must be a valid URL")
    .optional(),

  images: z.string().url("Each image must be a valid URL").optional(),

  establishedAt: z
    .string()

    .optional(),
});
