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
        color: isActive ? "primary.main" : "text.secondary",
        "&:hover": {
          backgroundColor: "action.hover",
        },
      }}
    >
      {IconComponent && <IconComponent fontSize="small" />}
      <span style={{ fontSize: "0.75rem", marginTop: "4px" }}>{type}</span>
    </IconButton>
  );
}
