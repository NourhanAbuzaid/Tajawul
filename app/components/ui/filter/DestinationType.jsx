"use client";

import { IconButton } from "@mui/material";
import typeIconsMapping from "@/utils/typeIconsMapping";

export default function DestinationType({ type, isActive, onClick }) {
  const IconComponent = typeIconsMapping[type] || null;

  return (
    <IconButton
      onClick={() => onClick(type)}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "8px 12px",
        borderTopLeftRadius: "12px",
        borderTopRightRadius: "12px",
        borderBottomLeftRadius: "0px",
        borderBottomRightRadius: "0px",
        color: isActive
          ? "var(--Green-Hover)"
          : "var(--Neutrals-Medium-Outline)",
        fontFamily: '"DM Sans", sans-serif',
        borderBottom: isActive ? "2px solid var(--Green-Hover)" : "none",
        "&:hover": {
          color: "var(--Neutrals-Black-Text)",
          borderBottom: "1px solid var(--Neutrals-Black-Text)",
          "& span": {
            fontWeight: "700",
          },
        },
      }}
    >
      {IconComponent && <IconComponent fontSize="small" />}
      <span
        style={{
          fontSize: "0.75rem",
          marginTop: "4px",
          fontFamily: '"DM Sans", sans-serif',
          fontWeight: isActive ? "700" : "400",
        }}
      >
        {type}
      </span>
    </IconButton>
  );
}
