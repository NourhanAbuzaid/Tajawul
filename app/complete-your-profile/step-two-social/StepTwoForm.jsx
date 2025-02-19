"use client";

import styles from "../forms.module.css";
import Input from "app/components/ui/Input";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StepTwoForm() {
  const [formData, setFormData] = useState({
    profilePicture: "",
    username: "",
    bio: "",
  });

  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };

  const handleBack = () => {
    router.push("/complete-your-profile/step-one-about");
  };

  return (
    <div className={styles.formContainer}>
      <form className={styles.formWidth} onSubmit={handleSubmit}>
        <Input
          label="Profile Picture"
          id="profilePicture"
          type="file"
          required
          onChange={handleChange}
        />

        <Input
          label="Username"
          id="username"
          type="text"
          required
          minLength={3}
          onChange={handleChange}
        />

        <Input
          label="Bio"
          id="bio"
          type="text"
          required
          minLength={10}
          description="Tell us a bit about yourself."
          onChange={handleChange}
        />

        <div className={styles.buttonContainer}>
          <button
            type="button"
            className={styles.backButton}
            onClick={handleBack}
          >
            Back
          </button>
          <button type="submit" className={styles.submitButton}>
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
