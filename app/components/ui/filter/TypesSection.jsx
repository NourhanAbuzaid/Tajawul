"use client";

import { useState, useRef } from "react";
import { IconButton, Box } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DestinationType from "./DestinationType";
import destinationTypes from "@/data/destinationTypes.json";

export default function TypesSection({
  onTypeSelect,
  selectedType: propSelectedType,
}) {
  const [internalSelectedType, setInternalSelectedType] = useState(null);
  const scrollContainerRef = useRef(null);

  // Use the prop if provided, otherwise use internal state
  const selectedType =
    propSelectedType !== undefined ? propSelectedType : internalSelectedType;

  const scroll = (scrollOffset) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += scrollOffset;
    }
  };

  const handleTypeClick = (type) => {
    const newSelectedType = type === selectedType ? null : type;
    if (onTypeSelect) {
      onTypeSelect(newSelectedType);
    } else {
      setInternalSelectedType(newSelectedType);
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <IconButton
        onClick={() => scroll(-200)}
        sx={{
          border: "1px solid var(--Neutrals-Light-Outline)",
          transition: "all 0.2s ease",
          padding: "4px",
          "&:hover": {
            borderColor: "var(--Neutrals-Black-Text)",
          },
          "& .MuiSvgIcon-root": {
            fontSize: "1.2rem",
          },
        }}
      >
        <ChevronLeftIcon sx={{ color: "var(--Neutrals-Black-Text)" }} />
      </IconButton>

      <Box
        ref={scrollContainerRef}
        sx={{
          display: "flex",
          overflowX: "auto",
          scrollBehavior: "smooth",
          gap: 1,
          "&::-webkit-scrollbar": {
            display: "none",
          },
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {destinationTypes.destinations.map((type) => (
          <DestinationType
            key={type}
            type={type}
            isActive={type === selectedType}
            onClick={handleTypeClick}
          />
        ))}
      </Box>

      <IconButton
        onClick={() => scroll(200)}
        sx={{
          border: "1px solid var(--Neutrals-Light-Outline)",
          transition: "all 0.2s ease",
          padding: "4px",
          "&:hover": {
            borderColor: "var(--Neutrals-Black-Text)",
          },
          "& .MuiSvgIcon-root": {
            fontSize: "1.2rem",
          },
        }}
      >
        <ChevronRightIcon sx={{ color: "var(--Neutrals-Black-Text)" }} />
      </IconButton>
    </Box>
  );
}
