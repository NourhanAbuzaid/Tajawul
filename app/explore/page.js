import Link from "next/link";
import axios from "axios";
import DestinationCard from "@/components/ui/DestinationCard";
import styles from "@/Explore.module.css";

export default async function ExplorePage() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"; // ✅ Ensure absolute URL
    const response = await axios.get(`${baseUrl}/api/proxy/getDestinations`, {
      next: { revalidate: 120 },
    });

    const destinations = response.data.destinations || [];

    return (
      <div className={styles.destinationContainer}>
        {destinations.length === 0 && <p>No destinations found.</p>}

        {destinations.map((destination) => (
          <Link
            key={destination.destinationId}
            href={`/explore/${destination.destinationId}`}
          >
            <DestinationCard
              image={destination.coverImage}
              name={destination.name}
              type={destination.type}
              location={`${destination.city}, ${destination.country}`}
              typeIcon={null} // Adjust if needed
              rating={destination.averageRating}
              ratingCount={destination.reviewsCount}
              priceRange={destination.priceRange}
            />
          </Link>
        ))}
      </div>
    );
  } catch (error) {
    console.error("Error fetching destinations:", error);
    return <p style={{ color: "red" }}>Failed to load destinations.</p>;
  }
}
