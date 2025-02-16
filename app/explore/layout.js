import NavBar from "@/components/ui/NavBar";

export const metadata = {
  title: "Explore Destinations",
};

export default function Layout({ children }) {
  return (
    <div>
      <NavBar /> {children}
    </div>
  );
}
