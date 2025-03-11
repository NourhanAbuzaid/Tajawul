import { z } from "zod";

export const stepOneSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  phoneNumber: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, "Invalid phone number. Include country code."),
  birthDate: z.string().min(1, "Birth date is required."),
  country: z.string().min(2, "Country name must be at least 2 characters."),
  city: z.string().min(2, "City name must be at least 2 characters."),
  address: z.string().min(5, "Address must be at least 5 characters."),
  nationality: z.string().min(2, "Nationality must be at least 2 characters."),
  gender: z.string().optional(),
  preferredLanguage: z
    .string()
    .min(2, "Preferred language must be at least 2 characters."),
});
