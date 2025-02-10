import React from "react";
import Link from "next/link";
import Logo from "./Logo";


export default function NavBar() {
  return (
    <nav className="nav-bar">
    <Link className="nav-item" href="/.">
< Logo />
    </Link>
    <Link className="nav-item" href="/explore">
      Explore
    </Link>
    <Link className="nav-item" href="/sign-up">
      Create Account Page
    </Link>
    <Link className="nav-item" href="/login">
      Login Page
    </Link>
  </nav>
  );
}