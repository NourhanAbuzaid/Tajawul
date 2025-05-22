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
import styles from "@/destination.module.css";
import PriceRange from "./tags/PriceRange";
import EditTags from "@/components/ui/edit/EditTags";
import GroupSize from "./tags/GroupSize";
import Tag from "./tags/Tag";
import DestinationIdHandler from "@/components/DestinationIdHandler";

export default async function DestinationDetails({ destinationId }) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  let destination = null;
  let groupSizes = [];
  let activities = [];
  let tags = [];
  let contributersData = { users: [] };

  try {
    const { data: destinationData } = await axios.get(
      `${baseUrl}/Destination?DestinationId=${destinationId}`
    );

    const { data: attributesData } = await axios.get(
      `${baseUrl}/Destination/${destinationId}/attributes`
    );

    const { data: contributersResponse } = await axios.get(
      `${baseUrl}/Destination/${destinationId}/users?Relation=contribute`
    );
    contributersData = contributersResponse || { users: [] };
    console.log("Raw attributes response:", attributesData);

    destination = destinationData.destinations[0];

    // Extract just the names from each attribute
    groupSizes =
      attributesData.groupSizes?.data?.map((item) => item.group) || [];
    activities =
      attributesData.activities?.data?.map((item) => item.name) || [];
    tags = attributesData.tags?.data?.map((item) => item.name) || [];

    if (!destination) throw new Error("Destination not found");

    console.log("Processed Destination Details:", {
      destination,
      attributes: {
        groupSizes,
        activities,
        tags,
      },
    });
  } catch (error) {
    console.error("Failed to fetch destination details:", error);
    contributersData = { users: [] };
  }

  return (
    <div>
      <DestinationIdHandler destinationId={destinationId} />
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
              <span>{destination?.country}</span>
              <span className={styles.separator}>&gt;</span>
              <span>{destination?.city}</span>
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
                <FavoriteBorderIcon />
                Add To Wishlist
              </button>
              <button className={styles.saveButton}>
                <PersonAddAlt1Icon />
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
          <div
            id="tags"
            className={`${styles.section} ${styles.tagsContainer}`}
          >
            <div className={styles.headerRow}>
              <div className={styles.tagsWrapper}>
                <PriceRange priceRange={destination?.priceRange} />
                <GroupSize groupSizes={groupSizes} />
                {/* Pass the array directly */}
              </div>
              <Divider
                sx={{
                  height: "1px",
                  width: "100%",
                  bgcolor: "var(--Neutrals-Light-Outline)",
                  mb: "8px",
                }}
              />
              {/* Updated Tags Section */}
              {(() => {
                const hasTags = tags.length > 0;
                const hasActivities = activities.length > 0;
                const hasContent = hasTags || hasActivities;

                return (
                  <>
                    {hasContent ? (
                      <div className={styles.tagsWrapper}>
                        <Tag options={tags} />
                        <Tag options={activities} />
                      </div>
                    ) : (
                      <div className={styles.noTagsMessage}>
                        No Tags or Activities are added, yet.
                      </div>
                    )}
                  </>
                );
              })()}
              <div className={styles.editButtonContainer}>
                <EditTags destinationId={destinationId} />
              </div>
            </div>
          </div>
          <div id="images" className={`${styles.section} ${styles.images}`}>
            <ImageList
              coverImage={destination?.coverImage}
              images={destination?.images}
            />
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
              <Stats type="Followers" count={destination?.followersCount} />
              <Stats type="Visitors" count={destination?.visitorsCount} />
              <Stats type="Wishes" count={destination?.wishesCount} />
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

            {destination?.establishedAt && (
              <span>
                <Divider
                  sx={{
                    height: "1px",
                    width: "100%",
                    bgcolor: "var(--Neutrals-Light-Outline)",
                  }}
                />
                <strong className={styles.important}>Established At:</strong>{" "}
                {destination.establishedAt}
              </span>
            )}
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
            <Editors
              editors={
                contributersData?.users?.map((user) => ({
                  id: user.id,
                  name: user.name,
                  url: user.profileImage,
                })) || []
              }
            />
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
