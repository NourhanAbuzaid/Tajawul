'use client';

import TripCard from "@/components/ui/TripCard";
import styles from "./TripsHub.module.css";
import { useState, useEffect } from "react";
import { GreenLoading } from "@/components/ui/Loading";

export default function TripsHubClient({ initialTrips }) {
  const [trips, setTrips] = useState(initialTrips?.trips || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Fetch trips client-side if initial data is empty
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${baseUrl}/Trip?Visibility=Triphub`);
        if (!response.ok) {
          throw new Error(`Failed to fetch trips (Status: ${response.status})`);
        }
        const data = await response.json();
        setTrips(data.trips || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching trips:", err);
        setError(err.message);
        setTrips([]);
      } finally {
        setLoading(false);
      }
    };

    if (trips.length === 0) {
      fetchTrips();
    }
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Available Trips</h1>
      
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", margin: "2rem" }}>
          <GreenLoading />
        </div>
      ) : (
        <>
          {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
          
          <div className={styles.tripsGrid}>
            {trips && trips.length > 0 ? (
              trips.map((trip) => (
                <TripCard 
                  key={trip.id} 
                  trip={trip}
                />
              ))
            ) : (
              <div className={styles.noTrips}>
                <p>No trips available at the moment</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}