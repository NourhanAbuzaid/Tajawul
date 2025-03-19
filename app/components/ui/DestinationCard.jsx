"use client";

import React, { useState } from "react";
import styles from "./DestinationCard.module.css";
import Rating from "./Rating";
import Tag from "./Tag";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PlaceIcon from "@mui/icons-material/Place";
import Image from "next/image";

const DestinationCard = ({
  image,
  name,
  type,
  location,
  typeIcon,
  rating,
  ratingCount,
  priceRange,
}) => {
  const [imageSrc, setImageSrc] = useState(image || "/fallback.jpg"); // Fallback image if image is empty
  const fallbackImage = "/fallback.jpg"; // Path to your fallback image

  const handleWishlist = () => {
    alert(`Added ${name} to wishlist!`);
  };

  const handleImageError = () => {
    // If the image fails to load, set the fallback image
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
                // If the image fails to load, set the fallback image
                handleImageError();
              }
            }}
            onError={handleImageError} // Fallback for additional error handling
          />
        )}
        <button className={styles.wishlistButton} onClick={handleWishlist}>
          <FavoriteBorderIcon sx={{ color: "var(--Neutrals-Background)" }} />
        </button>
        <div className={styles.locationTag}>
          <PlaceIcon style={{ fontSize: "20px" }} /> <p>{location}</p>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.top}>
          <span className={styles.name}>{name}</span>
          <div className={styles.description}>
            <span className={styles.typeIcon}>{typeIcon}</span>
            {type}
          </div>
          <div className={styles.rating}>
            <Rating average={rating} /> <span>{ratingCount}</span>
          </div>
        </div>
        <div className={styles.bottom}>
          <Tag text={priceRange} color="green" />
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;
