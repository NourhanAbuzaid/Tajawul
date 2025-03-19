import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import VerifiedIcon from "@mui/icons-material/Verified";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import Editors from "@/components/ui/Editors";
import Rating from "@/components/ui/Rating";
import OpenClose from "@/components/ui/OpenClose";
import Stats from "@/components/ui/Stats";
import ImageList from "@/components/ui/ImageList";
import Tag from "@/components/ui/Tag";
import styles from "@/destination.module.css";

export default async function DestinationDetails({ destinationId }) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  let destination = null; // ✅ Ensure destination is defined

  try {
    const { data } = await axios.get(
      `${baseUrl}/Destination?DestinationId=${destinationId}`
    );

    destination = data.destinations[0]; // Assign the fetched data to the existing `destination` variable

    if (!destination) throw new Error("Destination not found");

    console.log("Destination Details:", destination);
  } catch (error) {
    console.error("Failed to fetch destination details:", error);
  }

  const fakeEditors = [
    { id: 1, name: "Remy Sharp", url: "/static/images/avatar/1.jpg" },
    { id: 2, name: "Travis Howard", url: "/static/images/avatar/2.jpg" },
    { id: 3, name: "Cindy Baker", url: "/static/images/avatar/3.jpg" },
    { id: 4, name: "Agnes Walker", url: "/static/images/avatar/4.jpg" },
    { id: 5, name: "Trevor Henderson", url: "/static/images/avatar/5.jpg" },
    { id: 6, name: "Remy Sharp", url: "/static/images/avatar/1.jpg" },
    { id: 7, name: "Travis Howard", url: "/static/images/avatar/2.jpg" },
    { id: 8, name: "Cindy Baker", url: "/static/images/avatar/3.jpg" },
    { id: 9, name: "Agnes Walker", url: "/static/images/avatar/4.jpg" },
    { id: 10, name: "Trevor Henderson", url: "/static/images/avatar/5.jpg" },
  ];

  return (
    <div>
      <div className={styles.coverWrapper}>
        <div className={styles.destinationCover}>
          {destination?.coverImage && (
            <Image
              src={destination.coverImage}
              alt={`Destination is ${destination.name}`}
              fill={true}
              style={{ objectFit: "cover" }}
              priority
            />
          )}
        </div>
        {/* Content Above the Image */}
        <div className={styles.coverContent}>
          {/* Breadcrumb */}
          <div className={styles.breadcrumb}>
            <p>
              <span>All</span>
              <span className={styles.separator}>&gt;</span>
              <span>country</span>
              <span className={styles.separator}>&gt;</span>
              <span>city</span>
              <span className={styles.separator}>&gt;</span>
              <span>{destination?.name}</span>
            </p>
          </div>
          <div className={styles.buttomContainer}>
            <div className={styles.buttomLeftContainer}>
              {/* Is Verified */}
              {destination?.isVerified && (
                <div className={styles.verified}>
                  <VerifiedIcon
                    sx={{
                      fontSize: "20px",
                      color: "var(--Neutrals-Background)",
                    }}
                  />
                  <p>Verified Destination</p>
                </div>
              )}
              {/* Destination Name */}
              <h1 className={styles.destinationName}>{destination?.name}</h1>
              {/* Rating and Reviews Count */}
              <div className={styles.ratingContainer}>
                <Rating average={destination?.averageRating} />
                <p className={styles.reviewsCount}>
                  {destination?.reviewsCount} Reviews
                </p>
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
          <div id="images" className={`${styles.section} ${styles.images}`}>
            <ImageList images={destination?.images} />
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
            <OpenClose
              isOpen24Hours={destination?.isOpen24Hours}
              openTime={destination?.openTime}
              closeTime={destination?.closeTime}
            />
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
            <div>
              <p className={styles.type}>{destination?.type}</p>
              <p className={styles.description}>{destination?.description}</p>
            </div>

            <Divider
              sx={{
                height: "1px",
                width: "100%",
                bgcolor: "var(--Neutrals-Light-Outline)",
              }}
            />
            <span>
              <strong className={styles.important}>Established At:</strong>{" "}
              {destination?.establishedAt}
            </span>
          </div>
          <div
            id="contributers"
            className={`${styles.section} ${styles.contributers}`}
          >
            <h2>Contributers</h2>
            <div className={styles.creator}>
              <Avatar
                alt={destination?.creator[1]}
                src={destination?.creator[2]}
                sx={{ width: 56, height: 56 }}
              />
              <span className={styles.important}>Created By:</span>
              <span>{destination?.creator[1]}</span>
            </div>
            <Divider
              sx={{
                height: "1px",
                width: "100%",
                bgcolor: "var(--Neutrals-Light-Outline)",
              }}
            />
            <Editors editors={fakeEditors} />
          </div>
          <div id="location" className={`${styles.section} ${styles.location}`}>
            <h2>Location</h2>
            <p>
              {destination?.locations?.[0]?.address || "Location not available"}
            </p>
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
