"use client";

import styles from "@/forms.module.css";
import Input from "app/components/ui/Input";
import Textarea from "app/components/ui/Textarea";
import Dropdown from "app/components/ui/Dropdown";
import Divider from "@mui/material/Divider";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { addDestinationSchema, validateOpenCloseTime } from "./actions";
import DOMPurify from "dompurify";
import useAuthStore from "@/store/authStore";

// Debounce utility function to limit the number of calls to saveToLocalStorage
const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

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

export default function CreateDestinationForm() {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
    coverImage: "",
    priceRange: "",
    country: "",
    city: "",
    locations: [{ longitude: 0, latitude: 0, address: "" }],
    isOpen24Hours: false,
    openTime: "",
    closeTime: "",
    establishedAt: "",
    images: [],
    socialMediaLinks: [],
    contactInfo: [],
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [cities, setCities] = useState([]);
  const [cityClicked, setCityClicked] = useState(false);

  const arabCountries = [
    "Saudi Arabia",
    "United Arab Emirates",
    "Kuwait",
    "Qatar",
    "Bahrain",
    "Oman",
    "Yemen",
    "Jordan",
    "Syria",
    "Lebanon",
    "Palestine",
    "Egypt",
    "Iraq",
    "Libya",
    "Tunisia",
    "Algeria",
    "Morocco",
    "Mauritania",
    "Sudan",
    "Djibouti",
    "Somalia",
    "Comoros",
  ].map((country) => ({ value: country, label: country }));

  // Debounced fetch cities function
  const fetchCities = useCallback(
    debounce(async (country) => {
      if (!country) {
        setCities([]);
        return;
      }

      try {
        const response = await fetch(
          "https://countriesnow.space/api/v0.1/countries/cities",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ country }),
          }
        );
        const data = await response.json();

        if (!data.data || data.error) {
          throw new Error("Failed to load cities");
        }

        setCities(data.data.map((city) => ({ value: city, label: city })));
      } catch (error) {
        console.error("Error fetching cities:", error);
        setCities([]);
      }
    }, 500),
    []
  );

  useEffect(() => {
    fetchCities(formData.country);
  }, [formData.country, fetchCities]);

  // Load saved form data from local storage
  useEffect(() => {
    const savedData = localStorage.getItem("createDestinationForm");
    if (savedData) {
      setFormData((prev) => ({
        ...JSON.parse(savedData),
        country: "",
        city: "",
        locations: savedData.locations?.length
          ? savedData.locations
          : [{ longitude: 0, latitude: 0, address: "" }],
      }));
    }
  }, []);

  // Save form data to local storage
  const saveToLocalStorage = useCallback(
    debounce((data) => {
      const { country, city, ...filteredData } = data;
      localStorage.setItem(
        "createDestinationForm",
        JSON.stringify(filteredData)
      );
    }, 500),
    []
  );

  useEffect(() => {
    saveToLocalStorage(formData);
  }, [formData, saveToLocalStorage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "country" ? { city: "" } : {}),
    }));

    try {
      if (
        value ||
        addDestinationSchema.shape[name]?._def?.isOptional !== true
      ) {
        addDestinationSchema
          .pick({ [name]: addDestinationSchema.shape[name] })
          .parse({ [name]: value });
      }
      setErrors((prev) => ({ ...prev, [name]: null }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, [name]: error.errors[0].message }));
    }
  };

  const handleCheckboxChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      isOpen24Hours: e.target.checked,
      openTime: e.target.checked ? "" : prev.openTime,
      closeTime: e.target.checked ? "" : prev.closeTime,
    }));
  };

  const addContactInfo = (type) => {
    setFormData((prev) => ({
      ...prev,
      contactInfo: [...prev.contactInfo, { type, value: "" }],
    }));
  };

  const addSocialMediaLink = () => {
    setFormData((prev) => ({
      ...prev,
      socialMediaLinks: [...prev.socialMediaLinks, { platform: "", url: "" }],
    }));
  };

  const addImageUrl = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ""],
    }));
  };

  const handleContactChange = (index, value) => {
    const updatedContacts = [...formData.contactInfo];
    updatedContacts[index].value = value;
    setFormData((prev) => ({ ...prev, contactInfo: updatedContacts }));

    let error = "";
    if (updatedContacts[index].type === "phone") {
      if (!/^\+?\d{1,4}[\s\d]{6,15}$/.test(value)) {
        error = "Invalid phone number format";
      }
    } else if (updatedContacts[index].type === "website") {
      if (!/^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(value)) {
        error = "Invalid website URL";
      }
    }

    setErrors((prev) => ({ ...prev, [`contactInfo-${index}`]: error }));
  };

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

  const handleImageChange = (index, value) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = DOMPurify.sanitize(value);
    setFormData((prev) => ({ ...prev, images: updatedImages }));

    let error = "";
    if (!/^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(value)) {
      error = "Invalid image URL";
    }

    setErrors((prev) => ({ ...prev, [`image-${index}`]: error }));
  };

  const handleLocationChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      locations: prev.locations.length
        ? [{ ...prev.locations[0], [field]: value }]
        : [{ longitude: 0, latitude: 0, address: "", [field]: value }],
    }));
  };

  const removeContactInfo = (index) => {
    const updatedContacts = formData.contactInfo.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, contactInfo: updatedContacts }));
  };

  const removeSocialMediaLink = (index) => {
    const updatedLinks = formData.socialMediaLinks.filter(
      (_, i) => i !== index
    );
    setFormData((prev) => ({ ...prev, socialMediaLinks: updatedLinks }));
  };

  const removeImageUrl = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, images: updatedImages }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      validateOpenCloseTime(formData);

      const formattedData = {
        ...formData,
        locations: formData.locations.map((loc) => ({
          longitude: parseFloat(loc.longitude),
          latitude: parseFloat(loc.latitude),
          address: loc.address,
        })),
        images: formData.images.length > 0 ? formData.images : undefined,
        socialMediaLinks:
          formData.socialMediaLinks.length > 0
            ? formData.socialMediaLinks
            : undefined,
        contactInfo:
          formData.contactInfo.length > 0 ? formData.contactInfo : undefined,
      };

      console.log("Submitted Data:", formattedData); // Log the submitted data

      const validation = addDestinationSchema.safeParse(formattedData);
      if (!validation.success) {
        const newErrors = validation.error.format();
        setErrors(
          Object.keys(newErrors).reduce((acc, key) => {
            acc[key] = newErrors[key]?._errors?.[0] || "";
            return acc;
          }, {})
        );
        setLoading(false);
        return;
      }

      // Retrieve the accessToken from the auth store
      const { accessToken } = useAuthStore.getState();

      if (!accessToken) {
        throw new Error("No access token available. Please log in.");
      }

      // Include the accessToken in the headers
      const response = await axios.post(
        "/api/proxy/createDestination",
        formattedData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // Add the token here
          },
        }
      );

      setSuccess(response.data.message || "Destination created successfully!");

      // Reset form fields
      setFormData({
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
        socialMediaLinks: [],
        establishedAt: "",
        locations: [{ longitude: 0, latitude: 0, address: "" }],
        isOpen24Hours: false,
      });

      localStorage.removeItem("createDestinationForm");
    } catch (err) {
      console.error("API Request Failed:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to create destination.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <form className={styles.formWidth} onSubmit={handleSubmit}>
        <h2 className={styles.subheader}>General Info</h2>
        <Divider
          sx={{
            height: "1px",
            width: "100%",
            bgcolor: "var(--Green-Perfect)",
            marginBottom: "20px",
          }}
        />
        <Input
          label="Destination Name"
          id="name"
          type="text"
          required
          value={formData.name}
          onChange={handleChange}
          errorMsg={errors.name}
        />
        <div className={styles.formRow}>
          <Dropdown
            label="Destination Type"
            id="type"
            required
            value={formData.type}
            onChange={handleChange}
            options={[
              { value: "cafe", label: "Cafe" },
              { value: "restaurant", label: "Restaurant" },
              { value: "park", label: "Park" },
              { value: "museum", label: "Museum" },
            ]}
            errorMsg={errors.type}
          />
          <Dropdown
            label="Country"
            id="country"
            required
            value={formData.country}
            onChange={handleChange}
            options={arabCountries}
            errorMsg={errors.country}
          />
        </div>
        <Textarea
          label="Description"
          id="description"
          required
          value={formData.description}
          onChange={handleChange}
          errorMsg={errors.description}
        />
        <Input
          label="Established At"
          id="establishedAt"
          type="date"
          value={formData.establishedAt || ""}
          onChange={handleChange}
          errorMsg={errors.establishedAt}
        />

        <h2 className={styles.subheader}>Location Details</h2>
        <Divider
          sx={{
            height: "1px",
            width: "100%",
            bgcolor: "var(--Green-Perfect)",
            marginBottom: "20px",
          }}
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
        <Input
          label="Address"
          id="address"
          type="text"
          required
          value={formData.locations[0].address}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              locations: [{ ...prev.locations[0], address: e.target.value }],
            }))
          }
          errorMsg={errors.address}
        />
        <div className={styles.formRow}>
          <Input
            label="Longitude"
            id="longitude"
            type="number"
            step="any"
            required
            value={formData.locations?.[0]?.longitude || 0} // ✅ Prevents undefined access
            onChange={(e) => handleLocationChange("longitude", e.target.value)}
            errorMsg={errors.longitude}
          />

          <Input
            label="Latitude"
            id="latitude"
            type="number"
            step="any"
            required
            value={formData.locations?.[0]?.latitude || 0} // ✅ Prevents undefined access
            onChange={(e) => handleLocationChange("latitude", e.target.value)}
            errorMsg={errors.latitude}
          />
        </div>

        <h2 className={styles.subheader}>Operating Hours & Pricing</h2>
        <Divider
          sx={{
            height: "1px",
            width: "100%",
            bgcolor: "var(--Green-Perfect)",
            marginBottom: "20px",
          }}
        />
        <div className={styles.checkboxContainer}>
          <input
            type="checkbox"
            id="isOpen24Hours"
            checked={formData.isOpen24Hours}
            onChange={handleCheckboxChange}
          />
          <label htmlFor="isOpen24Hours">Open 24 Hours</label>
        </div>
        {!formData.isOpen24Hours && (
          <div className={styles.formRow}>
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
          </div>
        )}
        <Dropdown
          label="Price Range"
          id="priceRange"
          required
          value={formData.priceRange}
          onChange={handleChange}
          options={[
            { value: "low", label: "$ Low" },
            { value: "mid-range", label: "$$ Mid-range" },
            { value: "luxury", label: "$$$ Luxury" },
          ]}
          errorMsg={errors.priceRange}
        />

        <h2 className={styles.subheader}>Contact & Social Media</h2>
        <Divider
          sx={{
            height: "1px",
            width: "100%",
            bgcolor: "var(--Green-Perfect)",
            marginBottom: "20px",
          }}
        />
        <div className={styles.contactButtons}>
          <button
            type="button"
            onClick={() => addContactInfo("phone")}
            className={styles.addButton}
          >
            + Add Phone Number
          </button>
          <button
            type="button"
            onClick={() => addContactInfo("website")}
            className={styles.addButton}
          >
            + Add Website
          </button>
          <button
            type="button"
            onClick={addSocialMediaLink}
            className={styles.addButton}
          >
            + Add Social Media
          </button>
        </div>
        {formData.contactInfo.map((contact, index) => (
          <DynamicInput
            key={index}
            label={contact.type === "phone" ? "Phone Number" : "Website"}
            type={contact.type === "phone" ? "tel" : "url"}
            value={contact.value}
            onChange={(e) => handleContactChange(index, e.target.value)}
            errorMsg={errors[`contactInfo-${index}`]}
            onRemove={() => removeContactInfo(index)}
          />
        ))}
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

        <h2 className={styles.subheader}>Media</h2>
        <Divider
          sx={{
            height: "1px",
            width: "100%",
            bgcolor: "var(--Green-Perfect)",
            marginBottom: "20px",
          }}
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
        <div className={styles.contactButtons}>
          <button
            type="button"
            onClick={addImageUrl}
            className={styles.addButton}
          >
            + Add Image
          </button>
        </div>
        {formData.images.map((img, index) => (
          <DynamicInput
            key={index}
            label="Image URL"
            type="url"
            value={img}
            onChange={(e) => handleImageChange(index, e.target.value)}
            errorMsg={errors[`image-${index}`]}
            onRemove={() => removeImageUrl(index)}
          />
        ))}

        {success && <p className={styles.successMessage}>{success}</p>}
        {error && <p className={styles.errorMessage}>{error}</p>}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Destination"}
        </button>
      </form>
    </div>
  );
}
