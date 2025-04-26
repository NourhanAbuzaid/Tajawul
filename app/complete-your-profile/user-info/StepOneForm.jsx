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
import languages from "@/data/languages.json";
import API from "@/utils/api";
import ErrorMessage from "app/components/ui/ErrorMessage";
import SuccessMessage from "app/components/ui/SuccessMessage";
import { Menu, MenuItem, Button, Box } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

// Reusable component for dynamic inputs
const DynamicInput = ({ label, type, value, onChange, errorMsg, onRemove }) => (
  <div className={styles.contactInput}>
    <Input
      label={label}
      type={type}
      value={value}
      onChange={onChange}
      errorMsg={errorMsg}
    />
    <button
      type="button"
      onClick={onRemove}
      className={styles.removeButton}
      aria-label={`Remove ${label}`}
    >
      Remove
    </button>
  </div>
);

const MaritalStatusDropdown = ({ value, onChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (status) => {
    onChange(status);
    handleClose();
  };

  const options = ["Single", "Married", "Divorced", "Widowed"];

  return (
    <Box sx={{ position: "relative" }}>
      <Button
        onClick={handleClick}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "16px 20px",
          height: "46px",
          border: "1px solid var(--Neutrals-Light-Outline)",
          borderRadius: "12px",
          marginTop: "4px",
          marginBottom: "16px",
          cursor: "pointer",
          fontFamily: '"DM Sans"',
          fontWeight: "500",
          letterSpacing: "0",
          color: value
            ? "var(--Neutrals-Black-Text)"
            : "var(--Neutrals-Medium-Outline)",
          backgroundColor: "var(--Neutrals-Background)",
          transition: "all 0.3s ease-in-out",
          textTransform: "capitalize",
          "&:hover": {
            backgroundColor: "var(--Neutrals-Very-Bright)",
          },
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        {value || "Select marital status"}
        <KeyboardArrowDownIcon
          sx={{
            transition: "transform 0.3s ease-in-out",
            transform: open ? "rotate(180deg)" : "rotate(0)",
            fontSize: "18px",
          }}
        />
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
          sx: {
            maxHeight: 400,
            width: "200px",
            padding: "4px",
            "& .MuiMenuItem-root": {
              borderRadius: "8px",
              border: "1px solid #FFF",
              padding: "8px 10px",
              fontFamily: '"DM Sans"',
              fontWeight: "500",
              fontSize: "14px",
              color: "var(--Neutrals-Medium-Outline)",
              transition: "all 0.2s ease-in-out",
              "&:hover, &.Mui-focusVisible": {
                backgroundColor: "var(--Beige-Very-Bright)",
                color: "var(--Neutrals-Black-Text)",
                border: "1px solid var(--Neutrals-Light-Outline)",
              },
            },
          },
        }}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            border: "1px solid var(--Neutrals-Light-Outline)",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            marginTop: "4px",
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option} onClick={() => handleSelect(option)}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

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
    spokenLanguages: [],
    maritalStatus: "",
    socialMediaLinks: [],
  });

  const [errors, setErrors] = useState({});
  const [cities, setCities] = useState([]);
  const [cityClicked, setCityClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

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
      spokenLanguages: selectedLanguages,
    }));
  };

  // Add social media link
  const addSocialMediaLink = () => {
    setFormData((prev) => ({
      ...prev,
      socialMediaLinks: [...prev.socialMediaLinks, { platform: "", url: "" }],
    }));
  };

  // Handle social media changes
  const handleSocialMediaChange = (index, field, value) => {
    const updatedLinks = [...formData.socialMediaLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setFormData((prev) => ({ ...prev, socialMediaLinks: updatedLinks }));

    if (field === "url") {
      let error = "";
      if (!/^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(value)) {
        error = "Invalid social media URL";
      }

      setErrors((prev) => ({ ...prev, [`socialMedia-${index}`]: error }));
    }
  };

  // Remove social media link
  const removeSocialMediaLink = (index) => {
    const updatedLinks = formData.socialMediaLinks.filter(
      (_, i) => i !== index
    );
    setFormData((prev) => ({ ...prev, socialMediaLinks: updatedLinks }));
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted"); // Debugging: Check if this logs
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      // Exclude profilePicture from the data to be submitted
      const { profilePicture, ...dataToSubmit } = formData;

      // Validate the remaining data
      const validation = stepOneSchema.safeParse(dataToSubmit);
      if (!validation.success) {
        const newErrors = validation.error.format();
        console.log("Validation errors:", newErrors); // Debugging: Log validation errors
        setErrors(
          Object.keys(newErrors).reduce((acc, key) => {
            acc[key] = newErrors[key]?._errors?.[0] || "";
            return acc;
          }, {})
        );
        setLoading(false);
        return;
      }

      // Format the data for the API
      const formattedData = {
        username: dataToSubmit.username,
        firstName: dataToSubmit.firstName,
        lastName: dataToSubmit.lastName,
        bio: dataToSubmit.bio,
        phoneNumber: dataToSubmit.phoneNumber,
        birthDate: dataToSubmit.birthDate,
        city: dataToSubmit.city,
        country: dataToSubmit.country,
        nationality: dataToSubmit.nationality,
        gender: dataToSubmit.gender,
        spokenLanguages: dataToSubmit.spokenLanguages,
        maritalStatus: dataToSubmit.maritalStatus,
        socialMediaLinks: dataToSubmit.socialMediaLinks,
      };

      console.log("Formatted data:", formattedData); // Debugging: Log the data being sent

      // Submit the data to the API using the API instance
      const response = await API.post("/User/info", formattedData);

      console.log("API response:", response.data); // Debugging: Log the API response
      setSuccess(response.data.message || "Profile updated successfully!");
    } catch (err) {
      console.error("API Request Failed:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  // Prepare language options for MultiDropdown
  const languageOptions = languages.map((lang) => ({
    value: lang.English,
    label: lang.English,
  }));

  // Prepare country options for Nationality Dropdown
  const countryOptions = Object.keys(allCountriesStates).map((country) => ({
    value: country,
    label: country,
  }));

  return (
    <div>
      <p className={styles.subheaderStepOne}>
        Step One: Tell us more about yourself
      </p>
      <p className={styles.descriptionStepOne}>
        <strong>Help us personalize your travel experiences. </strong> This also
        sets up your profile, unlocking social features to connect with fellow
        travelers who share your interests.
      </p>

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

          {/* Social Media Links Section */}
          <div className={styles.contactButtons}>
            <button
              type="button"
              onClick={addSocialMediaLink}
              className={styles.addButton}
            >
              + Add Social Media
            </button>
          </div>
          {formData.socialMediaLinks.map((link, index) => (
            <div key={index} className={styles.contactInput}>
              <Dropdown
                label="Platform"
                id={`socialMediaPlatform-${index}`}
                required
                value={link.platform}
                onChange={(e) =>
                  handleSocialMediaChange(index, "platform", e.target.value)
                }
                options={[
                  { value: "Facebook", label: "Facebook" },
                  { value: "Instagram", label: "Instagram" },
                  { value: "Twitter", label: "Twitter" },
                  { value: "LinkedIn", label: "LinkedIn" },
                ]}
              />
              <Input
                label="URL"
                id={`socialMediaUrl-${index}`}
                type="url"
                required
                value={link.url}
                onChange={(e) =>
                  handleSocialMediaChange(index, "url", e.target.value)
                }
                errorMsg={errors[`socialMedia-${index}`]}
              />
              <button
                type="button"
                onClick={() => removeSocialMediaLink(index)}
                className={styles.removeButton}
              >
                Remove
              </button>
            </div>
          ))}

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

          <div style={{ width: "100%" }}>
            <label className={styles.label}>Marital Status</label>
            <MaritalStatusDropdown
              value={formData.maritalStatus}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, maritalStatus: value }))
              }
              errorMsg={errors.maritalStatus}
            />
          </div>

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

          <MultiDropdown
            label="Spoken Language/s"
            id="spokenLanguages"
            required
            options={languageOptions}
            value={formData.spokenLanguages}
            onChange={(e) => handleSpokenLanguagesChange(e.target.value)}
          />

          {success && <SuccessMessage message={success} />}
          {error && <ErrorMessage message={error} />}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Next Step"}
          </button>
        </form>
      </div>
    </div>
  );
}
