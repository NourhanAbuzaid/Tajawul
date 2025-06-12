"use client";

import React, { useState } from "react";
import styles from "./DestinationCard.module.css";
import PriceRange from "./tags/PriceRange";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Image from "next/image";
import PublicIcon from "@mui/icons-material/Public";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const TripCard = ({
  image,
  name,
  priceRange,
  tripDuration,
  isSameCountry,
}) => {
  const [imageSrc, setImageSrc] = useState(image || "/fallback.jpg");
  const fallbackImage = "/fallback.jpg";

  const handleWishlist = () => {
    alert(`Added ${name} to wishlist!`);
  };

  const handleImageError = () => {
    setImageSrc(fallbackImage);
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        {imageSrc && (
          <Image
            src={imageSrc}
            alt={name}
            className={styles.image}
            width={290}
            height={430}
            onLoad={(event) => {
              const img = event.currentTarget;
              if (img.naturalWidth === 0) {
                handleImageError();
              }
            }}
            onError={handleImageError}
          />
        )}
        <div className={styles.topContainer}>
          <PriceRange priceRange={priceRange} />
          <button className={styles.wishlistButton} onClick={handleWishlist}>
            <FavoriteBorderIcon sx={{ color: "var(--Neutrals-Background)" }} />
          </button>
        </div>

        <div className={styles.tripInfoTag}>
          <div className={styles.infoItem}>
            <CalendarTodayIcon style={{ fontSize: "16px" }} />
            <span>{tripDuration} days</span>
          </div>
          <div className={styles.infoItem}>
            <PublicIcon style={{ fontSize: "16px" }} />
            <span>{isSameCountry ? "Single country" : "Multiple countries"}</span>
          </div>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.top}>
          <span className={styles.name}>{name}</span>
          <div className={styles.description}>
            {isSameCountry ? (
              <span className={styles.sameCountry}>Domestic trip</span>
            ) : (
              <span className={styles.multiCountry}>International trip</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripCard;