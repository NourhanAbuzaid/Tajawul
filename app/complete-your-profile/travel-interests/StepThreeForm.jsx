import React, { useState } from "react";
import TagQuestion from "@/components/ui/TagQuestion";

const options = [
  { label: "Option 1", value: "1" },
  { label: "Option 2", value: "2" },
  { label: "Option 3", value: "3" },
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
        question="What are your interests?"
        options={options}
        selectedValues={selectedTags}
        onChange={handleTagChange}
        required
      />
    </div>
  );
}
