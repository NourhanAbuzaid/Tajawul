"use client";
import styles from "./ImageUpload.module.css";
import { useState } from "react";
import Image from "next/image";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";

export default function CoverUpload({
  label,
  id,
  required,
  onUpload,
  description,
  errorMsg,
  accept = "image/*",
  disabled = false,
}) {
  const [filePreview, setFilePreview] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFilePreview(e.target.result);
          onUpload({ target: { name: id, value: e.target.result } });
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview("");
        onUpload({ target: { name: id, value: "" } });
      }
    } else {
      setFilePreview("");
      onUpload({ target: { name: id, value: "" } });
    }
  };

  const handleRemoveImage = () => {
    setFilePreview("");
    onUpload({ target: { name: id, value: "" } });
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

      {/* Display cover preview if available */}
      <div className={styles.previewContainer}>
        {filePreview && (
          <div className={styles.coverPreview}>
            <Image
              src={filePreview}
              alt="Cover Preview"
              width={800}
              height={300}
              style={{ objectFit: "cover" }}
              priority
              className={styles.coverImage}
            />
            <button
              className={styles.coverRemoveButton}
              onClick={handleRemoveImage}
            >
              <CloseIcon />
            </button>
          </div>
        )}
      </div>

      {errorMsg && <div className={styles.fileUploadError}>{errorMsg}</div>}
    </div>
  );
}
