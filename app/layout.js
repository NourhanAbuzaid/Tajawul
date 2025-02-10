import "./globals.css";
import { AnimatePresence } from "framer-motion";
import NavBar from "./components/ui/NavBar";

export const metadata = {
  title: "Tajawul",
  description: "Explore the heart of the Arab World",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <AnimatePresence mode="wait">{children}</AnimatePresence>
      </body>
    </html>
  );
}
