"use client";

import styles from "@/forms.module.css";
import CoverUpload from "@/components/ui/CoverUpload";
import ImageListUpload from "@/components/ui/ImageListUpload";
import API from "@/utils/api";

export default function UploadDestinationImages() {
  const handleCoverUpload = (event) => {
    console.log("Cover Image Uploaded:", event.target.value);
    // You can handle the cover image upload logic here
  };

  const handleImageListUpload = (event) => {
    console.log("Image List Uploaded:", event.target.value);
    // You can handle the image list upload logic here
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

      <ImageListUpload
        label="Destination Images"
        id="destinationImages"
        onUpload={handleImageListUpload}
        description="You can also upload up to 5 additional images to showcase your destination. These images are optional but help provide a better visual experience for visitors."
      />
    </div>
  );
}
