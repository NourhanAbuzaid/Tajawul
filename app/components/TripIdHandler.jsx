"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function TripIdHandler({ tripId }) {  // Changed from TripId to tripId
  const pathname = usePathname();

  useEffect(() => {
    // Store tripId in localStorage when component mounts
    if (tripId) {
      localStorage.setItem("tripId", tripId);
    }

    return () => {
      // Clean up when component unmounts or path changes
      if (pathname.startsWith("/explore/")) {
        localStorage.removeItem("tripId");
      }
    };
  }, [tripId, pathname]);

  return null;
}