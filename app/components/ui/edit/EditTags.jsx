"use client";

import { useState } from "react";
import styles from "./EditPopup.module.css";
import TagQuestion from "../TagQuestion";
import ErrorMessage from "@/components/ui/ErrorMessage";
import SuccessMessage from "@/components/ui/SuccessMessage";
import API from "@/utils/api";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function EditTags({ destinationId }) {
  const [showPopup, setShowPopup] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1 for Tags, 2 for Group Size & Activities
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [groupSize, setGroupSize] = useState([]);
  const [tags, setTags] = useState([]);
  const [activities, setActivities] = useState([]);

  const groupSizeOptions = [
    { value: "solo", label: "Solo" },
    { value: "couple", label: "Couple" },
    { value: "family", label: "Family" },
    { value: "friends", label: "Friends" },
    { value: "large-group", label: "Large Group" },
  ];

  const tagsOptions = [
    { value: "historic", label: "Historic" },
    { value: "modern", label: "Modern" },
    { value: "scenic", label: "Scenic" },
    { value: "urban", label: "Urban" },
    { value: "rural", label: "Rural" },
    { value: "luxury", label: "Luxury" },
    { value: "budget", label: "Budget" },
  ];

  const activitiesOptions = [
    { value: "hiking", label: "Hiking" },
    { value: "swimming", label: "Swimming" },
    { value: "sightseeing", label: "Sightseeing" },
    { value: "shopping", label: "Shopping" },
    { value: "dining", label: "Dining" },
    { value: "photography", label: "Photography" },
    { value: "adventure", label: "Adventure" },
  ];

  const handleGroupSizeChange = (e) => {
    setGroupSize(e.target.value);
  };

  const handleTagsChange = (e) => {
    setTags(e.target.value);
  };

  const handleActivitiesChange = (e) => {
    setActivities(e.target.value);
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
      const response = await API.put(`/Destination/${destinationId}/tags`, {
        groupSize,
        tags,
        activities,
      });

      if (response.status === 200) {
        setSuccess("Tags updated successfully!");
        setTimeout(() => {
          setShowPopup(false);
          setSuccess("");
          setCurrentStep(1); // Reset to first step when closing
        }, 2000);
      }
    } catch (err) {
      console.error("Failed to update tags:", err);
      setError(err.response?.data?.message || "Failed to update tags.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button className={styles.editButton} onClick={() => setShowPopup(true)}>
        <EditIcon sx={{ fontSize: 22 }} /> Edit Tags
      </button>

      {showPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <button
              className={styles.closeButton}
              onClick={() => {
                setShowPopup(false);
                setCurrentStep(1); // Reset to first step when closing
              }}
            >
              ✕
            </button>

            <h2>Add/Edit Destination Tags</h2>
            <p>Choose all that best describes this destination</p>

            <div className={styles.formContainer}>
              {currentStep === 1 ? (
                <>
                  <TagQuestion
                    question="Tags"
                    options={tagsOptions}
                    selectedValues={tags}
                    onChange={handleTagsChange}
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
                  <TagQuestion
                    question="Group Size"
                    options={groupSizeOptions}
                    selectedValues={groupSize}
                    onChange={handleGroupSizeChange}
                    size="small"
                  />
                  <TagQuestion
                    question="Activities"
                    options={activitiesOptions}
                    selectedValues={activities}
                    onChange={handleActivitiesChange}
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
                disabled={loading}
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
