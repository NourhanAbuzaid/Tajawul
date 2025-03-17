"use client";
import styles from "./ImageUpload.module.css";
import { useState } from "react";
import Image from "next/image";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";
import { Modal, IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export default function ImageListUpload({
  label,
  id,
  required,
  onUpload,
  description,
  errorMsg,
  accept = "image/*",
  disabled = false,
}) {
  const [filePreviews, setFilePreviews] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files).slice(0, 5 - filePreviews.length);
      const newPreviews = [];
      newFiles.forEach((file) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            newPreviews.push(e.target.result);
            if (newPreviews.length === newFiles.length) {
              setFilePreviews([...filePreviews, ...newPreviews]);
              onUpload({
                target: { name: id, value: [...filePreviews, ...newPreviews] },
              });
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const handleRemoveImage = (index) => {
    const newPreviews = filePreviews.filter((_, i) => i !== index);
    setFilePreviews(newPreviews);
    onUpload({ target: { name: id, value: newPreviews } });
  };

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
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
          <AddPhotoAlternateIcon /> Choose File
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
              className={styles.removeButton}
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

      {/* Modal for full-size image */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <div className={styles.modalContainer}>
          <IconButton
            className={styles.modalCloseButton}
            onClick={handleCloseModal}
          >
            <CloseIcon />
          </IconButton>
          <IconButton
            className={styles.modalArrowLeft}
            onClick={handlePreviousImage}
          >
            <ArrowBackIosIcon />
          </IconButton>
          <Image
            src={filePreviews[selectedImageIndex]}
            alt={`Full Preview ${selectedImageIndex + 1}`}
            width={600}
            height={400}
            style={{ objectFit: "contain" }}
          />
          <IconButton
            className={styles.modalArrowRight}
            onClick={handleNextImage}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </div>
      </Modal>

      {errorMsg && <div className={styles.fileUploadError}>{errorMsg}</div>}
    </div>
  );
}
