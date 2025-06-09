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
import API from "@/utils/api";

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [hasSentFirstMessage, setHasSentFirstMessage] = useState(false);
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

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const prompt = inputValue.trim();
    setInputValue("");

    // Add user message to chat
    setMessages((prev) => [...prev, { sender: "user", text: prompt }]);

    try {
      // Only send to API for the first message
      if (!hasSentFirstMessage) {
        const response = await API.post("/Chats", {
          prompt: prompt,
        });

        // Extract the first message response from the API
        const botResponse =
          response.data.messages[0]?.response ||
          "I couldn't generate a response. Please try again.";

        // Add bot response to chat
        setMessages((prev) => [...prev, { sender: "bot", text: botResponse }]);
        setHasSentFirstMessage(true);
      } else {
        // For subsequent messages, just show a placeholder
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "Thanks for your message! Please visit the full chat for more interactions.",
          },
        ]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Sorry, I couldn't process your request. Please try again later.",
        },
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
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
            {messages.length === 0 ? (
              <>
                <CustomChatIcon
                  size={84}
                  isFallback={true}
                  className={styles.mainIcon}
                />
                <span className={styles.chatFallback}>How can I help you?</span>
              </>
            ) : (
              <div className={styles.messagesContainer}>
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`${styles.message} ${
                      message.sender === "user"
                        ? styles.userMessage
                        : styles.botMessage
                    }`}
                  >
                    {message.text}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className={styles.chatInput}>
            <div className={styles.inputWrapper}>
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything..."
                className={styles.inputField}
                rows={1}
                style={{ resize: "none", overflow: "hidden" }}
              />
              <SendIcon
                className={styles.sendIcon}
                onClick={handleSendMessage}
              />
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
