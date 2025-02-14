"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/utils/auth";
import Button from "./Button";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await logout(); // ✅ Calls the logout function
    setLoading(false);
    router.push("/login"); // ✅ Redirects to login page
  };

  return (
    <Button
      type="primary"
      size="px14"
      onClick={handleLogout}
      disabled={loading}
      className="logout-button"
    >
      {loading ? "Logging out..." : "Logout"}
    </Button>
  );
}
