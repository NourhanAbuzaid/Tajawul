"use client";

import withAuth from "@/utils/withAuth"; // ✅ Import the HOC
import NavBar from "@/components/ui/NavBar";
import SearchBar from "@/components/ui/SearchBar";

function ProfilePage() {
  return (
    <div className="container">
      <NavBar />
      <h1>Profile</h1>
      <SearchBar searchType="all" />
    </div>
  );
}

export default withAuth(ProfilePage); // ✅ Protect the page
