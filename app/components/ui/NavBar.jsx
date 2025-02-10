import Link from "next/link";
import Logo from "./Logo";
import TranslationShortcut from "./TranslationShortcut";
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
    </nav>
  );
}
