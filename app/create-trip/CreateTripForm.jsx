"use client";

import styles from "@/forms.module.css";
import Input from "app/components/ui/Input";
import Textarea from "app/components/ui/Textarea";
import Dropdown from "app/components/ui/Dropdown";
import ErrorMessage from "app/components/ui/ErrorMessage";
import SuccessMessage from "app/components/ui/SuccessMessage";
import Divider from "@mui/material/Divider";
import { useState, useEffect, useCallback } from "react";
import { addTripSchema } from "./actions";
import DOMPurify from "dompurify";
import useAuthStore from "@/store/authStore";
import API from "@/utils/api";
import { useRouter } from "next/navigation";

// Debounce utility function
const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

export default function CreateTripForm() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priceRange: "",
    tripDuration: "",
    visibility: "Public",
    status: "Not Started",
    sameCountry: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // Load saved form data from local storage
  useEffect(() => {
    const savedData = localStorage.getItem("createTripForm");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  // Save form data to local storage
  const saveToLocalStorage = useCallback(
    debounce((data) => {
      localStorage.setItem("createTripForm", JSON.stringify(data));
    }, 500),
    []
  );

  useEffect(() => {
    saveToLocalStorage(formData);
  }, [formData, saveToLocalStorage]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle different input types
    const inputValue = type === "checkbox" ? checked : value;

    // Sanitize the description field
    const sanitizedValue =
      name === "description" ? DOMPurify.sanitize(inputValue) : inputValue;

    setFormData((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }));

    // Validation
    try {
      if (
        sanitizedValue ||
        addTripSchema.shape[name]?._def?.isOptional !== true
      ) {
        addTripSchema
          .pick({ [name]: addTripSchema.shape[name] })
          .parse({ [name]: sanitizedValue });
      }
      setErrors((prev) => ({ ...prev, [name]: null }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, [name]: error.errors[0].message }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      // Sanitize the description before submission
      const sanitizedDescription = DOMPurify.sanitize(formData.description);

      const formattedData = {
        title: formData.title,
        description: sanitizedDescription,
        priceRange: formData.priceRange,
        tripDuration: formData.tripDuration,
        visibility: formData.visibility,
        status: formData.status,
        sameCountry: formData.sameCountry,
      };

      const validation = addTripSchema.safeParse(formattedData);
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

      const { accessToken } = useAuthStore.getState();

      if (!accessToken) {
        throw new Error("No access token available. Please log in.");
      }

      const response = await API.post("/Trip", formattedData);

      setSuccess(response.data.message || "Trip created successfully!");

      // Store the trip ID in local storage
      const tripId = response.data.trip.tripId;
      localStorage.setItem("tripId", tripId);

      // Redirect to the next page (e.g., trip details or images upload)
      router.push("/trips");

      // Reset form fields
      setFormData({
        title: "",
        description: "",
        priceRange: "",
        tripDuration: "",
        visibility: "Public",
        status: "Not Started",
        sameCountry: false,
      });

      localStorage.removeItem("createTripForm");
    } catch (err) {
      console.error("API Request Failed:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to create trip.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <form className={styles.formWidth} onSubmit={handleSubmit}>
        <h2 className={styles.subheader}>Trip Information</h2>
        <Divider
          sx={{
            height: "1px",
            width: "100%",
            bgcolor: "var(--Green-Perfect)",
            marginBottom: "20px",
          }}
        />
        <Input
          label="Trip Title"
          id="title"
          type="text"
          required
          value={formData.title}
          onChange={handleChange}
          errorMsg={errors.title}
        />
        <Textarea
          label="Description"
          id="description"
          required
          value={formData.description}
          onChange={handleChange}
          errorMsg={errors.description}
        />

        <h2 className={styles.subheader}>Trip Details</h2>
        <Divider
          sx={{
            height: "1px",
            width: "100%",
            bgcolor: "var(--Green-Perfect)",
            marginBottom: "20px",
          }}
        />
        <div className={styles.formRow}>
          <Dropdown
            name="priceRange"
            label="Price Range"
            value={formData.priceRange}
            onChange={(value) =>
              handleChange({
                target: {
                  name: "priceRange",
                  value: value,
                },
              })
            }
            options={[
              { value: "Low", label: "$ Low" },
              { value: "Mid", label: "$$ Mid-range" },
              { value: "Luxury", label: "$$$ Luxury" },
            ]}
            errorMsg={errors.priceRange}
          />

          <Dropdown
            name="tripDuration"
            label="Trip Duration"
            value={formData.tripDuration}
            onChange={(value) =>
              handleChange({
                target: {
                  name: "tripDuration",
                  value: value,
                },
              })
            }
            options={[
              { value: "Short", label: "Short (1-3 days)" },
              { value: "Mid", label: "Mid (4-7 days)" },
              { value: "Long", label: "Long (8+ days)" },
            ]}
            errorMsg={errors.tripDuration}
          />
        </div>

        <div className={styles.formRow}>
          <Dropdown
            name="visibility"
            label="Visibility"
            value={formData.visibility}
            onChange={(value) =>
              handleChange({
                target: {
                  name: "visibility",
                  value: value,
                },
              })
            }
            options={[
              { value: "Public", label: "Public" },
              { value: "Private", label: "Private" },
              { value: "TripHub", label: "TripHub" },
            ]}
            errorMsg={errors.visibility}
          />

          <Dropdown
            name="status"
            label="Status"
            value={formData.status}
            onChange={(value) =>
              handleChange({
                target: {
                  name: "status",
                  value: value,
                },
              })
            }
            options={[
              { value: "Not Started", label: "Not Started" },
              { value: "In Progress", label: "In Progress" },
              { value: "Completed", label: "Completed" },
            ]}
            errorMsg={errors.status}
          />
        </div>
        <div className={styles.checkboxContainer}>
          <input
            type="checkbox"
            id="sameCountry"
            name="sameCountry"
            checked={formData.sameCountry}
            onChange={handleChange}
          />
          <label htmlFor="sameCountry">Same Country Trip</label>
        </div>

        {success && <SuccessMessage message={success} />}
        {error && <ErrorMessage message={error} />}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Trip"}
        </button>
      </form>
    </div>
  );
}
