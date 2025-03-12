"use client";
import styles from "./ImageUpload.module.css";
import { useState } from "react";
import Image from "next/image";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close"; // Import the close icon for the remove button

export default function ImageUpload({
  label,
  id,
  required,
  onUpload, // Changed from onChange to onUpload
  description,
  errorMsg,
  accept = "image/*", // Restrict to image files
  disabled = false,
}) {
  const [filePreview, setFilePreview] = useState(""); // For image preview

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFilePreview(e.target.result); // Set image preview
          onUpload({ target: { name: id, value: e.target.result } }); // Pass the file URL to the parent
        };
        reader.readAsDataURL(file); // Convert file to data URL
      } else {
        setFilePreview("");
        onUpload({ target: { name: id, value: "" } }); // Clear the value if the file is not an image
      }
    } else {
      setFilePreview("");
      onUpload({ target: { name: id, value: "" } }); // Clear the value if no file is selected
    }
  };

  const handleRemoveImage = () => {
    setFilePreview(""); // Clear the preview
    onUpload({ target: { name: id, value: "" } }); // Notify the parent that the image is removed
  };

  return (
    <div className={styles.fileUploadContainer}>
      <label className={styles.fileUploadLabel} htmlFor={id}>
        {label} {required && <span className={styles.requiredMark}>*</span>}
        {description && (
          <span className={styles.fileUploadDescription}>{description}</span>
        )}
      </label>

      <div className={styles.fileUploadWrapper}>
        <input
          type="file"
          id={id}
          name={id}
          className={styles.fileInput}
          onChange={handleFileChange}
          accept={accept}
          disabled={disabled}
        />
        <label htmlFor={id} className={styles.fileUploadButton}>
          <AddPhotoAlternateIcon /> Choose File
        </label>
      </div>

      {/* Display image preview if available */}
      <div className={styles.previewContainer}>
        {filePreview && (
          <div className={styles.imagePreview}>
            <Image
              src={filePreview}
              alt="Preview"
              width={300}
              height={300}
              style={{ objectFit: "cover" }}
              priority
              className={styles.image}
            />
            {/* Remove button */}
            <button className={styles.removeButton} onClick={handleRemoveImage}>
              <CloseIcon />
            </button>
          </div>
        )}
      </div>

      {errorMsg && <div className={styles.fileUploadError}>{errorMsg}</div>}
    </div>
  );
}
