"use client";

import { useState } from "react";
import { Menu, MenuItem, Button, Box } from "@mui/material";
import typeIconsMapping from "@/utils/typeIconsMapping";

export default function DestinationTypeDropdown({
  selectedType,
  onTypeSelect,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTypeSelect = (type) => {
    onTypeSelect(type);
    handleClose();
  };

  return (
    <Box>
      <Button
        className="typesDropdown"
        onClick={handleClick}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          padding: "8px 16px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontFamily: '"DM Sans"',
          fontWeight: "500",
          color: "var(--Neutrals-Background)",
          backgroundColor: "var(--Neutrals-Black-Text)",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            backgroundColor: "var(--Neutrals-Medium-Outline)",
          },
        }}
      >
        {selectedType || "All"}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
          sx: {
            maxHeight: 400,
            width: "300px",
          },
        }}
      >
        <MenuItem onClick={() => handleTypeSelect(null)}>All</MenuItem>
        {Object.keys(typeIconsMapping).map((type) => {
          const IconComponent = typeIconsMapping[type];
          return (
            <MenuItem key={type} onClick={() => handleTypeSelect(type)}>
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {IconComponent && <IconComponent fontSize="small" />}
                {type}
              </Box>
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
}
