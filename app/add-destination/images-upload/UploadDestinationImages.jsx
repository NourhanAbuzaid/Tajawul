"use client";
import CoverUpload from "@/components/ui/CoverUpload";
import ImageListUpload from "@/components/ui/ImageListUpload";

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
    <div>
      <h1>Upload Destination Images</h1>
      <div>
        <h2>Cover Image</h2>
        <CoverUpload
          label="Upload Cover Image"
          id="coverImage"
          required
          onUpload={handleCoverUpload}
          description="Upload a cover image for your destination."
          errorMsg="Please upload a valid image."
        />
      </div>
      <div>
        <h2>Destination Images</h2>
        <ImageListUpload
          label="Upload Destination Images"
          id="destinationImages"
          required
          onUpload={handleImageListUpload}
          description="Upload up to 5 images for your destination."
          errorMsg="Please upload valid images."
        />
      </div>
    </div>
  );
}
