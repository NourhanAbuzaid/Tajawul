"use client";

import NavBar from "@/components/ui/NavBar";
import withAuth from "@/utils/withAuth";

function Chat() {
  return (
    <div>
      <NavBar />
      <h1>Chat Page</h1>
      <p>This is the chat page where you can interact with the chatbot.</p>
      {/* Additional chat components and functionality will go here */}
    </div>
  );
}

export default withAuth(Chat);
