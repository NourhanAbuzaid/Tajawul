"use client";
import styles from "./Input.module.css";

export default function Input({
  label,
  id,
  required,
  pattern,
  type,
  minLength,
  min,
  max,
  description,
  errorMsg,
}) {
  return (
    <div className={styles.inputContainer}>
      <label className={styles.inputLabel} htmlFor={id}>
        {label}
        {description && (
          <span className={styles.inputDescription}>{description}</span>
        )}
      </label>
      <input
        className={`${styles.inputField} ${errorMsg ? styles.error : ""}`}
        type={type}
        name={id}
        id={id}
        required={required}
        pattern={pattern}
        minLength={minLength}
        min={min}
        max={max}
      />
      <div className={styles.inputError}>
        {errorMsg && <span>{errorMsg}</span>}
      </div>
    </div>
  );
}
