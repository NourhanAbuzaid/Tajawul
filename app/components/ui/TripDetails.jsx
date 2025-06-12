import axios from "axios";
import Image from "next/image";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import Stats from "@/components/ui/Stats";
import styles from "@/trip.module.css";
import TripInteractions from "./TripInteractions";
import TripIdHandler from "@/components/TripIdHandler";
import SameCountry from "@/components/ui/SameCountry";
import ImageList from "@/components/ui/ImageList";


import PriceRange from "./tags/PriceRange";
import EditTags from "@/components/ui/TripAddOrEditTags";
import Tag from "./tags/Tag";

export default async function TripDetails({ tripId }) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

let trip = null;
let destinations = [];
let tags = [];
let contributersData = { users: [] };

try {
  // 1. Fetch trip data
  const { data: tripData } = await axios.get(
    `${baseUrl}/Trip/${tripId}`
  );

  // 2. Fetch destinations for this trip
  const { data: destinationsData } = await axios.get(
    `${baseUrl}/Trip/${tripId}/destinations`
  );

  // 3. Fetch tags for this trip
  const { data: tagsData } = await axios.get(
    `${baseUrl}/Trip/${tripId}/tags`
  );

  // 4. Fetch contributors
  const { data: contributersResponse } = await axios.get(
    `${baseUrl}/Trip/${tripId}/users?Relation=contribute`
  );
  
  contributersData = contributersResponse || { users: [] };
  console.log("Raw tags response:", tagsData);

  trip = tripData; // Assuming the response is the trip object directly

  // Process destinations and tags
  destinations = destinationsData || [];
  tags = tagsData || []; // Assuming tagsData is already an array of tag names

  if (!trip) throw new Error("Trip not found");

  console.log("Processed Trip Details:", {
    trip,
    destinations,
    tags,
    contributers: contributersData.users
  });
} catch (error) {
  console.error("Failed to fetch trip details:", error);
  if (error.response) {
    console.error("Response data:", error.response.data);
    console.error("Status code:", error.response.status);
  }
  contributersData = { users: [] };
}

  return (
    <div>
      <TripIdHandler tripId={tripId} />
      <div className={styles.coverWrapper}>
        <div className={styles.tripCover}>
          {trip?.coverImage && (
            <Image
              src={trip.coverImage}
              alt={`Trip: ${trip.title}`}
              fill={true}
              style={{ objectFit: "cover" }}
              priority
            />
          )}
        </div>
        <div className={styles.coverContent}>
          <div className={styles.buttomContainer}>
            <div className={styles.buttomLeftContainer}>
              <h1 className={styles.tripTitle}>{trip?.title}</h1>
            </div>
            <div className={styles.buttomRightContainer}>
              <TripInteractions tripId={tripId} />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.leftColumn}>
          <div id="tags" className={`${styles.section} ${styles.tagsContainer}`}>
            <div className={styles.headerRow}>
              <div className={styles.tagsWrapper}>
                {trip?.priceRange && (
                  <Tag options={[trip.priceRange]} type="price" />
                )}
                {trip?.tripDuration && (
                  <Tag options={[trip.tripDuration]} type="duration" />
                )}
                {trip?.status && (
                  <Tag options={[trip.status]} type="status" />
                )}
              </div>
              <Divider
                sx={{
                  height: "1px",
                  width: "100%",
                  bgcolor: "var(--Neutrals-Light-Outline)",
                  my: "16px",
                }}
              />
              {tags.length > 0 ? (
                <div className={styles.tagsWrapper}>
                  <Tag options={tags} />
                </div>
              ) : (
                <div className={styles.noTagsMessage}>
                  No tags added yet
                </div>
              )}
              <div className={styles.editButtonContainer}>
                <EditTags tripId={tripId} />
              </div>
            </div>
          </div>
          <div id="destinations" className={styles.section}>
          <h2>Destinations ({trip?.destinationCount || 0})</h2>
          {destinations.length > 0 ? (
            <>
              <div className={styles.destinationsSlider}>
                <ImageList
                  images={destinations.map(dest => ({
                    id: dest.id,
                    url: dest.images?.[0] || dest.coverImage,
                    alt: dest.name
                  }))}
                  showThumbnails={true}
                  showFullScreen={true}
                />
              </div>
              <div className={styles.destinationsGrid}>
                {destinations.map((destination) => (
                  <div key={destination.id} className={styles.destinationCard}>
                    {/* Destination card content */}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p>No destinations added yet</p>
          )}
        </div>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.section}>
            <div className={styles.timeContainer}>
              <SameCountry sameCountry={trip?.sameCountry} />
            </div>
            
            <Divider sx={{ 
              height: "1px", 
              width: "100%", 
              bgcolor: "var(--Neutrals-Light-Outline)",
              my: "16px" 
            }} />
            
            <div className={styles.statsContainer}>
              <Stats type="Favorites" count={trip?.favoritesCount} />
              <Stats type="Wishes" count={trip?.wishesCount} />
            </div>
            
            <Divider sx={{ 
              height: "1px", 
              width: "100%", 
              bgcolor: "var(--Neutrals-Light-Outline)",
              my: "16px" 
            }} />
            
            <h2>About</h2>
            <p className={styles.description}>{trip?.description}</p>
          </div>

          <div id="contributers" className={styles.section}>
            <h2>Contributers</h2>
            <div className={styles.contributersList}>
              <div className={styles.contributerItem}>
                <Avatar
                  alt={trip?.creator?.name}
                  src={trip?.creator?.profileImage}
                  sx={{ width: 40, height: 40 }}
                />
                <div className={styles.contributerInfo}>
                  <span className={styles.contributerLabel}>Created by:</span>
                  <span className={styles.contributerName}>{trip?.creator?.name}</span>
                </div>
              </div>
              
              {trip?.clonedFrom && (
                <div className={styles.contributerItem}>
                  <Avatar
                    alt={trip?.clonedFrom?.creator?.name}
                    src={trip?.clonedFrom?.creator?.profileImage}
                    sx={{ width: 40, height: 40 }}
                  />
                  <div className={styles.contributerInfo}>
                    <span className={styles.contributerLabel}>Cloned from:</span>
                    <span className={styles.contributerName}>{trip?.clonedFrom?.creator?.name}</span>
                  </div>
                </div>
              )}
              
              {trip?.clonedBy && trip.clonedBy.length > 0 && (
                <div className={styles.contributerItem}>
                  <div className={styles.clonedByContainer}>
                    <span className={styles.contributerLabel}>Cloned by:</span>
                    <div className={styles.clonedByAvatars}>
                      {trip.clonedBy.slice(0, 3).map((user, index) => (
                        <Avatar
                          key={index}
                          alt={user.name}
                          src={user.profileImage}
                          sx={{ width: 32, height: 32 }}
                        />
                      ))}
                      {trip.clonedBy.length > 3 && (
                        <span className={styles.moreClones}>+{trip.clonedBy.length - 3}</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}