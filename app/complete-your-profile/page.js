"use clinet";
import withAuth from "@/utils/withAuth"; // ✅ Import the HOC

function CompleteYourProfile() {
  return <div></div>;
}

export default withAuth(CompleteYourProfile); // ✅ Protect the page
