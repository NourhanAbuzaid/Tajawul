"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./ImageList.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const ImageList = ({ images = [] }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleNext = () => {
    setSelectedIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setSelectedIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainImageWrapper}>
        <button onClick={handlePrev} className={styles.arrowLeft}>
          <ArrowBackIcon />
        </button>
        <div className={styles.mainImage}>
          <Image
            src={images[selectedIndex]}
            alt="Selected"
            layout="fill"
            objectFit="cover"
          />
        </div>
        <button onClick={handleNext} className={styles.arrowRight}>
          <ArrowForwardIcon />
        </button>
      </div>
      <div className={styles.thumbnailWrapper}>
        {images.map((image, index) => (
          <div key={index} className={styles.thumbnail}>
            <Image
              src={image}
              alt={`Thumbnail ${index}`}
              layout="fill"
              objectFit="cover"
              className={index === selectedIndex ? styles.active : ""}
              onClick={() => setSelectedIndex(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageList;
