"use client";

import NavBar from "@/components/ui/NavBar";
import withAuth from "@/utils/withAuth";
import AddIcon from "@mui/icons-material/Add";
import SendIcon from "@mui/icons-material/Send";
import CustomChatIcon from "@/components/ui/CustomChatIcon";
import styles from "@/styles/Chatbot.module.css";
import useChatStore from "@/store/chatStore";
import { useState, useRef, useEffect } from "react";
import API from "@/utils/api";

function Chat() {
  const { chatId, messages, setChatId, addMessage, setMessages } =
    useChatStore();
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      textareaRef.current.style.height = "56px"; // Reset to default height
    }

    // Add user message
    const userMessage = { sender: "user", text: prompt };
    addMessage(userMessage);

    try {
      let response;
      if (!chatId) {
        // First message - create new chat
        response = await API.post("/Chats", { prompt });
        const { chatId: newChatId, messages: apiMessages } = response.data;
        setChatId(newChatId);

        const botMessage = {
          sender: "bot",
          text: apiMessages[0]?.response || "No response received",
        };
        addMessage(botMessage);
      } else {
        // Continue existing chat
        response = await API.post("/prompt", { chatId, prompt });
        const botMessage = {
          sender: "bot",
          text: response.data?.response || "No response received",
        };
        addMessage(botMessage);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      addMessage({
        sender: "bot",
        text: "Sorry, I couldn't process your request. Please try again later.",
      });
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

  const handleNewChat = () => {
    setMessages([]);
    setChatId(null);
  };

  return (
    <div>
      <NavBar />
      <div className={styles.chatPageContainer}>
        <div className={styles.chatHistoryColumn}>
          <button className={styles.newChatButton} onClick={handleNewChat}>
            <AddIcon /> New Chat
          </button>
          {/* Chat history sidebar would go here */}
        </div>

        <div className={styles.chatInputColumn}>
          <div className={styles.chatContent}>
            {messages.length === 0 ? (
              <div className={styles.fallbackContainer}>
                <CustomChatIcon
                  size={120}
                  isFallback={true}
                  className={styles.mainIcon}
                />
                <span className={styles.chatFallback}>
                  How can I help you today?
                </span>
              </div>
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
                        <CustomChatIcon size={28} isActive={true} />
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
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(Chat);
