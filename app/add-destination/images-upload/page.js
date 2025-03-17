"use client";

import NavBar from "@/components/ui/NavBar";
import styles from "@/forms.module.css";
import UploadDestinationImages from "./UploadDestinationImages";
import withAuth from "@/utils/withAuth"; // ✅ Import the HOC

function UploadImages() {
  return (
    <div className={styles.container}>
      <NavBar />
      <div className={styles.frameBackground}>
        <img
          src="/arabic-typo-pattern.svg"
          alt="Arabic Typography Pattern"
          className={styles.svgPattern}
        />
        <div className={styles.formFrame}>
          <p className={styles.title}>Add Destination</p>
          <UploadDestinationImages />
        </div>
      </div>
    </div>
  );
}

export default withAuth(UploadImages); // ✅ Protect the page
