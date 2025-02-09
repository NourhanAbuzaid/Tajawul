"use client"; // If you're using Next.js App Router
import React from "react";

export default function Loading() {
  return (
    <div className="overlay">
      <div className="spinner"></div>
    </div>
  );
}
