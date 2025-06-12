"use client";

import { useEffect, useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import API from "@/utils/api";
import useAuthStore from "@/store/authStore";
import styles from "@/trip.module.css";
import { SmolGreenLoading } from "./Loading";

const TripInteractions = ({ tripId }) => {
  const [interactions, setInteractions] = useState({
    favorite: false,
    wish: false,
    clone: false
  });
  const [loading, setLoading] = useState(true);
  const { accessToken } = useAuthStore();
  const [showCoverUpload, setShowCoverUpload] = useState(false);

  useEffect(() => {
    const fetchInteractionStatus = async () => {
      try {
        if (!accessToken) {
          setLoading(false);
          return;
        }

        const response = await API.get(`/user/trip/${tripId}/status`);
        if (response.data) {
          setInteractions({
            favorite: response.data.favorite || false,
            wish: response.data.wish || false,
            clone: response.data.clone || false
          });
        }
      } catch (error) {
        console.error("Failed to fetch interaction status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInteractionStatus();
  }, [tripId, accessToken]);

  const handleInteraction = async (type) => {
    try {
      const currentValue = interactions[type];
      setInteractions((prev) => ({ ...prev, [type]: !currentValue }));

      if (currentValue) {
        await API.delete(`/user/trip/${tripId}/${type}`);
      } else {
        await API.post(`/user/trip/${tripId}/${type}`);
      }
    } catch (error) {
      console.error(`Failed to update ${type} status:`, error);
      setInteractions((prev) => ({ ...prev, [type]: !prev[type] }));
    }
  };

  if (loading) {
    return (
      <div className={styles.buttomRightContainer}>
        <button className={styles.saveButton}>
          <SmolGreenLoading />
        </button>
        <button className={styles.saveButton}>
          <SmolGreenLoading />
        </button>
        <button className={styles.saveButton}>
          <SmolGreenLoading />
        </button>
      </div>
    );
  }

  if (!accessToken) {
    return (
      <div className={styles.buttomRightContainer}>
        <div className={styles.saveButton}>Sign in to interact</div>
      </div>
    );
  }

  return (
    <div className={styles.buttomRightContainer}>
      {/* Camera Icon Button */}
      <button
        className={styles.cameraButton}
        onClick={() => setShowCoverUpload(true)}
        aria-label="Change cover photo"
      >
        <CameraAltIcon fontSize="small" />
      </button>

      {/* Favorite Button */}
      <button
        className={`${styles.saveButton} ${
          interactions.favorite ? styles.activeButton : ""
        }`}
        onClick={() => handleInteraction("favorite")}
      >
        {interactions.favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        {interactions.favorite ? "Favorited" : "Favorite"}
      </button>

      {/* Wish Button */}
      <button
        className={`${styles.saveButton} ${
          interactions.wish ? styles.activeButton : ""
        }`}
        onClick={() => handleInteraction("wish")}
      >
        {interactions.wish ? <BookmarkIcon /> : <BookmarkBorderIcon />}
        {interactions.wish ? "Wished" : "Wish"}
      </button>

      {/* Clone Button */}
      <button
        className={`${styles.saveButton} ${
          interactions.clone ? styles.activeButton : ""
        }`}
        onClick={() => handleInteraction("clone")}
      >
        <ContentCopyIcon />
        Clone
      </button>
    </div>
  );
};

export default TripInteractions;