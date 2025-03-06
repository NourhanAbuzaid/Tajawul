"use client";

import styles from "@/forms.module.css";
import Input from "app/components/ui/Input";
import Textarea from "app/components/ui/Textarea";
import Dropdown from "app/components/ui/Dropdown";
import Divider from "@mui/material/Divider";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { addDestinationSchema } from "./actions";

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
    contactInfo: "",
    images: "",
    address: "",
    socialMediaLinks: "",
    establishedAt: "",
    longitude: "", // ✅ Defined longitude
    latitude: "", // ✅ Defined latitude
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [cities, setCities] = useState([]);
  const [cityClicked, setCityClicked] = useState(false);

  // Hardcoded list of Arab countries
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

  useEffect(() => {
    const fetchCities = async () => {
      if (!formData.country) {
        setCities([]); // ✅ Clear cities if no country is selected
        return;
      }

      console.log("Fetching cities for country:", formData.country);

      try {
        const response = await fetch(
          "https://countriesnow.space/api/v0.1/countries/cities",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ country: formData.country }),
          }
        );
        const data = await response.json();

        console.log("API Response:", data);

        if (!data.data || data.error) {
          throw new Error("Failed to load cities");
        }

        setCities(data.data.map((city) => ({ value: city, label: city })));
        console.log("Updated Cities:", data.data);
      } catch (error) {
        console.error("Error fetching cities:", error);
        setCities([]);
      }
    };

    fetchCities();
  }, [formData.country]); // ✅ Fetch cities only when country changes

  useEffect(() => {
    const savedData = localStorage.getItem("createDestinationForm");
    if (savedData) {
      setFormData((prev) => ({
        ...JSON.parse(savedData),
        country: "", // ✅ Reset country
        city: "", // ✅ Reset city
      }));
    }
  }, []);

  const saveToLocalStorage = useCallback(
    debounce((data) => {
      const { country, city, ...filteredData } = data; // ✅ Exclude country & city
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

    if (name === "country") {
      setCities([]);
    }

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

  const formatTime = (timeStr) => {
    return timeStr ? `${timeStr}:00` : "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    const formattedData = {
      ...formData,
      openTime: formatTime(formData.openTime),
      closeTime: formatTime(formData.closeTime),
      establishedAt: formData.establishedAt
        ? new Date(formData.establishedAt).toISOString()
        : "",
      contactInfo: formData.contactInfo
        ? formData.contactInfo.split(",").map((c) => c.trim())
        : [],
      images: formData.images
        ? formData.images.split(",").map((img) => img.trim())
        : [],
      socialMediaLinks: formData.socialMediaLinks
        ? formData.socialMediaLinks.split(",").map((link) => link.trim())
        : [],
    };

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

    try {
      const response = await axios.post(
        "/api/proxy/createDestination",
        formattedData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setSuccess(response.data.message || "Destination created successfully!");
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
        contactInfo: "",
        images: "",
        address: "",
        socialMediaLinks: "",
        establishedAt: "",
        longitude: "", // ✅ Defined longitude
        latitude: "", // ✅ Defined latitude
      });
      localStorage.removeItem("createDestinationForm");
    } catch (err) {
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
          {/* Country Dropdown */}
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

        {/* City Dropdown (Disabled if no country is selected) */}
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
          value={formData.address}
          onChange={handleChange}
          errorMsg={errors.address}
        />

        <div className={styles.formRow}>
          <Input
            label="Longitude"
            id="longitude"
            type="text"
            required
            value={formData.longitude}
            onChange={handleChange}
            errorMsg={errors.longitude}
          />
          <Input
            label="Latitude"
            id="latitude"
            type="text"
            required
            value={formData.latitude}
            onChange={handleChange}
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
        <Dropdown
          label="Price Range"
          id="priceRange"
          required
          value={formData.priceRange} // ✅ Fixed incorrect value assignment
          onChange={handleChange}
          options={[
            { value: "low", label: "$ Low" },
            { value: "mid-range", label: "$$ Mid-range" },
            { value: "luxury", label: "$$$ Luxury" },
          ]}
          errorMsg={errors.priceRange} // ✅ Fixed incorrect error reference
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
        <Input
          label="Contact Info (comma-separated)"
          id="contactInfo"
          type="text"
          value={formData.contactInfo || ""}
          onChange={handleChange}
          errorMsg={errors.contactInfo}
        />

        <Input
          label="Social Media Links (comma-separated URLs)"
          id="socialMediaLinks"
          type="text"
          value={formData.socialMediaLinks || ""}
          onChange={handleChange}
          errorMsg={errors.socialMediaLinks}
        />

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
        <Input
          label="Images (comma-separated URLs)"
          id="images"
          type="text"
          value={formData.images || ""}
          onChange={handleChange}
          errorMsg={errors.images}
        />

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
