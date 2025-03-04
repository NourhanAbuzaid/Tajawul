import { z } from "zod";

export const addDestinationSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long").max(100),
  type: z.string().min(2, "Type is required").max(50),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long")
    .max(500),
  coverImage: z.string().url("Cover image must be a valid URL"),
  country: z.string().optional(),
  city: z.string().optional(),
  openTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (hh:mm)"),
  closeTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (hh:mm)"),
  priceRange: z.enum(["low", "mid-range", "luxury"], "Invalid price range"),
  contactInfo: z
    .string()
    .min(6, "Contact info must be at least 6 characters long"),
  images: z.string().url("Each image must be a valid URL").optional(),
  address: z
    .string()
    .min(10, "Address must be at least 10 characters long")
    .max(200),
  socialMediaLinks: z
    .string()
    .url("Each social media link must be a valid URL")
    .optional(),
  establishedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
});
