"use client";

import { useState, useRef } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import CustomChatIcon from "./CustomChatIcon";
import LaunchIcon from "@mui/icons-material/Launch";
import SendIcon from "@mui/icons-material/Send";
import styles from "./FloatingChatButton.module.css";
import useChatStore from "@/store/chatStore";
import Link from "next/link";
import API from "@/utils/api";

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [hasSentFirstMessage, setHasSentFirstMessage] = useState(false);
  const {
    chatId,
    setChatId,
    addMessage,
    setMessages: setGlobalMessages, // ✅ renamed to avoid conflict
  } = useChatStore();

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

    // Add user message to UI and store
    const userMessage = { sender: "user", text: prompt };
    setMessages((prev) => [...prev, userMessage]); // local state
    addMessage(userMessage); // global Zustand store

    try {
      let response;

      if (!hasSentFirstMessage) {
        // First message: create a new chat session
        response = await API.post("/Chats", { prompt });

        const { chatId: newChatId, messages } = response.data;
        const botMessage = messages[0]?.response || "No response received.";

        // Store chatId globally
        setChatId(newChatId);

        // Add bot response to state and global store
        const botResponse = { sender: "bot", text: botMessage };
        setMessages((prev) => [...prev, botResponse]); // local state
        addMessage(botResponse); // global state
        setGlobalMessages([userMessage, botResponse]); // update all messages in Zustand

        setHasSentFirstMessage(true);
      } else {
        // Subsequent messages: continue the chat
        response = await API.post("/prompt", { chatId, prompt });

        const botMessage =
          response.data?.response || "No response received from the bot.";

        const botResponse = { sender: "bot", text: botMessage };
        setMessages((prev) => [...prev, botResponse]); // local state
        addMessage(botResponse); // global state
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = {
        sender: "bot",
        text: "Sorry, I couldn't process your request. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMessage]); // local state
      addMessage(errorMessage); // global state
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
                    className={`${styles.messageWrapper} ${
                      message.sender === "user"
                        ? styles.userMessageWrapper
                        : styles.botMessageWrapper
                    }`}
                  >
                    {message.sender === "bot" && (
                      <div className={styles.botAvatar}>
                        <CustomChatIcon size={24} isActive={true} />
                      </div>
                    )}
                    <div
                      className={`${styles.message} ${
                        message.sender === "user"
                          ? styles.userMessage
                          : styles.botMessage
                      }`}
                    >
                      {message.text}
                    </div>
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
