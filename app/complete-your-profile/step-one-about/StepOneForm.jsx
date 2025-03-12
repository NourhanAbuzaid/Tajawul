"use client";

import styles from "@/forms.module.css";
import Input from "app/components/ui/Input";
import Textarea from "app/components/ui/Textarea";
import ImageUpload from "@/components/ui/ImageUpload";
import { RadioGroup, RadioGroupItem } from "app/components/ui/RadioGroup";
import { useState, useEffect, useCallback } from "react";
import { stepOneSchema } from "./actions";

// Utility function for debouncing
const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

export default function StepOneForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    bio: "",
    profilePicture: "",
    phoneNumber: "",
    birthDate: "",
    country: "",
    city: "",
    address: "",
    nationality: "",
    gender: "",
    preferredLanguage: "",
  });

  const [errors, setErrors] = useState({});

  // Load saved form data from local storage
  useEffect(() => {
    const savedData = localStorage.getItem("stepOneForm");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  // Save form data to local storage with debounce
  const saveToLocalStorage = useCallback(
    debounce((data) => {
      localStorage.setItem("stepOneForm", JSON.stringify(data));
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
      stepOneSchema
        .pick({ [name]: stepOneSchema.shape[name] })
        .parse({ [name]: value });
      setErrors((prev) => ({ ...prev, [name]: null }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, [name]: error.errors[0].message }));
    }
  };

  // Handle Gender Selection
  const handleGenderChange = (value) => {
    setFormData((prev) => ({ ...prev, gender: value }));
  };

  const handleFileUpload = (fileUrl) => {
    setFormData((prev) => ({ ...prev, profilePicture: fileUrl }));
  };

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const validation = stepOneSchema.safeParse(formData);
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

    console.log("Moving to step 2 with data:", formData);
  };

  return (
    <div className={styles.formContainer}>
      <form className={styles.formWidth} onSubmit={handleSubmit}>
        <div className={styles.formRow}>
          <Input
            label="First Name"
            id="firstName"
            type="text"
            required
            value={formData.firstName}
            onChange={handleChange}
            errorMsg={errors.firstName}
          />
          <Input
            label="Last Name"
            id="lastName"
            type="text"
            required
            value={formData.lastName}
            onChange={handleChange}
            errorMsg={errors.lastName}
          />
        </div>

        <ImageUpload
          label="Profile Picture"
          id="profilePicture"
          description="Accepted formats: jpg, jpeg, png, webp"
          required
          onUpload={handleFileUpload} // Pass the file URL to the parent
          errorMsg={errors.profilePicture}
          accept="image/*" // Restrict to image files
        />
        <Input
          label="Username"
          id="username"
          type="text"
          required
          value={formData.username}
          onChange={handleChange}
          errorMsg={errors.username}
        />
        <Textarea
          label="Bio"
          id="bio"
          value={formData.bio}
          onChange={handleChange}
          errorMsg={errors.bio}
        />
        <Input
          label="Phone Number"
          id="phoneNumber"
          description="Include country code if applicable."
          type="tel"
          required
          value={formData.phoneNumber}
          onChange={handleChange}
          errorMsg={errors.phoneNumber}
        />

        <Input
          label="Birth Date"
          id="birthDate"
          type="date"
          required
          value={formData.birthDate}
          onChange={handleChange}
          errorMsg={errors.birthDate}
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
          label="Address"
          id="address"
          type="text"
          required
          value={formData.address}
          onChange={handleChange}
          errorMsg={errors.address}
        />

        <Input
          label="Nationality"
          id="nationality"
          type="text"
          required
          value={formData.nationality}
          onChange={handleChange}
          errorMsg={errors.nationality}
        />

        <div className={styles.genderContainer}>
          <span className={styles.label}>Gender</span>
          <RadioGroup
            value={formData.gender}
            onValueChange={handleGenderChange}
          >
            <label style={{ display: "flex", alignItems: "center" }}>
              <RadioGroupItem value="male" />
              Male
            </label>
            <label style={{ display: "flex", alignItems: "center" }}>
              <RadioGroupItem value="female" />
              Female
            </label>
          </RadioGroup>
        </div>

        <Input
          label="Preferred Language"
          id="preferredLanguage"
          type="text"
          required
          value={formData.preferredLanguage}
          onChange={handleChange}
          errorMsg={errors.preferredLanguage}
        />

        <button type="submit" className={styles.submitButton}>
          Next Step
        </button>
      </form>
    </div>
  );
}
