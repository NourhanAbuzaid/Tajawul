"use client"; // ✅ Ensures it runs only on the client

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function SearchParamsWrapper({ setParams }) {
  const searchParams = useSearchParams();
  const email = searchParams.get("email"); // ✅ Keep the correct query param name
  const token = searchParams.get("token");

  useEffect(() => {
    setParams({ email, token });
  }, [email, token, setParams]); // ✅ Updates state when values change

  return null; // ✅ Doesn't render anything, just updates parent state
}
