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

  const baseUrl = "https://tajawul.vercel.app" || "http://localhost:3000";

  let destination = null; // ✅ Ensure destination is defined

  try {
    const { data } = await axios.get(`${baseUrl}/api/proxy/getDestinations`, {
      params: { DestinationId: destinationId },
    });

    // ✅ Extract the specific destination
    destination = data.destinations?.find(
      (dest) => dest.destinationId === destinationId
    );

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

  const fakeImages = [
    "/Mena/Abu Dhabi.jpeg",
    "/Mena/Alexandria.jpg",
    "/Mena/Algeria.jpg",
    "/Mena/Bahrain.jpg",
    "/Mena/Dahab.jpeg",
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
              <span>{destination.country}</span>
              <span className={styles.separator}>&gt;</span>
              <span>{destination.city}</span>
              <span className={styles.separator}>&gt;</span>
              <span>{destination.name}</span>
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
              <h1 className={styles.destinationName}>{destination.name}</h1>
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
          <div id="images" className={`${styles.section} ${styles.images}`}>
            <ImageList images={fakeImages} />
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
            <Divider
              sx={{
                height: "1px",
                width: "100%",
                bgcolor: "var(--Neutrals-Light-Outline)",
              }}
            />
            <span>
              <strong className={styles.important}>Established At:</strong>{" "}
              14/2/2024
            </span>
          </div>
          <div
            id="contributers"
            className={`${styles.section} ${styles.contributers}`}
          >
            <h2>Contributers</h2>
            <div className={styles.creator}>
              <Avatar alt="Remy Sharp" src="" sx={{ width: 56, height: 56 }} />
              <span className={styles.important}>Created By:</span>
              <span>@creator_username</span>
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
