"use client";

import Image from "next/image";
import styles from "./page.module.css";
import NavBar from "./components/ui/NavBar";
import Button from "./components/ui/Button";
import LogoutButton from "@/components/ui/LogoutButton"; // ✅ Import the Logout Button

export default function Home() {
  return (
    <div className="container">
      <NavBar />
      <h1>Home</h1>
      <LogoutButton /> {/* ✅ Logout button appears here */}
    </div>
  );
}
