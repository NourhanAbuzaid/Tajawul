"use client";
import { useState } from "react";
import styles from "./TagQuestion.module.css";

export default function TagQuestion({
  question,
  options,
  selectedValues = [],
  onChange,
  required = false,
  disabled = false,
}) {
  const [selectedTags, setSelectedTags] = useState(selectedValues);

  const handleTagClick = (value) => {
    const newSelectedTags = selectedTags.includes(value)
      ? selectedTags.filter((v) => v !== value) // Deselect if already selected
      : [...selectedTags, value]; // Select if not already selected

    setSelectedTags(newSelectedTags);
    onChange({ target: { name: question, value: newSelectedTags } });
  };

  return (
    <div className={styles.questionContainer}>
      {/* Question Label */}
      <label className={styles.question}>
        {question} {required && <span className={styles.requiredMark}>*</span>}
      </label>

      {/* Tags Container */}
      <div className={styles.optionsContainer}>
        {options.map((option) => (
          <button
            key={option.value}
            className={`${styles.optionButton} ${
              selectedTags.includes(option.value) ? styles.selected : ""
            }`}
            onClick={() => !disabled && handleTagClick(option.value)}
            disabled={disabled}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
