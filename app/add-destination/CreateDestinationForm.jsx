"use client";

import styles from "@/forms.module.css";
import Input from "app/components/ui/Input";
import { useState, useEffect, useCallback } from "react";
import { addDestinationSchema } from "./actions";

// Utility function for debouncing
const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

export default function CreateDestinationForm() {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
    coverImage: "",
    country: "",
    city: "",
    openTime: "",
    closeTime: "",
    priceRange: "",
    contactInfo: [],
    images: [],
    address: "",
    socialMediaLinks: [],
    establishedAt: "",
  });

  const [errors, setErrors] = useState({});

  // Load saved form data from local storage
  useEffect(() => {
    const savedData = localStorage.getItem("createDestinationForm");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  // Save form data to local storage with debounce
  const saveToLocalStorage = useCallback(
    debounce((data) => {
      localStorage.setItem("createDestinationForm", JSON.stringify(data));
    }, 500),
    []
  );

  useEffect(() => {
    saveToLocalStorage(formData);
  }, [formData, saveToLocalStorage]);

  // Handle Input Changes with Validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    try {
      addDestinationSchema
        .pick({ [name]: addDestinationSchema.shape[name] })
        .parse({ [name]: value });
      setErrors((prev) => ({ ...prev, [name]: null }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, [name]: error.errors[0].message }));
    }
  };

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const validation = addDestinationSchema.safeParse(formData);
    if (!validation.success) {
      const newErrors = validation.error.format();
      setErrors(
        Object.keys(newErrors).reduce((acc, key) => {
          acc[key] = newErrors[key]?._errors?.[0] || "";
          return acc;
        }, {})
      );
      return;
    }

    console.log("Destination Created:", formData);
  };

  return (
    <div className={styles.formContainer}>
      <form className={styles.formWidth} onSubmit={handleSubmit}>
        <Input
          label="Destination Name"
          id="name"
          type="text"
          required
          value={formData.name}
          onChange={handleChange}
          errorMsg={errors.name}
        />

        <Input
          label="Type"
          id="type"
          type="text"
          required
          value={formData.type}
          onChange={handleChange}
          errorMsg={errors.type}
        />

        <Input
          label="Description"
          id="description"
          type="text"
          required
          value={formData.description}
          onChange={handleChange}
          errorMsg={errors.description}
        />

        <Input
          label="Cover Image URL"
          id="coverImage"
          type="text"
          required
          value={formData.coverImage}
          onChange={handleChange}
          errorMsg={errors.coverImage}
        />

        <div className={styles.formRow}>
          <Input
            label="Country"
            id="country"
            type="text"
            required
            value={formData.country}
            onChange={handleChange}
            errorMsg={errors.country}
          />
          <Input
            label="City"
            id="city"
            type="text"
            required
            value={formData.city}
            onChange={handleChange}
            errorMsg={errors.city}
          />
        </div>

        <Input
          label="Open Time"
          id="openTime"
          type="time"
          required
          value={formData.openTime}
          onChange={handleChange}
          errorMsg={errors.openTime}
        />

        <Input
          label="Close Time"
          id="closeTime"
          type="time"
          required
          value={formData.closeTime}
          onChange={handleChange}
          errorMsg={errors.closeTime}
        />

        <Input
          label="Price Range"
          id="priceRange"
          type="text"
          required
          value={formData.priceRange}
          onChange={handleChange}
          errorMsg={errors.priceRange}
        />

        <Input
          label="Contact Info"
          id="contactInfo"
          type="text"
          required
          value={formData.contactInfo}
          onChange={handleChange}
          errorMsg={errors.contactInfo}
        />

        <Input
          label="Images (comma-separated URLs)"
          id="images"
          type="text"
          required
          value={formData.images}
          onChange={handleChange}
          errorMsg={errors.images}
        />

        <Input
          label="Address"
          id="address"
          type="text"
          required
          value={formData.address}
          onChange={handleChange}
          errorMsg={errors.address}
        />

        <Input
          label="Social Media Links (comma-separated URLs)"
          id="socialMediaLinks"
          type="text"
          required
          value={formData.socialMediaLinks}
          onChange={handleChange}
          errorMsg={errors.socialMediaLinks}
        />

        <Input
          label="Established At"
          id="establishedAt"
          type="date"
          required
          value={formData.establishedAt}
          onChange={handleChange}
          errorMsg={errors.establishedAt}
        />

        <button type="submit" className={styles.submitButton}>
          Create Destination
        </button>
      </form>
    </div>
  );
}
