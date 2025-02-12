import Image from "next/image";
import styles from "./page.module.css";
import NavBar from "./components/ui/NavBar";

export default function Home() {
  return (
    <div className="container">
      <NavBar />
      <h1>Home</h1>
    </div>
  );
}
