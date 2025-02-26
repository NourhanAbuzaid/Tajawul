"use client";

import React from "react";
import styles from "./DestinationCard.module.css";
import Rating from "./Rating";
import Tag from "./Tag";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PlaceIcon from "@mui/icons-material/Place";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const DestinationCard = ({
  image,
  name,
  type,
  location,
  typeIcon,
  rating,
  ratingCount,
  priceRange,
  onOpen,
  onWishlist,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={image} alt={name} />
        <button className={styles.wishlistButton} onClick={onWishlist}>
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
          <button className={styles.viewMore} onClick={onOpen}>
            <ArrowForwardIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;
