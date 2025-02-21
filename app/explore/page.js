"use client";

import DestinationCard from "@/components/ui/DestinationCard";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";

const fakeDestination = {
  image: "/Mena/Abu Dhabi.jpeg",
  name: "Paradise Beach",
  description: "Beach Resort",
  location: "Maldives, Asia",
  typeIcon: <BeachAccessIcon sx={{ fontSize: "18px" }} />,
  rating: 4.8,
  ratingCount: 120,
  priceRange: "$$$ Luxury",
  onOpen: () => alert("Opening destination page..."),
  onWishlist: () => alert("Added to wishlist!"),
};

export default function ExplorePage() {
  return (
    <div className="container">
      <DestinationCard {...fakeDestination} />
    </div>
  );
}
