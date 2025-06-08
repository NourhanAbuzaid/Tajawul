"use client";

import { useState, useRef } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import CustomChatIcon from "./CustomChatIcon";
import LaunchIcon from "@mui/icons-material/Launch";
import SendIcon from "@mui/icons-material/Send";
import styles from "./FloatingChatButton.module.css";
import Link from "next/link";

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef(null);

  const toggleChat = () => {
    setIsOpen((prev) => {
      if (prev) setIsHovered(false); // Reset hover when closing
      return !prev;
    });
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  };

  return (
    <div className={styles.container}>
      {isOpen ? (
        <div className={styles.chatContainer}>
          <div className={styles.chatHeader}>
            <Link href="/chat">
              <div className={styles.chatLink}>
                <LaunchIcon
                  className={styles.launchIcon}
                  sx={{ fontSize: "18px" }}
                />
                <span>Open Chat History</span>
              </div>
            </Link>
            <IconButton onClick={toggleChat} className={styles.closeButton}>
              <CloseIcon />
            </IconButton>
          </div>
          <div className={styles.chatContent}>
            {/* Chatbot integration will go here */}
            <CustomChatIcon
              size={84}
              isFallback={true}
              className={styles.mainIcon}
            />
            <span className={styles.chatFallback}>How can i help you?</span>
          </div>
          <div className={styles.chatInput}>
            {/* Input field for chat messages */}
            <div className={styles.inputWrapper}>
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Ask anything..."
                className={styles.inputField}
                rows={1}
                style={{ resize: "none", overflow: "hidden" }}
              />
              <SendIcon className={styles.sendIcon} />
            </div>
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
