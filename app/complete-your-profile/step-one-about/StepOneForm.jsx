"use client";

import styles from "../forms.module.css";
import Input from "app/components/ui/Input";
import { RadioGroup, RadioGroupItem } from "app/components/ui/RadioGroup";
import { useState, useEffect } from "react";
import { stepOneSchema } from "./actions";

export default function StepOneForm() {
  const [formData, setFormData] = useState({
    phoneNumber: "",
    birthDate: "",
    country: "",
    city: "",
    address: "",
    nationality: "",
    gender: "male",
    preferredLanguage: "",
  });

  const [errors, setErrors] = useState({});

  // 🟢 Load saved form data from local storage
  useEffect(() => {
    const savedData = localStorage.getItem("stepOneForm");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  // 🟢 Save to local storage whenever formData changes
  useEffect(() => {
    localStorage.setItem("stepOneForm", JSON.stringify(formData));
  }, [formData]);

  // 🟢 Handle Input Changes and Validate Immediately
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate the field and update errors
    try {
      stepOneSchema
        .pick({ [name]: stepOneSchema.shape[name] })
        .parse({ [name]: value });
      setErrors((prev) => ({ ...prev, [name]: null })); // Clear error if valid
    } catch (error) {
      setErrors((prev) => ({ ...prev, [name]: error.errors[0].message }));
    }
  };

  // 🟢 Handle Radio Button Changes
  const handleGenderChange = (value) => {
    setFormData((prev) => ({ ...prev, gender: value }));
  };

  // 🟢 Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields before proceeding
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

    // Move to next step (Modify this logic as needed)
    console.log("Moving to step 2 with data:", formData);
  };

  return (
    <div className={styles.formContainer}>
      <form className={styles.formWidth} onSubmit={handleSubmit}>
        <Input
          label="Phone Number"
          id="phoneNumber"
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

        {/* ✅ Fixed Gender Selection */}
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
