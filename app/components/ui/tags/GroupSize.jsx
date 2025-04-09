import styles from "./GroupSize.module.css";
import PersonIcon from "@mui/icons-material/Person";
import WcIcon from "@mui/icons-material/Wc";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import GroupIcon from "@mui/icons-material/Group";
import GroupsIcon from "@mui/icons-material/Groups";

const GroupSize = ({ groupSize }) => {
  if (!groupSize) return null;

  const getGroupSizeDetails = () => {
    switch (groupSize.toLowerCase()) {
      case "solo":
        return {
          text: "Solo",
          icon: <PersonIcon fontSize="small" />,
        };
      case "couple":
        return {
          text: "Couple",
          icon: <WcIcon fontSize="small" />,
        };
      case "family":
        return {
          text: "Family",
          icon: <FamilyRestroomIcon fontSize="small" />,
        };
      case "group":
        return {
          text: "Group",
          icon: <GroupIcon fontSize="small" />,
        };
      case "big-group":
        return {
          text: "Big Group",
          icon: <GroupsIcon fontSize="small" />,
        };
      default:
        return null;
    }
  };

  const details = getGroupSizeDetails();
  if (!details) return null;

  return (
    <div className={styles.groupSizeContainer}>
      <span className={styles.tag}>
        <span className={styles.iconTextWrapper}>
          {details.icon}
          {details.text}
        </span>
      </span>
    </div>
  );
};

export default GroupSize;
