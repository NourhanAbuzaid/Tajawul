"use client";

import { useState, useEffect } from "react";
import styles from "./EditPopup.module.css";
import EditableTagQuestion from "../EditableTagQuestion";
import ErrorMessage from "@/components/ui/ErrorMessage";
import SuccessMessage from "@/components/ui/SuccessMessage";
import API from "@/utils/api";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { groupSizeIcons } from "@/utils/tagIconsMapping";

export default function EditTags({ destinationId }) {
  const [showPopup, setShowPopup] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [fetchingOptions, setFetchingOptions] = useState(false); // New state for options loading
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [groupSize, setGroupSize] = useState([]);
  const [tags, setTags] = useState([]);
  const [activities, setActivities] = useState([]);
  const [deletedGroupSizes, setDeletedGroupSizes] = useState([]);
  const [deletedTags, setDeletedTags] = useState([]);
  const [deletedActivities, setDeletedActivities] = useState([]);

  // New state for options
  const [tagsOptions, setTagsOptions] = useState([]);
  const [activitiesOptions, setActivitiesOptions] = useState([]);

  // Fetch options when component mounts
  useEffect(() => {
    const fetchOptions = async () => {
      setFetchingOptions(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const [tagsResponse, activitiesResponse] = await Promise.all([
          axios.get(`${baseUrl}/tags`),
          axios.get(`${baseUrl}/activities`),
        ]);

        // Process the responses to match the expected format
        const processOptions = (items) => {
          return (
            items?.map((item) => ({
              label: item.name,
              value: item.name,
            })) || []
          );
        };

        setTagsOptions(processOptions(tagsResponse.data));
        setActivitiesOptions(processOptions(activitiesResponse.data));
      } catch (err) {
        console.error("Failed to fetch options:", err);
        setError("Failed to load tag options. Please try again later.");
      } finally {
        setFetchingOptions(false);
      }
    };

    fetchOptions();
  }, []);

  const handleOpenPopup = async () => {
    setFetchingData(true);
    setError("");
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axios.get(
        `${baseUrl}/Destination/${destinationId}/attributes`
      );
      const data = response.data;

      setGroupSize(data.groupSizes?.data?.map((item) => item.group) || []);
      setTags(data.tags?.data?.map((item) => item.name) || []);
      setActivities(data.activities?.data?.map((item) => item.name) || []);

      // Reset deleted items when fetching new data
      setDeletedGroupSizes([]);
      setDeletedTags([]);
      setDeletedActivities([]);

      // Only show popup after data is fetched
      setShowPopup(true);
    } catch (err) {
      console.error("Failed to fetch attributes:", err);
      setError("Failed to fetch existing tags. Please try again.");
    } finally {
      setFetchingData(false);
    }
  };

  const groupSizeOptions = [
    { label: "Solo", value: "Solo", icon: groupSizeIcons.solo },
    { label: "Couple", value: "Couple", icon: groupSizeIcons.couple },
    { label: "Family", value: "Family", icon: groupSizeIcons.family },
    { label: "Group", value: "Group", icon: groupSizeIcons.group },
    {
      label: "Big Group",
      value: "Big Group",
      icon: groupSizeIcons["big-group"],
    },
  ];

  const handleGroupSizeChange = (e) => {
    setGroupSize(e.target.value);
  };

  const handleGroupSizeDelete = (e) => {
    setDeletedGroupSizes(e.target.value);
  };

  const handleTagsChange = (e) => {
    setTags(e.target.value);
  };

  const handleTagsDelete = (e) => {
    setDeletedTags(e.target.value);
  };

  const handleActivitiesChange = (e) => {
    setActivities(e.target.value);
  };

  const handleActivitiesDelete = (e) => {
    setDeletedActivities(e.target.value);
  };

  const handleNext = () => {
    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // First delete removed attributes
      if (
        deletedGroupSizes.length > 0 ||
        deletedTags.length > 0 ||
        deletedActivities.length > 0
      ) {
        await API.delete(`/Destination/${destinationId}/attributes`, {
          data: {
            groupSizes: deletedGroupSizes,
            tags: deletedTags,
            activities: deletedActivities,
          },
        });
      }

      // Then add/update remaining attributes
      await API.post(`/Destination/${destinationId}/attributes`, {
        groupSizes: groupSize,
        tags: tags,
        activities: activities,
      });

      setSuccess("Tags updated successfully!");
      setTimeout(() => {
        setShowPopup(false);
        setSuccess("");
        setCurrentStep(1);
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
                setCurrentStep(1);
              }}
            >
              ✕
            </button>

            <h2>Add/Edit Destination Tags</h2>
            <p>Choose all that best describes this destination</p>

            <div className={styles.formContainer}>
              {currentStep === 1 ? (
                <>
                  <EditableTagQuestion
                    question="Tags"
                    options={tagsOptions}
                    selectedValues={tags}
                    onChange={handleTagsChange}
                    onDelete={handleTagsDelete}
                    size="small"
                  />
                </>
              ) : (
                <>
                  <button
                    className={styles.backButton}
                    onClick={handleBack}
                    type="button"
                  >
                    <ArrowBackIcon sx={{ fontSize: 18 }} /> Back
                  </button>
                  <EditableTagQuestion
                    question="Group Size"
                    options={groupSizeOptions}
                    selectedValues={groupSize}
                    onChange={handleGroupSizeChange}
                    onDelete={handleGroupSizeDelete}
                    size="small"
                  />
                  <EditableTagQuestion
                    question="Activities"
                    options={activitiesOptions}
                    selectedValues={activities}
                    onChange={handleActivitiesChange}
                    onDelete={handleActivitiesDelete}
                    size="small"
                  />
                </>
              )}

              {error && <ErrorMessage message={error} />}
              {success && <SuccessMessage message={success} />}

              <button
                type="button"
                className={styles.submitButton}
                onClick={currentStep === 1 ? handleNext : handleSubmit}
                disabled={loading || fetchingOptions}
              >
                {loading
                  ? "Saving..."
                  : currentStep === 1
                  ? "Next"
                  : "Save Tags"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
