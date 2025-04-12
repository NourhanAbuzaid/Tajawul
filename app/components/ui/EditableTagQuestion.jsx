"use client";

import { useState, useEffect } from "react";
import styles from "./TagQuestion.module.css";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";

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

  // Separate selected and unselected options
  const selectedOptions = selectedTags.map((tag) => {
    const optionFromProps = options.find((opt) => opt.value === tag);
    return optionFromProps || { value: tag, label: tag };
  });

  const unselectedOptions = options.filter(
    (option) => !selectedTags.includes(option.value)
  );

  return (
    <div className={`${styles.questionContainer} ${styles[size]}`}>
      <label className={styles.question}>
        {question} {required && <span className={styles.requiredMark}>*</span>}
      </label>

      {/* Selected options section */}
      {selectedOptions.length > 0 && (
        <div className={styles.selectedSection}>
          <div className={styles.optionsContainer}>
            {selectedOptions.map((option) => {
              const wasOriginallySelected = selectedValues.includes(
                option.value
              );
              const isDeleted =
                wasOriginallySelected && !selectedTags.includes(option.value);

              return (
                <button
                  key={option.value}
                  className={`${styles.optionButton} ${styles.selected} ${
                    isDeleted ? styles.deleted : ""
                  }`}
                  onClick={() => !disabled && handleTagClick(option.value)}
                  disabled={disabled}
                >
                  <span className={styles.iconContainer}>
                    {option.icon && option.icon}
                    {option.label}
                    <span className={styles.closeIcon}>
                      <CloseIcon fontSize="small" />
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Divider between sections */}
      {selectedOptions.length > 0 && unselectedOptions.length > 0 && (
        <Divider sx={{ width: "100%", my: 1 }} />
      )}

      {/* Unselected options section */}
      {unselectedOptions.length > 0 && (
        <div className={styles.unselectedSection}>
          <div className={styles.optionsContainer}>
            {unselectedOptions.map((option) => (
              <button
                key={option.value}
                className={styles.optionButton}
                onClick={() => !disabled && handleTagClick(option.value)}
                disabled={disabled}
              >
                <span className={styles.iconContainer}>
                  {option.icon && option.icon}
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
