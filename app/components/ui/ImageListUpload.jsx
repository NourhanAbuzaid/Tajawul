"use client";
import styles from "./ImageUpload.module.css";
import { useState } from "react";
import Image from "next/image";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export default function ImageListUpload({
  label,
  id,
  required,
  onUpload,
  description,
  accept = "image/jpeg, image/jpg, image/png, image/webp", // Restrict to JPG, JPEG, PNG, WEBP
  disabled = false,
}) {
  const [filePreviews, setFilePreviews] = useState([]);
  const [files, setFiles] = useState([]); // Store file objects
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [fileSizeError, setFileSizeError] = useState("");

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files).slice(0, 5 - filePreviews.length);
      const newPreviews = [];
      newFiles.forEach((file) => {
        if (file.size > 2 * 1024 * 1024) {
          setFileSizeError("Please choose an image that doesn't exceed 2 MB.");
          return;
        } else {
          setFileSizeError(""); // Clear the error if the file is valid
        }

        if (
          file.type === "image/jpeg" ||
          file.type === "image/jpg" ||
          file.type === "image/png" ||
          file.type === "image/webp"
        ) {
          const reader = new FileReader();
          reader.onload = (e) => {
            newPreviews.push(e.target.result);
            if (newPreviews.length === newFiles.length) {
              setFilePreviews([...filePreviews, ...newPreviews]);
              setFiles((prevFiles) => [...prevFiles, ...newFiles]); // Store file objects
              onUpload(event); // Pass the event object with files
            }
          };
          reader.readAsDataURL(file);
        } else {
          alert("Only JPG, JPEG, PNG, and WEBP files are allowed.");
        }
      });
    }
  };

  const handleRemoveImage = (index) => {
    const newPreviews = filePreviews.filter((_, i) => i !== index);
    const newFiles = files.filter((_, i) => i !== index);
    setFilePreviews(newPreviews);
    setFiles(newFiles);
    onUpload({ target: { files: newFiles } }); // Pass the updated files array
  };

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prevIndex) => (prevIndex + 1) % filePreviews.length);
  };

  const handlePreviousImage = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === 0 ? filePreviews.length - 1 : prevIndex - 1
    );
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
          multiple
        />
        <label htmlFor={id} className={styles.fileUploadButton}>
          <AddPhotoAlternateIcon /> Upload Images
        </label>
      </div>

      {/* Display image list preview if available */}
      <div className={styles.imageListPreview}>
        {filePreviews.map((preview, index) => (
          <div
            key={index}
            className={styles.imageListItem}
            onClick={() => handleImageClick(index)}
          >
            <Image
              src={preview}
              alt={`Preview ${index + 1}`}
              width={100}
              height={100}
              style={{ objectFit: "cover" }}
              className={styles.imageListImage}
            />
            <button
              className={styles.listRemoveButton}
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveImage(index);
              }}
            >
              <CloseIcon />
            </button>
          </div>
        ))}
      </div>

      {/* Custom Popup for full-size image */}
      {popupOpen && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContainer}>
            <button
              className={styles.popupCloseButton}
              onClick={handleClosePopup}
            >
              <CloseIcon />
            </button>
            <button
              className={styles.popupArrowLeft}
              onClick={handlePreviousImage}
            >
              <ArrowForwardIosIcon sx={{ fontSize: "18px" }} />
            </button>
            <Image
              src={filePreviews[selectedImageIndex]}
              alt={`Full Preview ${selectedImageIndex + 1}`}
              width={800}
              height={500}
              style={{ objectFit: "cover" }}
              className={styles.popupImage}
            />
            <button
              className={styles.popupArrowRight}
              onClick={handleNextImage}
            >
              <ArrowForwardIosIcon sx={{ fontSize: "18px" }} />
            </button>
          </div>
        </div>
      )}

      {fileSizeError && (
        <div className={styles.fileUploadError}>{fileSizeError}</div>
      )}
    </div>
  );
}
