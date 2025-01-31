import "./globals.css";

export const metadata = {
  title: "Tajawul",
  description: "Explore the heart of the Arab World",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
