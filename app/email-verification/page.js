"use client"; // ✅ Ensures this page runs in the client

import styles from "../login.module.css";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import SearchParamsWrapper from "@/components/SearchParamsWrapper";
import { motion } from "framer-motion";

export default function EmailVerifyPage() {
  const [params, setParams] = useState({ personId: "", token: "" });
  const { personId, token } = params;
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    // Only proceed if personId and token are available
    if (!personId || !token) return;

    setLoading(true);
    setError(""); // Reset error to avoid flashing incorrect messages
    setSuccess("");

    axios
      .post("/api/proxy/confirmEmail", { personId, token })
      .then((response) => {
        setSuccess(
          response.data.message || "Your Email Has Been Confirmed Successfully"
        );
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Email Confirmation Failed");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [personId, token]);

  useEffect(() => {
    console.log("Success state:", success); // Debugging
    if (success) {
      const timer = setTimeout(() => {
        router.push("../login");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [success, router]);

  return (
    <div className={styles.container}>
      <Suspense fallback={<p className={styles.subtitle}>Loading...</p>}>
        <SearchParamsWrapper
          setParams={setParams}
          paramKeys={["personId", "token"]}
        />
      </Suspense>

      <div className={styles.frameBackground}>
        <motion.div
          className={styles.formFrame}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src="/tajawul-logo-text-only.svg"
            alt="Tajawul Logo"
            width={120}
            height={100}
          />
          <div className={styles.formContainerCenter}>
            <p className={styles.title}>Email Confirmation</p>
            {/* ✅ Loading State */}
            {loading && (
              <p className={styles.message}>
                Your email is now being confirmed...
              </p>
            )}

            {/* ✅ Success Message */}
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

            {/* ❌ Error Message */}
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
          </div>
          <button onClick={() => router.push("../login")}>Test Redirect</button>
        </motion.div>
      </div>
    </div>
  );
}
