"use client";

import { Avatar, Rating } from "@mui/material";
import styles from "./Review.module.css";
import { format } from "date-fns";

export default function Review({ review }) {
  return (
    <div className={styles.reviewContainer}>
      <div className={styles.reviewHeader}>
        <div className={styles.userDetails}>
          <Avatar
            src={review.user?.profileImage}
            alt={review.user?.name}
            sx={{ width: 40, height: 40 }}
          />
          <div className={styles.userInfo}>
            <span className={styles.userName}>
              {review.user?.name || "Anonymous"}
            </span>
            <span className={styles.reviewDate}>
              {format(new Date(review.date), "MMM d, yyyy")}
            </span>
          </div>
        </div>
        <div className={styles.ratingContainer}>
          <Rating
            value={review.rate}
            precision={0.5}
            readOnly
            sx={{
              "& .MuiRating-iconFilled": {
                color: "var(--Green-Hover)",
              },
            }}
          />
        </div>
      </div>

      <p className={styles.reviewComment}>{review.comment}</p>
    </div>
  );
}
