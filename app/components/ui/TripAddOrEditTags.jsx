"use client";

import { useState, useEffect } from "react";
import styles from "app/components/ui/edit/EditPopup.module.css";
import EditableTagQuestion from "@/components/ui/EditableTagQuestion";
import ErrorMessage from "@/components/ui/ErrorMessage";
import SuccessMessage from "@/components/ui/SuccessMessage";
import API from "@/utils/api";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import useAuthStore from "@/store/authStore";

export default function EditTags({ destinationId }) {
  const { roles } = useAuthStore();
  const [showPopup, setShowPopup] = useState(false);
  const [showProtectedPopup, setShowProtectedPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [fetchingOptions, setFetchingOptions] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [tags, setTags] = useState([]);
  const [deletedTags, setDeletedTags] = useState([]);
  const [tagsOptions, setTagsOptions] = useState([]);

  const handleOpenPopup = async () => {
    if (!roles.includes("User")) {
      setShowProtectedPopup(true);
      return;
    }

    setFetchingData(true);
    setError("");
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axios.get(
        `${baseUrl}/Destination/${destinationId}/attributes`
      );
      const data = response.data;

      setTags(data.tags?.data?.map((item) => item.name) || []);
      setDeletedTags([]);
      setShowPopup(true);
    } catch (err) {
      console.error("Failed to fetch tags:", err);
      setError("Failed to fetch existing tags. Please try again.");
    } finally {
      setFetchingData(false);
    }
  };

  useEffect(() => {
    const fetchOptions = async () => {
      setFetchingOptions(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const tagsResponse = await axios.get(`${baseUrl}/tags`);

        const processOptions = (items) => {
          return (
            items?.map((item) => ({
              label: item.name,
              value: item.name,
            })) || []
          );
        };

        setTagsOptions(processOptions(tagsResponse.data));
      } catch (err) {
        console.error("Failed to fetch tag options:", err);
        setError("Failed to load tag options. Please try again later.");
      } finally {
        setFetchingOptions(false);
      }
    };

    fetchOptions();
  }, []);

  const handleTagsChange = (e) => {
    // Filter out any values that aren't in our options (new tags are handled by onAddNew)
    const validValues = e.target.value.filter((val) =>
      tagsOptions.some((opt) => opt.value === val)
    );
    setTags(validValues);
  };

  const handleTagsDelete = (e) => {
    setDeletedTags(e.target.value);
  };

  const handleAddNewTag = (newTag) => {
    setTags((prev) => [...prev, newTag.value]);
    // Also update the options to include the new tag
    setTagsOptions((prev) => [
      ...prev,
      { label: newTag.value, value: newTag.value },
    ]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (deletedTags.length > 0) {
        await API.delete(`/Destination/${destinationId}/attributes`, {
          data: {
            tags: deletedTags,
          },
        });
      }

      await API.post(`/Destination/${destinationId}/attributes`, {
        tags: tags,
      });

      setSuccess("Tags updated successfully!");
      setTimeout(() => {
        setShowPopup(false);
        setSuccess("");
      }, 2000);
    } catch (err) {
      console.error("Failed to update tags:", err);
      setError(err.response?.data?.message || "Failed to update tags.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className={styles.editButton}
        onClick={handleOpenPopup}
        disabled={fetchingData || fetchingOptions}
      >
        {fetchingData || fetchingOptions ? (
          "Loading..."
        ) : (
          <>
            <EditIcon sx={{ fontSize: 22 }} /> Edit Tags
          </>
        )}
      </button>

      {showPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <button
              className={styles.closeButton}
              onClick={() => {
                setShowPopup(false);
              }}
            >
              ✕
            </button>

            <h2>Edit Destination Tags</h2>
            <p>Choose tags that best describe this destination</p>

            <div className={styles.formContainer}>
              <EditableTagQuestion
                question="Tags"
                options={tagsOptions}
                selectedValues={tags}
                onChange={handleTagsChange}
                onDelete={handleTagsDelete}
                size="small"
                addNewText="+ Add Tag"
                onAddNew={handleAddNewTag}
              />

              {error && <ErrorMessage message={error} />}
              {success && <SuccessMessage message={success} />}

              <button
                type="button"
                className={styles.submitButton}
                onClick={handleSubmit}
                disabled={loading || fetchingOptions}
              >
                {loading ? "Saving..." : "Save Tags"}
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
}