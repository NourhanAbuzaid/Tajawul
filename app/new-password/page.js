"use client"; // ✅ Ensures this page runs in the client

import styles from "../login.module.css";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import SearchParamsWrapper from "@/components/SearchParamsWrapper";

export default function NewPassPage() {
  const [params, setParams] = useState({ email: "", token: "" });
  const { email, token } = params; // ✅ Destructure extracted params
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        window.location.href = "/login";
      }, 3000);

      return () => clearTimeout(timer); // Cleanup on unmount
    }
  }, [success]); // Runs when success state changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!newPassword || !confirmPassword) {
      setError("Both password fields are required.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/api/proxy/newPass", {
        email,
        newPassword,
        confirmPassword,
        token,
      });

      setSuccess(response.data.message || "Password changed successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Suspense fallback={<p className={styles.subtitle}>Loading...</p>}>
        <SearchParamsWrapper
          setParams={setParams}
          paramKeys={["email", "token"]}
        />
      </Suspense>

      <div className={styles.frameBackground}>
        <div className={styles.formFrame}>
          <Image
            src="/tajawul-logo-text-only.svg"
            alt="Tajawul Logo"
            width={120}
            height={100}
          />
          <div className={styles.formContainer}>
            <div>
              <p className={styles.title}>Change Password</p>
              <p className={styles.subtitle}>
                Your password must be{" "}
                <span className={styles.importantText}>
                  at least 8 characters long
                </span>
                , contain at least one uppercase letter, one lowercase letter,
                one number, and one special character.
              </p>
            </div>
            <form onSubmit={handleSubmit} className={styles.formWidth}>
              {/* New Password Field */}
              <label className={styles.passwordLabel}>
                New Password
                <div className={styles.passwordContainer}>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="New Password"
                  />
                  <button
                    type="button"
                    className={styles.togglePassword}
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </button>
                </div>
              </label>

              {/* Confirm Password Field */}
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
              {success && (
                <div className={styles.registerText}>
                  Redirecting to{" "}
                  <Link href="../login" className={styles.Link}>
                    Login
                  </Link>{" "}
                  page...
                </div>
              )}

              {/* ❌ Error message display */}
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

              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? "Processing..." : "Change Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
