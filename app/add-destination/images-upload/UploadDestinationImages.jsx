"use client";

import styles from "@/forms.module.css";
import CoverUpload from "@/components/ui/CoverUpload";
import ImageListUpload from "@/components/ui/ImageListUpload";
import API from "@/utils/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ErrorMessage from "@/components/ui/ErrorMessage";
import SuccessMessage from "@/components/ui/SuccessMessage";

export default function UploadDestinationImages() {
  const [destinationId, setDestinationId] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [destinationImages, setDestinationImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Retrieve the destination ID from local storage
    const storedDestinationId = localStorage.getItem("destinationId");
    if (storedDestinationId) {
      setDestinationId(storedDestinationId);
    }
  }, []);

  const handleCoverUpload = (event) => {
    if (!event.target.files || event.target.files.length === 0) {
      console.error("No file selected for cover image.");
      return;
    }

    const file = event.target.files[0];
    if (file) {
      setCoverImage(file);
    }
  };

  const handleImageListUpload = (event) => {
    const files = event.target.files;
    if (files) {
      setDestinationImages(Array.from(files));
    }
  };

  const handleSubmit = async () => {
    console.log("handleSubmit triggered"); // Debugging
    if (!destinationId) {
      setError("Destination ID is missing. Please try again.");
      return;
    }

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      let coverSuccess = false;
      let imagesSuccess = true; // Assume images upload is successful if no images are uploaded

      // Upload Cover Image
      if (coverImage) {
        const coverFormData = new FormData();
        coverFormData.append("ProfileImage", coverImage);

        console.log("Uploading cover image...");
        const coverResponse = await API.put(
          `/Destination/${destinationId}/coverImage`,
          coverFormData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        console.log("Cover image upload response:", coverResponse);
        if (coverResponse.status === 200) coverSuccess = true;
      } else {
        // If no cover image is uploaded, consider it a failure
        setError("Cover image is required.");
        return;
      }

      // Upload Destination Images (optional)
      if (destinationImages.length > 0) {
        const imagesFormData = new FormData();
        destinationImages.forEach((file) => {
          imagesFormData.append("imageFiles", file);
        });

        console.log("Uploading destination images...");
        const imagesResponse = await API.put(
          `/Destination/${destinationId}/images`,
          imagesFormData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        console.log("Destination images upload response:", imagesResponse);
        if (imagesResponse.status === 200) imagesSuccess = true;
      }

      // Set success or error message
      if (coverSuccess && imagesSuccess) {
        setSuccess("Images uploaded successfully!");
      } else if (!coverSuccess) {
        setError("Cover image upload failed.");
      } else if (!imagesSuccess) {
        setError("Destination images upload failed.");
      }
    } catch (err) {
      console.error("Failed to upload images:", err);
      setError(err.response?.data?.message || "Failed to upload images.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <CoverUpload
        label="Cover Image"
        id="coverImage"
        required
        onUpload={handleCoverUpload}
        description="Upload a cover image for your destination. This image will be the main visual representation of your destination."
      />

      <div>
        <ImageListUpload
          label="Destination Images"
          id="destinationImages"
          onUpload={handleImageListUpload}
          description="You can also upload up to 5 additional images to showcase your destination. These images are optional but help provide a better visual experience for visitors."
        />

        {error && <ErrorMessage message={error} />}
        {success && <SuccessMessage message={success} />}

        <button
          type="button"
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Submit Images"}
        </button>
      </div>
    </div>
  );
}
