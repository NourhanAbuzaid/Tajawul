"use client";

import styles from "@/forms.module.css";
import Input from "app/components/ui/Input";
import Textarea from "app/components/ui/Textarea";
import ImageUpload from "@/components/ui/ImageUpload";
import MultiDropdown from "@/components/ui/MultiDropdown";
import { RadioGroup, RadioGroupItem } from "app/components/ui/RadioGroup";
import { useState, useEffect, useCallback } from "react";
import { stepOneSchema } from "./actions";
import Dropdown from "app/components/ui/Dropdown";
import allCountriesStates from "@/data/allCountriesStates.json";
import languages from "@/data/languages.json"; // Import the languages.json file

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
    nationality: "", // Nationality is now a dropdown
    gender: "",
    preferredLanguage: "",
    spokenLanguageNamesList: [], // Add this line to store selected languages
  });

  const [errors, setErrors] = useState({});
  const [cities, setCities] = useState([]);
  const [cityClicked, setCityClicked] = useState(false);

  // Load saved form data from local storage
  useEffect(() => {
    const savedData = localStorage.getItem("stepOneForm");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setFormData(parsedData);
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

  // Debounced fetch cities function
  const fetchCities = useCallback(
    debounce((country) => {
      if (!country) {
        setCities([]);
        return;
      }

      const citiesForCountry = allCountriesStates[country] || [];
      setCities(citiesForCountry.map((city) => ({ value: city, label: city })));
    }, 500),
    []
  );

  useEffect(() => {
    fetchCities(formData.country);
  }, [formData.country, fetchCities]);

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

  // Handle Spoken Language Selection
  const handleSpokenLanguagesChange = (selectedLanguages) => {
    setFormData((prev) => ({
      ...prev,
      spokenLanguageNamesList: selectedLanguages,
    }));
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

  // Prepare language options for MultiDropdown
  const languageOptions = languages.map((lang) => ({
    value: lang.English, // Use the English name as the value
    label: lang.English, // Use the English name as the label
  }));

  // Prepare country options for Nationality Dropdown
  const countryOptions = Object.keys(allCountriesStates).map((country) => ({
    value: country,
    label: country,
  }));

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
          onUpload={handleFileUpload}
          errorMsg={errors.profilePicture}
          accept="image/*"
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
          required
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

        {/* Replace Nationality Input with Dropdown */}
        <Dropdown
          label="Nationality"
          id="nationality"
          required
          value={formData.nationality}
          onChange={handleChange}
          options={countryOptions}
          errorMsg={errors.nationality}
        />

        <div className={styles.formRow}>
          <Dropdown
            label="Country"
            id="country"
            required
            value={formData.country}
            onChange={handleChange}
            options={countryOptions}
            errorMsg={errors.country}
          />
          <Dropdown
            label="City"
            id="city"
            required
            value={formData.city}
            onChange={handleChange}
            options={cities}
            errorMsg={
              cityClicked && !formData.country
                ? "Please Select a Country"
                : errors.city
            }
            disabled={!formData.country || cities.length === 0}
            onDropdownClick={() => setCityClicked(true)}
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

        {/* MultiDropdown for Spoken Languages */}
        <MultiDropdown
          label="Spoken Language/s"
          id="spokenLanguages"
          required
          options={languageOptions}
          value={formData.spokenLanguageNamesList}
          onChange={(e) => handleSpokenLanguagesChange(e.target.value)}
        />

        <button type="submit" className={styles.submitButton}>
          Next Step
        </button>
      </form>
    </div>
  );
}
