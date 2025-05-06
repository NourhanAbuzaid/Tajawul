import { DM_Sans, Merriweather } from "next/font/google";

// Configure Merriweather (heading font)
export const merriweather = Merriweather({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

// Configure DM Sans (body font)
export const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["500", "700"],
  display: "swap",
});
