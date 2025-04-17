"use client";

import Link from "next/link";
import axios from "axios";
import { useState, useEffect } from "react";
import DestinationCard from "@/components/ui/DestinationCard";
import TuneIcon from "@mui/icons-material/Tune";
import styles from "@/Explore.module.css";
import DestinationTypeDropdown from "@/components/ui/filter/DestinationTypeDropdown";
import CountriesSection from "@/components/ui/filter/CountriesSection";

export default function ExplorePage() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchDestinations = async (country = null, type = null) => {
    try {
      setLoading(true);
      let url = `${baseUrl}/Destination?PageNumber=1&PageSize=50`;
      if (country) {
        url += `&Country=${country}`;
      }
      if (type) {
        url += `&Type=${type}`;
      }

      const response = await axios.get(url, {
        next: { revalidate: 120 },
      });
      setDestinations(response.data.destinations || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching destinations:", err);
      setError("Failed to load destinations.");
      setDestinations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []); // Empty dependency array means this runs once on mount

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    fetchDestinations(country, selectedType);
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    fetchDestinations(selectedCountry, type);
  };

  return (
    <div className={styles.exploreContainer}>
      <div className={styles.searchSection}>
        <h1>
          {selectedCountry
            ? `Explore ${
                selectedCountry === "United Arab Emirates"
                  ? "UAE"
                  : selectedCountry
              }`
            : "Explore Destinations"}
        </h1>
      </div>

      <div className={styles.filterSection}>
        <div className={styles.filterControls}>
          <div className={styles.countriesWrapper}>
            <CountriesSection
              onCountrySelect={handleCountrySelect}
              selectedCountry={selectedCountry}
            />
          </div>

          <DestinationTypeDropdown
            selectedType={selectedType}
            onTypeSelect={handleTypeSelect}
            className={styles.typeButton}
          />

          <button className={styles.filterButton}>
            <TuneIcon sx={{ fontSize: "18px" }} /> Advanced Filter
          </button>

          <button className={styles.sortSection}>Sorted by: Recommended</button>
        </div>
      </div>
      <div className={styles.destinationContainer}>
        {loading && <p>Loading destinations...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && !error && destinations.length === 0 && (
          <p>No destinations found.</p>
        )}

        {!loading &&
          !error &&
          destinations.map((destination) => (
            <Link
              key={destination.destinationId}
              href={`/explore/${destination.destinationId}`}
            >
              <DestinationCard
                image={destination.coverImage || "/fallback.jpg"}
                name={destination.name}
                type={destination.type}
                location={`${destination.city}, ${destination.country}`}
                typeIcon={null}
                rating={destination.averageRating}
                ratingCount={destination.reviewsCount}
                priceRange={destination.priceRange}
              />
            </Link>
          ))}
      </div>
    </div>
  );
}
