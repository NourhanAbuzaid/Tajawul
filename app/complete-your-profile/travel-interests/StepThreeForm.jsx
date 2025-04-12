import React, { useState } from "react";
import TagQuestion from "@/components/ui/TagQuestion";
import { groupSizeIcons } from "@/utils/tagIconsMapping";

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

  const handleTagChange = (e) => {
    setSelectedTags(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Selected Tags:", selectedTags);
  };

  return (
    <div>
      <TagQuestion
        question="How long do you plan to travel?"
        options={durationOptions}
        selectedValues={selectedTags}
        onChange={handleTagChange}
        required
      />
      <TagQuestion
        question="What is your budget range for most of your trips?"
        options={budgetOptions}
        selectedValues={selectedTags}
        onChange={handleTagChange}
        required
      />
      <TagQuestion
        question="What is your preferred group size trips?"
        options={groupSizeOptions}
        selectedValues={selectedTags}
        onChange={handleTagChange}
        required
      />
    </div>
  );
}
