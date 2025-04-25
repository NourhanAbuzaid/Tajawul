import styles from "@/forms.module.css";
import React, { useState, useEffect } from "react";
import TagQuestion from "@/components/ui/TagQuestion";
import { groupSizeIcons } from "@/utils/tagIconsMapping";
import axios from "axios";

const durationOptions = [
  { label: "Day", value: "day" },
  { label: "3 Days", value: "3 days" },
  { label: "Week", value: "week" },
  { label: "2 Weeks", value: "2 weeks" },
  { label: "Month", value: "month" },
  { label: "More than a month", value: "more than a month" },
];

const budgetOptions = [
  { label: "$ Low", value: "low" },
  { label: "$$ Mid-range", value: "mid-range" },
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
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagsOptions, setTagsOptions] = useState([]);
  const [destinationTypesOptions, setDestinationTypesOptions] = useState([]);
  const [activitiesOptions, setActivitiesOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
              value: item.name.toLowerCase().replace(/\s+/g, "-"),
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

  const handleTagChange = (e) => {
    setSelectedTags(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Selected Tags:", selectedTags);
  };

  if (isLoading) return <div>Loading options...</div>;
  if (error) return <div>Error loading options. Please try again later.</div>;

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
      <TagQuestion
        question="What types of travel experiences excite you the most?"
        options={tagsOptions}
        selectedValues={selectedTags}
        onChange={handleTagChange}
        required
      />
      <TagQuestion
        question="Which destinations are you most interested in?"
        options={destinationTypesOptions}
        selectedValues={selectedTags}
        onChange={handleTagChange}
        required
      />
      <TagQuestion
        question="What activities do you enjoy while traveling?"
        options={activitiesOptions}
        selectedValues={selectedTags}
        onChange={handleTagChange}
        required
      />
      <TagQuestion
        question="How long do your trips usually last?"
        options={durationOptions}
        selectedValues={selectedTags}
        onChange={handleTagChange}
        required
      />
      <TagQuestion
        question="What's your usual travel budget?"
        options={budgetOptions}
        selectedValues={selectedTags}
        onChange={handleTagChange}
        required
      />
      <TagQuestion
        question="Who do you usually travel with?"
        options={groupSizeOptions}
        selectedValues={selectedTags}
        onChange={handleTagChange}
        required
      />
    </div>
  );
}
