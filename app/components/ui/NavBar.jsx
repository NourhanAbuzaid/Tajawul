"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react"; // ✅ Import useRef for click detection
import useAuthStore from "@/store/authStore"; // ✅ Import Zustand store
import Logo from "./Logo";
import TranslationShortcut from "./TranslationShortcut";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import Avatar from "@mui/material/Avatar";
import Button from "./Button";
import styles from "./NavBar.module.css";
import LogoutButton from "@/components/ui/LogoutButton"; // ✅ Import the Logout Button

export default function NavBar() {
  const { accessToken } = useAuthStore(); // ✅ Get authentication state

  const [isTripsDropdownOpen, setIsTripsDropdownOpen] = useState(false); // ✅ State for "Trips" dropdown
  const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false); // ✅ State for Avatar dropdown

  const tripsDropdownRef = useRef(null); // ✅ Reference for Trips dropdown
  const avatarDropdownRef = useRef(null); // ✅ Reference for Avatar dropdown

  // ✅ Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        tripsDropdownRef.current &&
        !tripsDropdownRef.current.contains(event.target)
      ) {
        setIsTripsDropdownOpen(false);
      }
      if (
        avatarDropdownRef.current &&
        !avatarDropdownRef.current.contains(event.target)
      ) {
        setIsAvatarDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className={styles.navBar}>
      <div className={styles.logoTransFrame}>
        <Link className={styles.navItem} href="/.">
          <Logo />
        </Link>
        <TranslationShortcut />
      </div>
      <Link className={styles.navItem} href="/explore">
        Explore
      </Link>

      {/* 🔹 Trips Dropdown - Opens/Closes on Click */}
      <div className={styles.dropdownContainer} ref={tripsDropdownRef}>
        <button
          className={styles.navItem}
          onClick={() => setIsTripsDropdownOpen((prev) => !prev)}
        >
          Trips ▾
        </button>
        {isTripsDropdownOpen && (
          <div className={styles.dropdownMenu}>
            <Link href="/triphub" className={styles.dropdownItem}>
              TripHub
            </Link>
            <Link href="/create-trip" className={styles.dropdownItem}>
              Create New Trip
            </Link>
          </div>
        )}
      </div>

      <Link className={styles.navItem} href="/.">
        Connect
      </Link>
      <Link className={styles.navItem} href="/.">
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
          />
          {/* 🔹 Avatar Dropdown */}
          <div className={styles.dropdownContainer} ref={avatarDropdownRef}>
            <button
              onClick={() => setIsAvatarDropdownOpen((prev) => !prev)}
              className={styles.avatarButton}
            >
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
            {isAvatarDropdownOpen && (
              <div className={styles.dropdownMenuAvatar}>
                <Link href="/profile" className={styles.dropdownItem}>
                  Profile
                </Link>
                <Link href="/settings" className={styles.dropdownItem}>
                  Settings
                </Link>
                <LogoutButton className={styles.dropdownItem} />
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
