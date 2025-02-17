import styles from "@/destination.module.css";
import Tag from "@/components/ui/Tag";
import Image from "next/image";
import VerifiedIcon from "@mui/icons-material/Verified";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import Divider from "@mui/material/Divider";
import Rating from "@/components/ui/Rating";
import OpenClose from "@/components/ui/OpenClose";
import Stats from "@/components/ui/Stats";
import Link from "next/link";

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
            <div className={styles.buttomRightContainer}>
              <button className={styles.saveButton}>
                <FavoriteBorderIcon
                  sx={{ color: "var(--Neutrals-Black-Text)" }}
                />
                Save
              </button>
              <button className={styles.saveButton}>
                <PersonAddAlt1Icon
                  sx={{ color: "var(--Neutrals-Black-Text)" }}
                />
                Follow
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Secondary Nav Bar */}
      <div className={styles.secondaryNavBar}>
        <Link className={styles.navItem} href="#posts" scroll={false}>
          Posts
        </Link>
        <Link className={styles.navItem} href="#reviews" scroll={false}>
          Reviews
        </Link>
        <Link className={styles.navItem} href="#location" scroll={false}>
          Location
        </Link>
        <Link className={styles.navItem} href="#events" scroll={false}>
          Events
        </Link>
      </div>
      <div className={styles.mainContent}>
        {/* Left Column */}
        <div className={styles.leftColumn}>
          <div id="tags" className={`${styles.section} ${styles.tags}`}>
            <Tag text="$$ Mid-range" color="green" />
            <Tag text="Seasonal Tourism" color="blue" />
            <Tag text="Nature & Adventure" color="orange" />
            <Tag text="$$ Mid-range" color="green" />
            <Tag text="Seasonal Tourism" color="blue" />
            <Tag text="Nature & Adventure" color="orange" />
          </div>
          <div id="images" className={styles.section}>
            <h2>Images</h2>
            <p>Images will be here</p>
          </div>
          <div id="posts" className={styles.section}>
            <h2>Posts</h2>
            <p>Posts will be here</p>
          </div>
        </div>

        {/* Right Column */}
        <div className={styles.rightColumn}>
          <div id="about" className={`${styles.section} ${styles.about}`}>
            {/* Open/Close Time */}
            <OpenClose openTime="08:00" closeTime="22:00" />
            <Divider
              sx={{
                height: "1px",
                width: "100%",
                bgcolor: "var(--Neutrals-Light-Outline)",
              }}
            />
            {/* Destination Stats */}
            <div className={styles.statsContainer}>
              <Stats type="Followers" count={1200} />
              <Stats type="Visitors" count={3500} />
              <Stats type="Events" count={15} />
            </div>
            <Divider
              sx={{
                height: "1px",
                width: "100%",
                bgcolor: "var(--Neutrals-Light-Outline)",
              }}
            />
            {/* About */}
            <h2>About</h2>
            <p className={styles.description}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
              tincidunt, nunc nec ultricies tincidunt, nisi eros luctus purus,
              ac aliquam nunc felis vitae justo. Nulla facilisi. Nullam nec
              scelerisque lorem. Nulla facilisi. Nullam nec scelerisque lorem.
              Nulla facilisi. Nullam nec scelerisque lorem.
            </p>
          </div>
          <div id="location" className={styles.section}>
            <h2>Location</h2>
            <p>Location will be here</p>
          </div>
          <div id="events" className={styles.section}>
            <h2>Upcoming Events</h2>
            <p>Events will be here</p>
          </div>
          <div id="reviews" className={styles.section}>
            <h2>Reviews</h2>
            <p>Reviews will be here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
