'use client';

import TripCard from "@/components/ui/TripCard";
import styles from "./TripsHub.module.css";

export default function TripsHubClient({ trips }) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Available Trips</h1>
      
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
    </div>
  );
}