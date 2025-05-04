"use client"; // If you're using Next.js App Router

export default function Loading() {
  return (
    <div className="overlay">
      <div className="spinner"></div>
    </div>
  );
}

export function GreenLoading() {
  return (
    <div
      className="spinner"
      style={{
        borderColor: "rgba(92, 156, 146, 0.3)",
        borderTopColor: "var(--Green-Hover)",
      }}
    ></div>
  );
}

export function WhiteLoading() {
  return (
    <div
      className="spinner"
      style={{
        width: "20px",
        height: "20px",
        borderWidth: "3px",
        borderColor: "rgba(255, 251, 244, 0.3)",
        borderTopColor: "var(--Neutrals-Background)",
      }}
    ></div>
  );
}
