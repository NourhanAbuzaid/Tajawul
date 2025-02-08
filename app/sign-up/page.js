"use client";

import styles from "../login.module.css";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import PlaceIcon from "@mui/icons-material/Place";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function SignUpPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setSuccess("");
    setLoading(true);

    if (!firstName.trim() || !lastName.trim()) {
      setError("First name and last name are required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format.");
      return;
    }

    // Password validation regex:
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("/api/proxy/signup", {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
        confirmPassword,
        clientURI: "https://tajawul.vercel.app/email-verification",
      });

      setSuccess("Please check your email for verification!");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.right}>
        <div className={styles.locationTag}>
          <PlaceIcon
            style={{
              fontSize: "20px",
            }}
          />
          <p>United Arab Emirates</p>
        </div>
        <Image
          src="/GRAND_MOSQUE.jpg"
          alt="The Grand Mosque in United Arab Emirates"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </div>
      {/* Header: Logo */}
      <div className={styles.left}>
        <div className={styles.leftContent}>
          <Image
            src="/tajawul-logo-text-only.svg"
            alt="Tajawul Logo"
            width={120}
            height={100}
          />
          {/* Form Container */}
          <div className={styles.formContainer}>
            <div>
              <p className={styles.title}>Create New Account</p>
              <p className={styles.subtitle}>
                Join us to unlock travel inspiration, personalized
                Recommendations, and connections with fellow explorers!
              </p>
            </div>

            {/* Start Form Items */}
            <form onSubmit={handleSubmit} className={styles.formWidth}>
              <div className={styles.nameContainer}>
                <label>
                  First Name
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    placeholder="First Name"
                  />
                </label>
                <label>
                  Last Name
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    placeholder="Last Name"
                  />
                </label>
              </div>
              <label>
                Email Address
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Email Address"
                />
              </label>
              <label className={styles.passwordLabel}>
                Password
                <div className={styles.passwordContainer}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Password"
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
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm Password"
                  />
                  <button
                    type="button"
                    className={styles.togglePassword}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </button>
                </div>
              </label>

              {/* Success message display */}
              {success && (
                <div className={styles.successMessage}>
                  <MarkEmailReadIcon
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
                Register Now
              </button>
            </form>

            <div className={styles.divider}>
              <span>Already a member?</span>
            </div>
            <p className={styles.registerText}>
              <Link href="../login" className={styles.Link}>
                Log In
              </Link>
              &nbsp;using your Tajawul account
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
