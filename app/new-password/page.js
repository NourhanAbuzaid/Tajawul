"use client";

import styles from "../login.module.css";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function NewPassPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // ✅ New state for success message

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(""); // ✅ Clear previous messages

    try {
      const response = await axios.post("/api/proxy/newPass", {
        email,
        newPassword,
        confirmPassword,
        token,
      });

      setSuccess(response.data.message || "Password Changed Successfully"); // ✅ Store success message
    } catch (err) {
      setError(err.response?.data?.message || "Failed");
    }
  };

  return (
    <div className={styles.container}>
      {/* Header: Logo */}
      <div className={styles.frameBackground}>
        <div className={styles.formFrame}>
          <Image
            src="/tajawul-logo-text-only.svg"
            alt="Tajawul Logo"
            width={120}
            height={100}
          />
          {/* Form Container */}
          <div className={styles.formContainer}>
            <div>
              <p className={styles.title}>Change Password</p>
              <p className={styles.subtitle}>
                Your password must be{" "}
                <span className={styles.importantText}>
                  {" "}
                  at least 8 characters long,{" "}
                </span>{" "}
                contain at least one uppercase letter, one lowercase letter, one
                number, and one special character.
              </p>
            </div>

            {/* Start Form Items */}
            <form onSubmit={handleSubmit} className={styles.formWidth}>
              <label className={styles.passwordLabel}>
                New Password
                <div className={styles.passwordContainer}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="New Password"
                  />
                  <button
                    type="button"
                    className={styles.togglePassword}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </button>
                </div>
              </label>
              {/* Confirm Password */}
              <label className={styles.passwordLabel}>
                Confirm Password
                <div className={styles.passwordContainer}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm Password"
                  />
                </div>
              </label>

              {/* ✅ Success message display */}
              {success && (
                <div className={styles.successMessage}>
                  <CheckCircleOutlineIcon
                    style={{
                      color: "#0d5f07",
                      fontSize: "20px",
                      marginRight: "8px",
                    }}
                  />
                  {success}
                </div>
              )}

              {/* Error message display */}
              {error && (
                <div className={styles.errorMessage}>
                  <ErrorOutlineIcon
                    style={{
                      color: "#a6001e",
                      fontSize: "20px",
                      marginRight: "8px",
                    }}
                  />
                  {error}
                </div>
              )}
              <button type="submit" className={styles.submitButton}>
                Change Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
