import styles from "@/destination.module.css";
import Image from "next/image";
import VerifiedIcon from "@mui/icons-material/Verified";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Rating from "@/components/ui/Rating";

export default function DestinationPage() {
  return (
    <div>
      <div className={styles.coverWrapper}>
        <div className={styles.destinationCover}>
          {/* Destination Cover*/}
          <Image
            src="/Tunisia.jpg"
            alt="Destination is Tunisia"
            fill={true}
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
        {/* Content Above the Image */}
        <div className={styles.coverContent}>
          {/* Breadcrumb */}
          <div className={styles.breadcrumb}>
            <p>
              <span>All</span>
              <span className={styles.separator}>&gt;</span>
              <span>Country</span>
              <span className={styles.separator}>&gt;</span>
              <span>City</span>
              <span className={styles.separator}>&gt;</span>
              <span>Destination Name</span>
            </p>
          </div>
          <div className={styles.buttomContainer}>
            <div className={styles.buttomLeftContainer}>
              {/* Is Verified */}
              <div className={styles.verified}>
                <VerifiedIcon
                  sx={{ fontSize: "20px", color: "var(--Neutrals-Background)" }}
                />
                <p>Verified Destination</p>
              </div>
              {/* Destination Name */}
              <h1 className={styles.destinationName}>Destination Name</h1>
              {/* Rating and Reviews Count */}
              <div className={styles.ratingContainer}>
                <Rating average={3.7} />
                <p className={styles.reviewsCount}>5,324 Reviews</p>
              </div>
            </div>
            <button className={styles.saveButton}>
              <FavoriteBorderIcon
                sx={{ fontSize: "28px", color: "var(--Neutrals-Black-Text)" }}
              />
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
