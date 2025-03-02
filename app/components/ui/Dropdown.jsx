"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./Dropdown.module.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export default function Dropdown({
  label,
  id,
  required,
  value,
  onChange,
  options,
  description,
  errorMsg,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ✅ Toggle Dropdown Open/Close
  const toggleDropdown = () => setIsOpen((prev) => !prev);

  // ✅ Handle selection
  const handleSelect = (selectedValue) => {
    onChange({ target: { name: id, value: selectedValue } });
    setIsOpen(false); // Close dropdown after selection
  };

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className={styles.dropdownContainer} ref={dropdownRef}>
      <label className={styles.dropdownLabel} htmlFor={id}>
        {label}
        {description && (
          <span className={styles.dropdownDescription}>{description}</span>
        )}
      </label>

      <div
        className={`${styles.dropdownWrapper} ${isOpen ? styles.active : ""}`}
        onClick={toggleDropdown}
      >
        <div className={styles.selectedValue}>
          {value
            ? options.find((opt) => opt.value === value)?.label
            : "Select an option"}
        </div>
        <KeyboardArrowDownIcon
          className={`${styles.dropdownIcon} ${isOpen ? styles.rotated : ""}`}
        />
      </div>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          {options.map((option, index) => (
            <div
              key={index}
              className={styles.dropdownItem}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}

      {errorMsg && <div className={styles.dropdownError}>{errorMsg}</div>}
    </div>
  );
}
