"use client";

import { useState } from "react";
import API from "@/utils/api";
import styles from "app/components/ui/TripPopupUploadImage.css";
import Image from "next/image";
import ErrorMessage from "@/components/ui/ErrorMessage";
import SuccessMessage from "@/components/ui/SuccessMessage";

export default function CoverUploadModal({ tripId, onClose }) {
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleCoverUpload = (event) => {
    if (!event.target.files || event.target.files.length === 0) {
      setError("No file selected");
      return;
    }
    const file = event.target.files[0];
    setCoverImage(file);
  };

  const handleSubmit = async () => {
    if (!coverImage) {
      setError("Please select a cover image");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("coverImage", coverImage);

      const response = await API.put(
        `/Trip/${tripId}/coverImage`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 200) {
        setSuccess("Cover image updated successfully!");
        setTimeout(() => {
          onClose();
          window.location.reload(); // Refresh to show new cover
        }, 1500);
      }
    } catch (err) {
      console.error("Failed to upload cover image:", err);
      setError(err.response?.data?.message || "Failed to upload cover image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        <h2>Update Cover Image</h2>
        
        <div className={styles.uploadContainer}>
          <input
            type="file"
            id="coverUpload"
            accept="image/*"
            onChange={handleCoverUpload}
            className={styles.fileInput}
          />
          <label htmlFor="coverUpload" className={styles.uploadLabel}>
            {coverImage ? (
              <Image
                src={URL.createObjectURL(coverImage)}
                alt="Preview"
                width={300}
                height={200}
                className={styles.previewImage}
              />
            ) : (
              <div className={styles.uploadPlaceholder}>
                <span>Click to select cover image</span>
              </div>
            )}
          </label>
        </div>

        {error && <ErrorMessage message={error} />}
        {success && <SuccessMessage message={success} />}

        <button
          type="button"
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={loading || !coverImage}
        >
          {loading ? "Uploading..." : "Update Cover"}
        </button>
      </div>
    </div>
  );
}