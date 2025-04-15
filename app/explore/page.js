import Link from "next/link";
import axios from "axios";
import DestinationCard from "@/components/ui/DestinationCard";
import styles from "@/Explore.module.css";

export default async function ExplorePage() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  try {
    const response = await axios.get(
      `${baseUrl}/Destination?PageNumber=1&PageSize=50`,
      {
        next: { revalidate: 120 },
      }
    );

    const destinations = response.data.destinations || [];

    return (
      <div className={styles.exploreContainer}>
        <div className={styles.searchSection}>
          <h1>Explore Destinations</h1>
        </div>
        <div className={styles.filterSection}>
          <div className={styles.typesSection}></div>
          <button className={styles.filterButton}>Filter</button>
          <button className={styles.sortSection}>Sort by:</button>
        </div>
        <div className={styles.destinationContainer}>
          {destinations.length === 0 && <p>No destinations found.</p>}

          {destinations.map((destination) => (
            <Link
              key={destination.destinationId}
              href={`/explore/${destination.destinationId}`}
            >
              <DestinationCard
                image={destination.coverImage || "/fallback.jpg"} // Fallback image if coverImage is empty
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
      </div>
    );
  } catch (error) {
    console.error("Error fetching destinations:", error);
    return <p style={{ color: "red" }}>Failed to load destinations.</p>;
  }
}
