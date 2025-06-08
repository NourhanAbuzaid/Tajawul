"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import CustomChatIcon from "./CustomChatIcon";
import styles from "./FloatingChatButton.module.css";

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.container}>
      {isOpen ? (
        <div className={styles.chatContainer}>
          <div className={styles.chatHeader}>
            <h3>Travel Assistant</h3>
            <IconButton onClick={toggleChat} className={styles.closeButton}>
              <CloseIcon />
            </IconButton>
          </div>
          <div className={styles.chatContent}>
            {/* Chatbot integration will go here */}
            <p>Chatbot coming soon!</p>
          </div>
        </div>
      ) : (
        <Button
          variant="contained"
          className={styles.fabButton}
          onClick={toggleChat}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <CustomChatIcon
            size={56}
            isActive={isHovered}
            className={styles.icon}
          />
        </Button>
      )}
    </div>
  );
}
