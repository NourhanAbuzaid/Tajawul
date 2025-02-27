import React from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import styles from "./OpenClose.module.css";

const OpenClose = ({ openTime, closeTime }) => {
  // ✅ Extract only "hh:mm" from the provided time string
  const formatTime = (timeStr) => timeStr?.slice(0, 5) || "N/A";

  const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return new Date().setHours(hours, minutes, 0, 0);
  };

  const now = new Date();
  const open = parseTime(openTime);
  const close = parseTime(closeTime);
  const isOpen = now >= open && now <= close;

  return (
    <div className={styles.timeContainer}>
      <div className={isOpen ? styles.open : styles.closed}>
        <AccessTimeIcon />
        {isOpen ? "Open Now" : "Closed Now"}
      </div>
      <span>
        • {formatTime(openTime)} - {formatTime(closeTime)}
      </span>
    </div>
  );
};

export default OpenClose;
