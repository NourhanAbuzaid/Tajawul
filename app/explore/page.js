"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import DestinationCard from "@/components/ui/DestinationCard";

export default function ExplorePage() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await axios.get("/api/proxy/getDestinations");
        setDestinations(response.data.destinations || []);
      } catch (err) {
        console.error("Error fetching destinations:", err);
        setError("Failed to load destinations.");
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  return (
    <div className="container">
      {loading && <p>Loading destinations...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && destinations.length === 0 && (
        <p>No destinations found.</p>
      )}
      {!loading &&
        !error &&
        destinations.map((destination) => (
          <DestinationCard
            key={destination.destinationId}
            image={destination.coverImage}
            name={destination.name}
            description={destination.description}
            location={`${destination.city}, ${destination.country}`}
            typeIcon={null} // Adjust if needed
            rating={destination.averageRating}
            ratingCount={destination.reviewsCount}
            priceRange={destination.priceRange}
            onOpen={() => router.push(`/explore/${destination.destinationId}`)}
            onWishlist={() => alert(`Added ${destination.name} to wishlist!`)}
          />
        ))}
    </div>
  );
}
