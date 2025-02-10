import Link from "next/link";
import Logo from "./Logo";
import TranslationShortcut from "./TranslationShortcut";

export default function NavBar() {
  return (
    <nav className="nav-bar">
      <Link className="nav-item" href="/.">
        <Logo />
      </Link>
      <TranslationShortcut />
      <Link className="nav-item" href="/explore">
        Explore
      </Link>
      <Link className="nav-item" href="/.">
        Trips
      </Link>
      <Link className="nav-item" href="/.">
        Connect
      </Link>
      <Link className="nav-item" href="/.">
        About
      </Link>
    </nav>
  );
}
