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
import Image from "next/image";
import useTripInteractionsStore from "app/store/TripInteractionsStore";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';


const TripInteractions = ({ tripId, onCoverUpdate }) => {
  const [interactions, setInteractions] = useState({
    favorite: false,
    wish: false,
    clone: false
  });
  const [loading, setLoading] = useState(true);
  const { accessToken, roles } = useAuthStore();
  const [showCoverUpload, setShowCoverUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showProtectedPopup, setShowProtectedPopup] = useState(false);

  const { setFavoritesCount, setWishesCount, setClonesCount } = useTripInteractionsStore();

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
    if (!roles.includes("User")) {
      setShowProtectedPopup(true);
      return;
    }

    const currentValue = interactions[type];
    setInteractions((prev) => ({ ...prev, [type]: !currentValue }));

    try {
      const res = currentValue
        ? await API.delete(`/user/trip/${tripId}/${type}`)
        : await API.post(`/user/trip/${tripId}/${type}`);

      if (res?.data) {
        if (res.data.favoritesCount !== undefined)
          setFavoritesCount(res.data.favoritesCount);
        if (res.data.wishesCount !== undefined)
          setWishesCount(res.data.wishesCount);
        if (res.data.clonesCount !== undefined)
          setClonesCount(res.data.clonesCount);
      }
    } catch (error) {
      console.error(`Failed to update ${type} status:`, error);
      setInteractions((prev) => ({ ...prev, [type]: currentValue }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await API.post(`/Trip/${tripId}/coverImage`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data) {
        onCoverUpdate(response.data.coverImage);
        setShowCoverUpload(false);
        setSelectedFile(null);
      }
    } catch (error) {
      console.error("Failed to upload cover image:", error);
    } finally {
      setUploading(false);
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
    return (
      <button
        className={styles.saveButton}
        onClick={() => (window.location.href = "/login")}
      >
        Sign in to interact
      </button>
    );
  }

return (
  <>
    <div className={styles.buttomRightContainer}>
      {/* Camera button moved to the left */}
      <button 
        className={`${styles.saveButton} ${styles.cameraButton}`}
        onClick={() => setShowCoverUpload(true)}
      >
        <CameraAltIcon />
      </button>

      {/* Other interaction buttons */}
      <button
        className={`${styles.saveButton} ${
          interactions.favorite ? styles.activeButton : ""
        }`}
        onClick={() => handleInteraction("favorite")}
      >
        {interactions.favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        {interactions.favorite ? "Favorited" : "Favorite"}
      </button>

      <button
        className={`${styles.saveButton} ${
          interactions.wish ? styles.activeButton : ""
        }`}
        onClick={() => handleInteraction("wish")}
      >
        {interactions.wish ? <BookmarkIcon /> : <BookmarkBorderIcon />}
        {interactions.wish ? "Wished" : "Wish"}
      </button>

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

    {showCoverUpload && (
      <div className={styles.popupOverlay}>
        <div className={styles.popupContainer}>
          <h2>Update Cover Image</h2>
          <p className={styles.popupDescription}>
            Accepted formats: JPG, JPEG, PNG, WEBP<br />
            Maximum file size: 2MB
          </p>
          
          <div className={styles.uploadArea}>
            <input
              type="file"
              id="cover-upload"
              accept="image/*"
              onChange={handleFileChange}
              className={styles.fileInput}
            />
            <label htmlFor="cover-upload" className={styles.uploadCoverButton}>
              <AddPhotoAlternateIcon />
              {selectedFile ? "Change Image" : "Upload Cover"}
            </label>
          </div>
          
          {selectedFile && (
            <div className={styles.previewContainer}>
              <img 
                src={URL.createObjectURL(selectedFile)} 
                alt="Preview" 
                className={styles.imagePreview}
              />
            </div>
          )}
          
          <div className={styles.popupButtons}>
            <button 
              className={styles.popupCancelButton}
              onClick={() => {
                setShowCoverUpload(false);
                setSelectedFile(null);
              }}
            >
              Cancel
            </button>
            <button 
              className={styles.popupConfirmButton}
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
      </div>
    )}

      {showProtectedPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <button
              className={styles.closeButton}
              onClick={() => setShowProtectedPopup(false)}
            >
              ✕
            </button>
            <div className={styles.completedStep}>
              <Image
                src="/protected-feature.svg"
                alt="Protected feature"
                width={450}
                height={350}
                className={styles.completedImage}
              />
              <button
                className={styles.ctaButton}
                onClick={() =>
                  (window.location.href = "/complete-your-profile")
                }
              >
                Complete Your Profile to Access
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TripInteractions;