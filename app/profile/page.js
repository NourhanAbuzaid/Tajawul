"use client";

import withAuth from "@/utils/withAuth"; // ✅ Import the HOC

function ProfilePage() {
  return (
    <div className="container">
      <NavBar />
      <h1>Profile</h1>
    </div>
  );
}

export default withAuth(ProfilePage); // ✅ Protect the page
