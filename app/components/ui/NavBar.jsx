import Link from "next/link";
import Logo from "./Logo";
import TranslationShortcut from "./TranslationShortcut";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import Avatar from "@mui/material/Avatar";
import Button from "./Button";
import styles from "./NavBar.module.css"; // Import styles

export default function NavBar() {
  return (
    <nav className={styles.navBar}>
      <div className={styles.logoTransFrame}>
        <Link className={styles.navItem} href="/.">
          <Logo />
        </Link>
        <TranslationShortcut />
      </div>
      <Link className={styles.navItem} href="/.">
        Explore
      </Link>
      <Link className={styles.navItem} href="/.">
        Trips
      </Link>
      <Link className={styles.navItem} href="/.">
        Connect
      </Link>
      <Link className={styles.navItem} href="/.">
        About
      </Link>
      <div className={styles.profileFrame}>
        <CircleNotificationsIcon
          sx={{ width: 48, height: 48, color: "var(--Neutrals-Black-Text)" }}
        />
        <Avatar
          sx={{ width: 40, height: 40, bgcolor: "var(--Neutrals-Black-Text)" }}
        >
          OP
        </Avatar>
      </div>
    </nav>
  );
}
