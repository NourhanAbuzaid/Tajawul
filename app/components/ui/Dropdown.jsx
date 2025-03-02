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
  placeholder,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const dropdownRef = useRef(null);

  // Filter options based on search input
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchText.toLowerCase())
  );

  // Toggle dropdown
  const toggleDropdown = () => setIsOpen((prev) => !prev);

  // Select option
  const handleSelect = (selectedValue) => {
    onChange({ target: { name: id, value: selectedValue } });
    setSearchText(
      options.find((opt) => opt.value === selectedValue)?.label || ""
    );
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
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
        <input
          type="text"
          className={styles.searchInput}
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setIsOpen(true);
          }}
          placeholder={placeholder}
          autoComplete="off"
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
