// app/components/ui/filter/TypesSection.jsx
"use client";

import { useState, useRef } from "react";
import { IconButton, Box } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DestinationType from "./DestinationType";
import destinationTypes from "@/data/destinationTypes.json";

export default function TypesSection() {
  const [selectedType, setSelectedType] = useState(null);
  const scrollContainerRef = useRef(null);

  const scroll = (scrollOffset) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += scrollOffset;
    }
  };

  const handleTypeClick = (type) => {
    setSelectedType(type === selectedType ? null : type);
    // Here you would typically also filter the destinations
    // For now we're just tracking the selected state
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <IconButton onClick={() => scroll(-200)}>
        <ChevronLeftIcon />
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

      <IconButton onClick={() => scroll(200)}>
        <ChevronRightIcon />
      </IconButton>
    </Box>
  );
}
