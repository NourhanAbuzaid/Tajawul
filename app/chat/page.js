"use client";

import NavBar from "@/components/ui/NavBar";
import withAuth from "@/utils/withAuth";
import AddIcon from "@mui/icons-material/Add";
import styles from "@/styles/Chatbot.module.css";

function Chat() {
  return (
    <div>
      <NavBar />
      <div className={styles.chatPageContainer}>
        <div className={styles.chatHistoryColumn}>
          <button className={styles.newChatButton}>
            <AddIcon /> New Chat
          </button>
          {/* Chat history */}
        </div>
        <div className={styles.chatInputColumn}>
          <h2>Chat Input</h2>
          <p>Here you can type your messages to the chatbot.</p>
          {/* Chat input field and send button will go here */}
        </div>
      </div>
    </div>
  );
}

export default withAuth(Chat);
