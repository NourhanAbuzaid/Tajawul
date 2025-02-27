"use client"; // ✅ Now this component can handle events

import React from "react";
import styles from "./DestinationCard.module.css";
import Rating from "./Rating";
import Tag from "./Tag";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PlaceIcon from "@mui/icons-material/Place";

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
  const handleWishlist = () => {
    alert(`Added ${name} to wishlist!`);
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={image} alt={name} className={styles.image} />
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
