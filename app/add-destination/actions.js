import { z } from "zod";

export const addDestinationSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long").max(100),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long")
    .max(500),
  coverImage: z.string().url("Cover image must be a valid URL"),
  type: z.string().min(2, "Type is required").max(50),
  priceRange: z.enum(["Low", "Mid", "Luxury"], {
    errorMap: () => ({
      message: "Invalid price range.",
    }),
  }),
  country: z.string().min(2, "Country is required"),
  city: z.string().min(2, "City is required"),

  // Locations array (longitude & latitude are numbers now)
  locations: z.array(
    z.object({
      longitude: z.number().min(-180).max(180, "Invalid longitude"),
      latitude: z.number().min(-90).max(90, "Invalid latitude"),
      address: z
        .string()
        .min(10, "Address must be at least 10 characters long")
        .max(200),
    })
  ),

  // Boolean flag for 24-hour open status
  isOpen24Hours: z.boolean(),

  // Open & Close Time (Optional if isOpen24Hours is true)
  openTime: z.string().optional(),
  closeTime: z.string().optional(),

  // Established At (Optional, must follow YYYY-MM-DD format)
  establishedAt: z.string().optional(),

  // Arrays of strings for images
  images: z.array(z.string().url("Each image must be a valid URL")).optional(),

  // Social Media Links (Array of objects)
  socialMediaLinks: z
    .array(
      z.object({
        platform: z.string().min(2, "Platform name is required"),
        url: z.string().url("Invalid social media URL"),
      })
    )
    .optional(),

  // Contact Info (Array of objects)
  contactInfo: z
    .array(
      z.object({
        type: z.enum(["phone", "website"], {
          errorMap: () => ({ message: "Type must be 'phone' or 'website'" }),
        }),
        value: z.string(),
      })
    )
    .optional(),
});

// Conditional validation to ensure openTime and closeTime are required when isOpen24Hours is false
export const validateOpenCloseTime = (data) => {
  if (!data.isOpen24Hours) {
    if (!data.openTime || !data.closeTime) {
      throw new Error(
        "Open time and close time are required unless open 24 hours."
      );
    }
  }
};
