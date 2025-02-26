"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"; // ✅ Import usePathname for active link detection
import useAuthStore from "@/store/authStore"; // ✅ Import Zustand store
import Logo from "./Logo";
import TranslationShortcut from "./TranslationShortcut";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Avatar from "@mui/material/Avatar";
import Button from "./Button";
import styles from "./NavBar.module.css";
import LogoutButton from "@/components/ui/LogoutButton"; // ✅ Import the Logout Button

export default function NavBar() {
  const { accessToken } = useAuthStore(); // ✅ Get authentication state
  const pathname = usePathname(); // ✅ Get current pathname

  return (
    <nav className={styles.navBar}>
      <div className={styles.logoTransFrame}>
        <Link
          className={`${styles.homeItem} ${
            pathname === "/" ? styles.active : ""
          }`}
          href="/"
          aria-label="Home"
        >
          <Logo />
        </Link>
        <TranslationShortcut />
      </div>
      <Link
        className={`${styles.navItem} ${
          pathname === "/explore" ? styles.active : ""
        }`}
        href="/explore"
        aria-label="Explore"
      >
        Explore
      </Link>

      {/* 🔹 Trips Dropdown - Opens/Closes on Hover */}
      <div className={styles.dropdownContainer}>
        <button className={styles.dropItem} aria-label="Trips">
          Trips{" "}
          <KeyboardArrowDownIcon
            className={styles.arrowIcon}
            sx={{ fontSize: 18 }}
          />
        </button>
        <div className={styles.dropdownMenu}>
          <Link href="/triphub" className={styles.dropdownItem}>
            TripHub
          </Link>
          <Link href="/create-trip" className={styles.dropdownItem}>
            Create New Trip
          </Link>
        </div>
      </div>

      <Link
        className={`${styles.navItem} ${
          pathname === "/connect" ? styles.active : ""
        }`}
        href="/connect"
        aria-label="Connect"
      >
        Connect
      </Link>
      <Link
        className={`${styles.navItem} ${
          pathname === "/about" ? styles.active : ""
        }`}
        href="/about"
        aria-label="About"
      >
        About
      </Link>

      {/* 🔹 Show Login/Register buttons if NOT logged in */}
      {!accessToken && (
        <div className={styles.loginFrame}>
          <Link href="/login">
            <Button type="secondary" size="px14">
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button type="primary" size="px14">
              Register
            </Button>
          </Link>
        </div>
      )}

      {/* 🔹 Show Profile & Avatar Dropdown if user IS logged in */}
      {accessToken && (
        <div className={styles.profileFrame}>
          <CircleNotificationsIcon
            sx={{ width: 48, height: 48, color: "var(--Neutrals-Black-Text)" }}
            aria-label="Notifications"
          />
          {/* 🔹 Avatar Dropdown */}
          <div className={styles.dropdownContainer}>
            <button className={styles.avatarButton} aria-label="Profile">
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: "var(--Neutrals-Black-Text)",
                }}
              >
                OP
              </Avatar>
            </button>
            <div className={styles.dropdownMenuAvatar}>
              <Link href="/profile" className={styles.dropdownItem}>
                Profile
              </Link>
              <Link href="/settings" className={styles.dropdownItem}>
                Settings
              </Link>
              <LogoutButton className={styles.dropdownItem} />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
