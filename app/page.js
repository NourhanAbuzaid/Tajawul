"use client";

import Image from "next/image";
import Link from "next/link";
import NavBar from "./components/ui/NavBar";
import styles from "@/home.module.css";
import { useEffect, useState } from "react";
import useAuthStore from "@/store/authStore";

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);
  const { roles } = useAuthStore();

  useEffect(() => {
    // Check if user is logged in and has "Person" role
    if (roles.includes("Person")) {
      setShowPopup(true);
    }
  }, [roles]);

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div>
      <NavBar />

      <div className={styles.container}>
        <main>
          <div className={styles.coverWrapper}>
            <div className={styles.mainCover}>
              <Image
                src="/Egypt.jpg"
                alt="Luxor, Egypt"
                fill={true}
                style={{ objectFit: "cover" }}
                priority
              />
            </div>
          </div>
          <div className={styles.sectionBelowImage}> </div>
        </main>
      </div>

      {showPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <Image
              src="/complete-your-profile.svg"
              alt="Complete your profile illustration"
              width={250}
              height={250}
              priority
            />
            <button className={styles.closeButton} onClick={handleClosePopup}>
              ✕
            </button>

            <h2>Welcome to Tajawul!</h2>
            <p>
              Tell us a little about yourself so we can match you with the
              perfect destinations and fellow travelers. It only takes a minute
              — and it makes all the difference.
            </p>
            <div className={styles.buttonGroup}>
              <button
                className={styles.secondaryButton}
                onClick={handleClosePopup}
              >
                Maybe Later
              </button>
              <Link
                href="/complete-your-profile/"
                className={styles.submitButton}
              >
                Complete My Profile
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
