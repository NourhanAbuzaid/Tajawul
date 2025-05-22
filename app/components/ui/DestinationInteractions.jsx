"use client";

import { useEffect, useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PersonRemoveAlt1Icon from "@mui/icons-material/PersonRemoveAlt1";
import API from "@/utils/api";
import useAuthStore from "@/store/authStore";
import styles from "@/destination.module.css";
import { SmolGreenLoading } from "./Loading";

const DestinationInteractions = ({ destinationId }) => {
  const [interactions, setInteractions] = useState({
    follow: false,
    visit: false,
    wish: false,
  });
  const [loading, setLoading] = useState(true);
  const { accessToken } = useAuthStore();

  useEffect(() => {
    const fetchInteractionStatus = async () => {
      try {
        if (!accessToken) {
          setLoading(false);
          return;
        }

        const response = await API.get(`/user/${destinationId}/status`);
        if (response.data) {
          setInteractions({
            follow: response.data.follow || false,
            visit: response.data.visit || false,
            wish: response.data.wish || false,
          });
        }
      } catch (error) {
        console.error("Failed to fetch interaction status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInteractionStatus();
  }, [destinationId, accessToken]);

  const handleInteraction = async (type) => {
    try {
      const currentValue = interactions[type];
      setInteractions((prev) => ({ ...prev, [type]: !currentValue }));

      if (currentValue) {
        await API.delete(`/user/${destinationId}/${type}`);
      } else {
        await API.post(`/user/${destinationId}/${type}`);
      }
    } catch (error) {
      console.error(`Failed to update ${type} status:`, error);
      setInteractions((prev) => ({ ...prev, [type]: !prev[type] }));
    }
  };

  if (loading) {
    return (
      <>
        <button className={styles.saveButton}>
          <SmolGreenLoading />
        </button>
        <button className={styles.saveButton}>
          <SmolGreenLoading />
        </button>
        <button className={styles.saveButton}>
          <SmolGreenLoading />
        </button>
      </>
    );
  }

  if (!accessToken) {
    return <div className={styles.saveButton}>Sign in to interact</div>;
  }

  return (
    <>
      <button
        className={`${styles.saveButton} ${
          interactions.wish ? styles.activeButton : ""
        }`}
        onClick={() => handleInteraction("wish")}
      >
        {interactions.wish ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        {interactions.wish ? "In Wishlist" : "Add To Wishlist"}
      </button>

      <button
        className={`${styles.saveButton} ${
          interactions.visit ? styles.activeButton : ""
        }`}
        onClick={() => handleInteraction("visit")}
      >
        {interactions.visit ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
        {interactions.visit ? "Visited" : "Visit"}
      </button>

      <button
        className={`${styles.saveButton} ${
          interactions.follow ? styles.activeButton : ""
        }`}
        onClick={() => handleInteraction("follow")}
      >
        {interactions.follow ? <PersonRemoveAlt1Icon /> : <PersonAddAlt1Icon />}
        {interactions.follow ? "Following" : "Follow"}
      </button>
    </>
  );
};

export default DestinationInteractions;
