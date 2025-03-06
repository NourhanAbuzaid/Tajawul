"use client";

import styles from "@/forms.module.css";
import Input from "app/components/ui/Input";
import Textarea from "app/components/ui/Textarea";
import Dropdown from "app/components/ui/Dropdown";
import Divider from "@mui/material/Divider";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { addDestinationSchema } from "./actions";

// Debounce utility function to limit the number of calls to saveToLocalStorage
const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

// State to hold form data, including all input fields
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
    longitude: "",
    latitude: "",
  });

  // State for validation errors
  const [errors, setErrors] = useState({});

  // Loading state for form submission
  const [loading, setLoading] = useState(false);

  // Success and error messages for user feedback
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // State to store fetched cities based on selected country
  const [cities, setCities] = useState([]);

  // State to track whether the city dropdown was clicked
  const [cityClicked, setCityClicked] = useState(false);

  // State to manage dynamic contact information inputs
  const [contactInfo, setContactInfo] = useState([]);

  // State to store social media links
  const [socialMediaLinks, setSocialMediaLinks] = useState([]);

  const [imageUrls, setImageUrls] = useState([]);

  // Function to Add a New Contact Input (Phone or Website)
  const addContactInfo = (type) => {
    setContactInfo([...contactInfo, { type, value: "" }]);
  };

  const addSocialMediaLink = () => {
    setSocialMediaLinks([...socialMediaLinks, ""]);
  };

  const addImageUrl = () => {
    setImageUrls([...imageUrls, ""]);
  };

  // Function to Handle Input Change for Dynamic Contact Info
  const handleContactChange = (index, value) => {
    const updatedContacts = [...contactInfo];
    updatedContacts[index].value = value;
    setContactInfo(updatedContacts);

    // Validate input based on type
    let error = "";
    if (updatedContacts[index].type === "phone") {
      if (!/^\+?\d{7,15}$/.test(value)) {
        error = "Invalid phone number format";
      }
    } else if (updatedContacts[index].type === "website") {
      if (!/^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(value)) {
        error = "Invalid website URL";
      }
    }

    // Set errors for each contact input
    setErrors((prev) => ({
      ...prev,
      [`contactInfo-${index}`]: error,
    }));
  };

  const handleSocialMediaChange = (index, value) => {
    const updatedLinks = [...socialMediaLinks];
    updatedLinks[index] = value;
    setSocialMediaLinks(updatedLinks);

    // Validate URL format
    let error = "";
    if (!/^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(value)) {
      error = "Invalid social media URL";
    }

    // Set errors for each social media input
    setErrors((prev) => ({
      ...prev,
      [`socialMedia-${index}`]: error,
    }));
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...imageUrls];
    updatedImages[index] = value;
    setImageUrls(updatedImages);

    // Validate URL format
    let error = "";
    if (!/^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(value)) {
      error = "Invalid image URL";
    }

    // Set errors for each image input
    setErrors((prev) => ({
      ...prev,
      [`image-${index}`]: error,
    }));
  };

  // Function to Remove a Contact Info Input
  const removeContactInfo = (index) => {
    const updatedContacts = contactInfo.filter((_, i) => i !== index);
    setContactInfo(updatedContacts);
  };

  const removeSocialMediaLink = (index) => {
    const updatedLinks = socialMediaLinks.filter((_, i) => i !== index);
    setSocialMediaLinks(updatedLinks);
  };

  const removeImageUrl = (index) => {
    const updatedImages = imageUrls.filter((_, i) => i !== index);
    setImageUrls(updatedImages);
  };

  // Hardcoded list of Arab countries with formatted options for dropdown
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

  // Fetching Cities When a Country is Selected
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

  // Load saved form data from local storage
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

  // Save form data to local storage
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

  // Handle form input changes
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

  // Format time input to HH:MM format
  const formatTime = (timeStr) => {
    return timeStr ? `${timeStr}:00` : "";
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    // Validate Contact Info: Store errors separately
    let contactErrors = {};
    const validatedContactInfo = contactInfo
      .map((c, index) => {
        let error = "";
        if (c.type === "phone") {
          if (!/^\+?\d{7,15}$/.test(c.value)) {
            error = "Invalid Phone Number Format";
          }
        } else if (c.type === "website") {
          if (!/^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(c.value)) {
            error = "Invalid Website URL";
          }
        }

        if (error) {
          contactErrors[`contactInfo-${index}`] = error;
          return null; // Exclude invalid entries
        }

        return c.value;
      })
      .filter((c) => c); // Remove null values

    // Update error state for contact info
    setErrors((prev) => ({
      ...prev,
      ...contactErrors,
    }));

    if (Object.keys(contactErrors).length > 0) {
      setLoading(false);
      return; // Stop submission if errors exist
    }

    // Format data before submission
    const formattedData = {
      ...formData,
      openTime: formatTime(formData.openTime),
      closeTime: formatTime(formData.closeTime),
      establishedAt: formData.establishedAt
        ? new Date(formData.establishedAt).toISOString()
        : "",
      contactInfo: contactInfo.map((c) => c.value).filter((c) => c),
      socialMediaLinks: socialMediaLinks.filter((link) => link),
      images: imageUrls.filter((img) => img), // ✅ Includes only valid image URLs
    };

    // Validate the formatted data
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
      // Send data to API
      const response = await axios.post(
        "/api/proxy/createDestination",
        formattedData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setSuccess(response.data.message || "Destination created successfully!");

      // Reset form fields after successful submission
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
        longitude: "",
        latitude: "",
      });

      setContactInfo([]); // ✅ Clears dynamic contact inputs
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
        {/* Buttons to Add Phone Number, Website, or Social Media */}
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
            onClick={addSocialMediaLink} // ✅ Adds social media input
            className={styles.addButton}
          >
            + Add Social Media
          </button>
        </div>

        {/* Dynamic Inputs for Contact Info */}
        {contactInfo.map((contact, index) => (
          <div key={index} className={styles.contactInput}>
            <Input
              label={contact.type === "phone" ? "Phone Number" : "Website"}
              id={`contact-${index}`}
              type={contact.type === "phone" ? "tel" : "url"}
              value={contact.value}
              onChange={(e) => handleContactChange(index, e.target.value)}
              errorMsg={errors[`contactInfo-${index}`]} // ✅ Display dynamic error message
            />
            <button
              type="button"
              onClick={() => removeContactInfo(index)}
              className={styles.removeButton}
            >
              Remove
            </button>
          </div>
        ))}

        {/* Dynamic Inputs for Social Media Links */}
        {socialMediaLinks.map((link, index) => (
          <div key={index} className={styles.contactInput}>
            <Input
              label="Social Media Link"
              id={`socialMedia-${index}`}
              type="url"
              value={link}
              onChange={(e) => handleSocialMediaChange(index, e.target.value)}
              errorMsg={errors[`socialMedia-${index}`]} // ✅ Displays validation error
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
        {/* Button to Add Images */}
        <div className={styles.contactButtons}>
          <button
            type="button"
            onClick={addImageUrl} // ✅ Adds image input
            className={styles.addButton}
          >
            + Add Image
          </button>
        </div>

        {/* Dynamic Inputs for Image URLs */}
        {imageUrls.map((img, index) => (
          <div key={index} className={styles.contactInput}>
            <Input
              label="Image URL"
              id={`image-${index}`}
              type="url"
              value={img}
              onChange={(e) => handleImageChange(index, e.target.value)}
              errorMsg={errors[`image-${index}`]} // ✅ Displays validation error
            />
            <button
              type="button"
              onClick={() => removeImageUrl(index)}
              className={styles.removeButton}
            >
              Remove
            </button>
          </div>
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
