"use client";

import styles from "../login.module.css";
import GoogleIcon from "@mui/icons-material/Google";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("/api/proxy/signin", {
        email,
        password,
      });

      console.log("Login Successful:", response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className={styles.container}>
      {/* Header: Logo */}
      <div className={styles.left}>
        <div className={styles.leftContent}>
          <Image
            src="/tajawul-logo-text-only.svg"
            alt="Tajawul Logo"
            width={120}
            height={120}
          />
          {/* Form Container */}
          <div className={styles.formContainer}>
            <p className={styles.title}>Welcome Back</p>

            {/* Google Authentication */}
            <button className={styles.googleButton}>
              <GoogleIcon /> Continue with Google
            </button>

            <div className={styles.divider}>
              <span>Or Using Email</span>
            </div>

            {/* Start Form Items */}
            <form onSubmit={handleSubmit} className={styles.formWidth}>
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

              <Link href="../forgot-password" className={styles.Link}>
                <p>Forgot Password?</p>
              </Link>
              <button type="submit" className={styles.submitButton}>
                Log In
              </button>
            </form>

            <div className={styles.divider}>
              <span>Not a Member?</span>
            </div>
            <p className={styles.registerText}>
              <Link href="../sign-up" className={styles.Link}>
                Register
              </Link>
              &nbsp;to unlock the best of Tajawul
            </p>
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <Image
          src="/GRAND_MOSQUE.jpg"
          alt="The Grand Mosque in United Arab Emirates"
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>
    </div>
  );
}
