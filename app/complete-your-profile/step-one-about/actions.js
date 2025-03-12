import { z } from "zod";

export const stepOneSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters.")
    .max(20, "Username must be at most 20 characters.")
    .regex(
      /^[a-zA-Z0-9_.]+$/,
      "Username can only contain letters, numbers, underscores, and periods."
    ),
  phoneNumber: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, "Invalid phone number. Include country code."),
  birthDate: z.string().min(1, "Birth date is required."),
  country: z.string().min(2, "Country name must be at least 2 characters."),
  city: z.string().min(2, "City name must be at least 2 characters."),
  address: z.string().min(5, "Address must be at least 5 characters."),
  nationality: z.string().min(2, "Nationality must be at least 2 characters."),
  gender: z.string(),
  preferredLanguage: z
    .string()
    .min(2, "Preferred language must be at least 2 characters."),
  bio: z.string().max(500, "Bio must be at most 500 characters."),
  profilePicture: z
    .string()
    .url("Invalid profile picture URL.")
    .regex(/\.(jpg|jpeg|png|webp)$/, "Profile picture must be an image file."),
});
