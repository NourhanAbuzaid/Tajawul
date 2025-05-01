"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./ImageList.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

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

  const handleUploadClick = () => {
    // You can implement your upload logic here
    console.log("Upload images clicked");
    // For example: trigger file input, open modal, etc.
  };

  if (images.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyIllustration}>
          <Image
            src="/no-images-upload.svg" // Replace with your illustration
            alt="No images"
            width={300}
            height={300}
          />
        </div>
        <h3 className={styles.emptyTitle}>No Images Found</h3>
        <p className={styles.emptyMessage}>
          You haven't added any images yet. Upload some to get started!
        </p>
        <button onClick={handleUploadClick} className={styles.uploadButton}>
          <CloudUploadIcon className={styles.uploadIcon} />
          Upload Images
        </button>
        <p className={styles.emptyHint}>
          <strong>Supported formats:</strong> JPG, JPEG, PNG, WEBP (Max 2MB)
        </p>
      </div>
    );
  }

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
