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
  placeholder = "Select an option",
  disabled = false,
  sortDirection = "ascending", // New prop with default value
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const dropdownRef = useRef(null);

  // ✅ Reset searchText when value changes (e.g., when the country is changed)
  useEffect(() => {
    const selectedOption = options.find((opt) => opt.value === value);
    setSearchText(selectedOption ? selectedOption.label : "");
  }, [value, options]);

  // Sort options alphabetically by label based on sortDirection
  const sortedOptions = [...options].sort((a, b) => {
    const comparison = a.label.localeCompare(b.label);
    return sortDirection === "ascending" ? comparison : -comparison;
  });

  const filteredOptions = sortedOptions.filter((opt) =>
    opt.label.toLowerCase().includes(searchText.toLowerCase())
  );

  const toggleDropdown = () => {
    if (!disabled) setIsOpen((prev) => !prev);
  };

  const handleSelect = (selectedValue) => {
    onChange({ target: { name: id, value: selectedValue } });
    setSearchText(
      options.find((opt) => opt.value === selectedValue)?.label || ""
    );
    setIsOpen(false);
  };

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
        {label} {required && <span className={styles.requiredMark}>*</span>}
        {description && (
          <span className={styles.dropdownDescription}>{description}</span>
        )}
      </label>

      <div
        className={`${styles.dropdownWrapper} ${isOpen ? styles.active : ""} ${
          disabled ? styles.disabled : ""
        }`}
        onClick={toggleDropdown}
      >
        <input
          type="text"
          className={styles.searchInput}
          value={searchText}
          onChange={(e) => {
            if (!disabled) {
              setSearchText(e.target.value);
              setIsOpen(true);
            }
          }}
          placeholder={placeholder}
          autoComplete="off"
          disabled={disabled}
        />

        <KeyboardArrowDownIcon
          className={`${styles.dropdownIcon} ${isOpen ? styles.rotated : ""}`}
        />
      </div>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <div
                key={index}
                className={styles.dropdownItem}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </div>
            ))
          ) : (
            <div className={styles.noResults}>No results found</div>
          )}
        </div>
      )}

      {errorMsg && <div className={styles.dropdownError}>{errorMsg}</div>}
    </div>
  );
}
