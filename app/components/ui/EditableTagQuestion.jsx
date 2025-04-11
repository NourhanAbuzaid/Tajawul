"use client";

import { useState, useEffect } from "react";
import styles from "./TagQuestion.module.css";
import CloseIcon from "@mui/icons-material/Close";

export default function EditableTagQuestion({
  question,
  options,
  selectedValues = [],
  onChange,
  onDelete,
  required = false,
  disabled = false,
  size = "default",
}) {
  const [selectedTags, setSelectedTags] = useState(selectedValues);
  const [deletedTags, setDeletedTags] = useState([]);

  useEffect(() => {
    setSelectedTags(selectedValues);
  }, [selectedValues]);

  const handleTagClick = (value) => {
    let newSelectedTags;
    let newDeletedTags = [...deletedTags];

    if (selectedTags.includes(value)) {
      // Removing a tag
      newSelectedTags = selectedTags.filter((v) => v !== value);
      if (selectedValues.includes(value)) {
        // Only add to deletedTags if it was originally selected
        newDeletedTags.push(value);
      }
    } else {
      // Adding a tag
      newSelectedTags = [...selectedTags, value];
      // Remove from deletedTags if it was previously deleted
      newDeletedTags = deletedTags.filter((v) => v !== value);
    }

    setSelectedTags(newSelectedTags);
    setDeletedTags(newDeletedTags);
    onChange({ target: { name: question, value: newSelectedTags } });
    onDelete({ target: { name: question, value: newDeletedTags } });
  };

  const organizedOptions = () => {
    // Create a Set of all unique option values from props
    const allOptionValues = new Set(options.map((opt) => opt.value));

    // First: Show currently selected options (maintaining order)
    const selectedOptions = selectedTags.map((tag) => {
      // Find in options first
      const optionFromProps = options.find((opt) => opt.value === tag);
      // If not found in props, create a basic option
      return optionFromProps || { value: tag, label: tag };
    });

    // Second: Show available options that aren't selected
    const unselectedOptions = options
      .filter((option) => !selectedTags.includes(option.value))
      // Include originally selected but deselected options
      .concat(
        selectedValues
          .filter(
            (tag) => !selectedTags.includes(tag) && !allOptionValues.has(tag)
          )
          .map((tag) => ({ value: tag, label: tag }))
      );

    return [...selectedOptions, ...unselectedOptions];
  };

  return (
    <div className={`${styles.questionContainer} ${styles[size]}`}>
      <label className={styles.question}>
        {question} {required && <span className={styles.requiredMark}>*</span>}
      </label>

      <div className={styles.optionsContainer}>
        {organizedOptions().map((option) => {
          const isSelected = selectedTags.includes(option.value);
          const wasOriginallySelected = selectedValues.includes(option.value);
          const isDeleted = wasOriginallySelected && !isSelected;

          return (
            <button
              key={option.value}
              className={`${styles.optionButton} ${
                isSelected ? styles.selected : ""
              } ${isDeleted ? styles.deleted : ""}`}
              onClick={() => !disabled && handleTagClick(option.value)}
              disabled={disabled}
            >
              <span className={styles.iconContainer}>
                {option.icon && option.icon}
                {option.label}
                {isSelected && (
                  <span className={styles.closeIcon}>
                    <CloseIcon fontSize="small" />
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
