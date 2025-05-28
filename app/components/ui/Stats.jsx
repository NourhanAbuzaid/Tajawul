import React from "react";
import PeopleIcon from "@mui/icons-material/People";
import WhereToVoteIcon from "@mui/icons-material/WhereToVote";
import FavoriteIcon from "@mui/icons-material/Favorite";
import styles from "./Stats.module.css";

const Stats = ({ type, count }) => {
  const icons = {
    Followers: <PeopleIcon sx={{ fontSize: 32 }} />,
    Visitors: <WhereToVoteIcon sx={{ fontSize: 38 }} />,
    Wishes: <FavoriteIcon sx={{ fontSize: 32 }} />,
  };

  const formatCount = (num) => {
    return num >= 1000 ? (num / 1000).toFixed(0) + "K" : num;
  };

  return (
    <div className={styles.container}>
      <div className={styles.iconBox}>{icons[type]}</div>
      <p className={styles.count}>{formatCount(count)}</p>
      <p className={styles.type}>{type}</p>
    </div>
  );
};

export default Stats;
