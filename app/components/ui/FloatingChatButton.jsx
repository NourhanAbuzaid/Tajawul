"use client";

import { useState, useRef, useEffect } from "react";
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
import ChatLoading from "./ChatLoading";

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedBotText, setDisplayedBotText] = useState("");
  const {
    chatId,
    setChatId,
    addMessage,
    setMessages: setGlobalMessages,
  } = useChatStore();
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    if (!inputValue.trim() || isLoading) return;

    const prompt = inputValue.trim();
    setInputValue("");
    setIsLoading(true);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = "48px"; // Reset to default height
    }

    // Add user message to UI and store
    const userMessage = { sender: "user", text: prompt };
    setMessages((prev) => [...prev, userMessage]); // local state
    addMessage(userMessage); // global Zustand store

    try {
      let response;
      if (!chatId) {
        // First message - create new chat
        response = await API.post("/Chats", { prompt });
        const { chatId: newChatId, messages: apiMessages } = response.data;
        setChatId(newChatId);

        const fullText = apiMessages[0]?.response || "No response received";
        setIsTyping(true);
        setDisplayedBotText(""); // Start with empty string

        // Typewriter effect
        let i = -1; // Start from the first character
        const interval = setInterval(() => {
          setDisplayedBotText((prev) => prev + fullText.charAt(i));
          i++;
          if (i >= fullText.length) {
            clearInterval(interval);
            setIsTyping(false);
            const botMessage = {
              sender: "bot",
              text: fullText,
            };
            setMessages((prev) => [...prev, botMessage]); // local state
            addMessage(botMessage); // global state
            setGlobalMessages([userMessage, botMessage]); // update all messages in Zustand
            setDisplayedBotText("");
          }
        }, 40); // Adjust typing speed here
      } else {
        // Continue existing chat
        response = await API.post("/Chats/prompt", { chatId, prompt });
        const botMessage = {
          sender: "bot",
          text: response.data?.response || "No response received",
        };
        setMessages((prev) => [...prev, botMessage]); // local state
        addMessage(botMessage); // global state
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = {
        sender: "bot",
        text: "Sorry, I couldn't process your request. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMessage]); // local state
      addMessage(errorMessage); // global state
    } finally {
      setIsLoading(false);
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
                {isLoading && (
                  <div
                    className={`${styles.messageWrapper} ${styles.botMessageWrapper}`}
                  >
                    <div className={styles.botAvatar}>
                      <CustomChatIcon size={24} isActive={true} />
                    </div>
                    <div className={`${styles.message} ${styles.botMessage}`}>
                      <ChatLoading />
                    </div>
                  </div>
                )}
                {isTyping && (
                  <div
                    className={`${styles.messageWrapper} ${styles.botMessageWrapper}`}
                  >
                    <div className={styles.botAvatar}>
                      <CustomChatIcon size={24} isActive={true} />
                    </div>
                    <div
                      className={`${styles.message} ${styles.botMessage} ${styles.typewriterCursor}`}
                    >
                      {displayedBotText}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
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
                disabled={isLoading}
              />
              <SendIcon
                className={styles.sendIcon}
                onClick={handleSendMessage}
                sx={{
                  color: isLoading
                    ? "var(--Neutrals-Light-Outline)"
                    : "var(--Green-Perfect)",
                  cursor: isLoading ? "not-allowed" : "pointer",
                }}
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
