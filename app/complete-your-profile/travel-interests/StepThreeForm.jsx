import styles from "@/forms.module.css";
import React, { useState, useEffect } from "react";
import InterestsTagQuestion from "@/components/ui/InterestsTagQuestion";
import { groupSizeIcons } from "@/utils/tagIconsMapping";
import axios from "axios";
import ErrorMessage from "app/components/ui/ErrorMessage";
import SuccessMessage from "app/components/ui/SuccessMessage";
import API from "@/utils/api";

const durationOptions = [
  { label: "Day", value: "Day" },
  { label: "3 Days", value: "3 Days" },
  { label: "Week", value: "Week" },
  { label: "2 Weeks", value: "2 Weeks" },
  { label: "Month", value: "Month" },
  { label: "More than a month", value: "More than Month" },
];

const budgetOptions = [
  { label: "$ Low", value: "low" },
  { label: "$$ Mid-range", value: "mid" },
  { label: "$$$$ Luxury", value: "luxury" },
];

const groupSizeOptions = [
  { label: "Solo", value: "solo", icon: groupSizeIcons.solo },
  { label: "Couple", value: "couple", icon: groupSizeIcons.couple },
  { label: "Family", value: "family", icon: groupSizeIcons.family },
  { label: "Group", value: "group", icon: groupSizeIcons.group },
  {
    label: "Big Group",
    value: "big-group",
    icon: groupSizeIcons["big-group"],
  },
];

export default function StepThreeForm() {
  const [selectedTags, setSelectedTags] = useState({
    tags: [],
    destinationTypes: [],
    activities: [],
    tripDurations: [],
    priceRanges: [],
    groupSizes: [],
  });
  const [tagsOptions, setTagsOptions] = useState([]);
  const [destinationTypesOptions, setDestinationTypesOptions] = useState([]);
  const [activitiesOptions, setActivitiesOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        // Fetch all options in parallel
        const [tagsResponse, destinationTypesResponse, activitiesResponse] =
          await Promise.all([
            axios.get(`${baseUrl}/tags`),
            axios.get(`${baseUrl}/destination-types`),
            axios.get(`${baseUrl}/activities`),
          ]);

        // Process the responses to match the expected format
        const processOptions = (items) => {
          return (
            items?.map((item) => ({
              label: item.name,
              value: item.name.toLowerCase(),
            })) || []
          );
        };

        setTagsOptions(processOptions(tagsResponse.data));
        setDestinationTypesOptions(
          processOptions(destinationTypesResponse.data)
        );
        setActivitiesOptions(processOptions(activitiesResponse.data));

        setIsLoading(false);
      } catch (err) {
        console.error("Failed to fetch options:", err);
        setError(err);
        setIsLoading(false);
      }
    };

    fetchOptions();
  }, [baseUrl]);

  const handleTagChange = (field) => (selectedValues) => {
    setSelectedTags((prev) => ({
      ...prev,
      [field]: selectedValues,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError(null);
    setSuccess("");

    try {
      // Prepare the request body according to the API specification
      const requestBody = {
        destinationTypes: selectedTags.destinationTypes,
        groupSizes: selectedTags.groupSizes,
        activities: selectedTags.activities,
        tags: selectedTags.tags,
        tripDurations: selectedTags.tripDurations,
        priceRanges: selectedTags.priceRanges,
      };

      console.log("Submitting interests:", requestBody); // For debugging

      // Submit the data to the API using the API instance
      const response = await API.post("/User/interests", requestBody);

      console.log("API response:", response.data); // For debugging
      setSuccess(
        response.data.message || "Travel preferences saved successfully!"
      );
    } catch (err) {
      console.error("API Request Failed:", err.response?.data || err.message);
      setError(
        err.response?.data?.message || "Failed to save travel preferences."
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  if (isLoading) return <div>Loading options...</div>;
  if (error && !submitLoading)
    return <div>Error loading options. Please try again later.</div>;

  return (
    <div>
      <p className={styles.subheaderStepTwo}>
        Step Two: Tell Us About Your Travel Preferences
      </p>
      <p className={styles.descriptionStepTwo}>
        <strong>Choose All that may apply, </strong>Help us understand your
        travel style so we can recommend the best destinations and experiences
        for you.
      </p>

      <form onSubmit={handleSubmit}>
        <InterestsTagQuestion
          question="What types of travel experiences excite you the most?"
          options={tagsOptions}
          selectedValues={selectedTags.tags}
          onChange={handleTagChange("tags")}
          required
        />
        <InterestsTagQuestion
          question="Which destinations are you most interested in?"
          options={destinationTypesOptions}
          selectedValues={selectedTags.destinationTypes}
          onChange={handleTagChange("destinationTypes")}
          required
        />
        <InterestsTagQuestion
          question="What activities do you enjoy while traveling?"
          options={activitiesOptions}
          selectedValues={selectedTags.activities}
          onChange={handleTagChange("activities")}
          required
        />
        <InterestsTagQuestion
          question="How long do your trips usually last?"
          options={durationOptions}
          selectedValues={selectedTags.tripDurations}
          onChange={handleTagChange("tripDurations")}
          required
        />
        <InterestsTagQuestion
          question="What's your usual travel budget?"
          options={budgetOptions}
          selectedValues={selectedTags.priceRanges}
          onChange={handleTagChange("priceRanges")}
          required
        />
        <InterestsTagQuestion
          question="Who do you usually travel with?"
          options={groupSizeOptions}
          selectedValues={selectedTags.groupSizes}
          onChange={handleTagChange("groupSizes")}
          required
        />

        {success && <SuccessMessage message={success} />}
        {error && <ErrorMessage message={error} />}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={submitLoading}
        >
          {submitLoading ? "Submitting..." : "Save Preferences"}
        </button>
      </form>
    </div>
  );
}
