import "./globals.css";
import { AnimatePresence } from "framer-motion";

export const metadata = {
  title: "Tajawul",
  description: "Explore the heart of the Arab World",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AnimatePresence mode="wait">{children}</AnimatePresence>
      </body>
    </html>
  );
}
