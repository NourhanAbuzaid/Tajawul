import React from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import styles from "./SameCountry.module.css";

const SameCountry = ({ sameCountry }) => {
  return (
    <div className={styles.container}>
      <div className={sameCountry ? styles.same : styles.different}>
        <LocationOnIcon />
        {sameCountry ? "Same Country" : "Different Countries"}
      </div>
    </div>
  );
};

export default SameCountry;