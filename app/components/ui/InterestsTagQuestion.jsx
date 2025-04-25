"use client";
import styles from "./TagQuestion.module.css";

export default function InterestsTagQuestion({
  question,
  options,
  selectedValues = [],
  onChange,
  required = false,
  disabled = false,
  size = "default", // 'default' or 'small'
}) {
  const handleTagClick = (value) => {
    const newSelectedTags = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onChange(newSelectedTags);
  };

  return (
    <div className={`${styles.questionContainer} ${styles[size]}`}>
      <label className={styles.question}>
        {question} {required && <span className={styles.requiredMark}>*</span>}
      </label>

      <div className={styles.optionsContainer}>
        {options.map((option) => (
          <button
            key={option.value}
            type="button" // Explicitly set to button to prevent form submission
            className={`${styles.optionButton} ${
              selectedValues.includes(option.value) ? styles.selected : ""
            }`}
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
  );
}
