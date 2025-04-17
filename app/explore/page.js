"use client";

import Link from "next/link";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
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
  const [rateLimited, setRateLimited] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const cache = useRef({});
  const debounceTimeout = useRef(null);
  const cancelRequest = useRef(null);

  const fetchDestinations = async (country = null, type = null) => {
    const cacheKey = `${country || "all"}-${type || "all"}`;

    // Return cached data if available
    if (cache.current[cacheKey]) {
      setDestinations(cache.current[cacheKey]);
      return;
    }

    // Clear any pending timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Cancel previous request if it exists
    if (typeof cancelRequest.current === "function") {
      cancelRequest.current("Operation canceled by new request");
    }

    // Set a new timeout
    debounceTimeout.current = setTimeout(async () => {
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
          cancelToken: new axios.CancelToken(
            (c) => (cancelRequest.current = c)
          ),
        });
        const data = response.data.destinations || [];
        setDestinations(data);
        cache.current[cacheKey] = data; // Cache the response
        setError(null);
        setRateLimited(false);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request canceled:", err.message);
        } else {
          console.error("Error fetching destinations:", err);
          if (err.response?.status === 429) {
            setError("Too many requests. Please wait a moment.");
            setRateLimited(true);
            // Auto-reset after 5 seconds
            setTimeout(() => setRateLimited(false), 5000);
          } else {
            setError("Failed to load destinations.");
          }
          setDestinations([]);
        }
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms delay
  };

  useEffect(() => {
    fetchDestinations();
    return () => {
      // Cleanup on unmount
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      if (typeof cancelRequest.current === "function") {
        cancelRequest.current("Component unmounted");
      }
    };
  }, []);

  const handleCountrySelect = (country) => {
    if (rateLimited) return;
    setSelectedCountry(country);
    fetchDestinations(country, selectedType);
  };

  const handleTypeSelect = (type) => {
    if (rateLimited) return;
    setSelectedType(type);
    fetchDestinations(selectedCountry, type);
  };

  return (
    <div className={styles.exploreContainer}>
      <div className={styles.searchSection}>
        <h1>
          {selectedCountry
            ? `Explore ${selectedCountry}`
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
