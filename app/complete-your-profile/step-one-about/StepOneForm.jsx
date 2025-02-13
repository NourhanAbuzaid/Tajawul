"use client";

import styles from "../forms.module.css";
import Input from "app/components/ui/Input";
import { useState } from "react";

export default function StepOneForm() {
  const [formData, setFormData] = useState({
    phoneNumber: "",
    address: "",
    birthDate: "",
    nationality: "",
    gender: "",
    preferredLanguage: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };

  return (
    <div className={styles.formContainer}>
      <form className={styles.formWidth}>
        <Input
          label="Phone Number"
          id="phoneNumber"
          type="tel"
          required
          pattern="^\+?[0-9]{10,15}$"
          description="Include country code if applicable."
          onChange={handleChange}
        />

        <Input
          label="Birth Date"
          id="birthDate"
          type="date"
          required
          onChange={handleChange}
        />
        <div className={styles.formRow}>
          <Input
            label="Country"
            id="country"
            type="text"
            required
            minLength={5}
            onChange={handleChange}
          />
          <Input
            label="City"
            id="city"
            type="text"
            required
            minLength={5}
            onChange={handleChange}
          />
        </div>
        <Input
          label="Address"
          id="address"
          type="text"
          required
          minLength={5}
          onChange={handleChange}
        />

        <Input
          label="Nationality"
          id="nationality"
          type="text"
          required
          description="If more than one, separate by commas."
          onChange={handleChange}
        />

        <Input
          label="Gender"
          id="gender"
          type="text"
          required
          description="Male, Female"
          onChange={handleChange}
        />

        <Input
          label="Preferred Language"
          id="preferredLanguage"
          type="text"
          required
          onChange={handleChange}
        />

        <button type="submit" className={styles.submitButton}>
          Send Reset Link
        </button>
      </form>
    </div>
  );
}
