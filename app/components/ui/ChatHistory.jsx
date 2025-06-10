import { useState, useEffect } from "react";
import useChatStore from "@/store/chatStore";
import API from "@/utils/api";
import styles from "@/styles/Chatbot.module.css";
import ChatIcon from "@mui/icons-material/Chat";

const ChatCard = ({ chat, isActive, onClick }) => {
  const prompt = chat.messages[0]?.prompt || "New Chat";
  const truncatedPrompt =
    prompt.length > 30 ? `${prompt.substring(0, 30)}...` : prompt;

  return (
    <div
      className={`${styles.chatCard} ${isActive ? styles.activeChatCard : ""}`}
      onClick={onClick}
    >
      <div className={styles.chatCardContent}>
        <div className={styles.chatCardTitle}>
          <ChatIcon className={styles.chatCardIcon} />
          <p className={styles.chatCardPrompt}>{truncatedPrompt}</p>
        </div>
      </div>
    </div>
  );
};

const ChatHistory = () => {
  const { chatId } = useChatStore();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setChatId, setMessages } = useChatStore();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await API.get("/Chats");
        setChats(response.data);
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  const handleChatClick = (chat) => {
    setChatId(chat.chatId);
    // Convert API messages to our format
    const formattedMessages = chat.messages.map((msg) => ({
      sender: "user",
      text: msg.prompt,
    }));
    if (chat.messages[0]?.response) {
      formattedMessages.push({
        sender: "bot",
        text: chat.messages[0].response,
      });
    }
    setMessages(formattedMessages);
  };

  if (loading) {
    return <div className={styles.loadingWrapper}>Loading chats...</div>;
  }

  return (
    <div className={styles.chatHistoryList}>
      {chats.map((chat) => (
        <ChatCard
          key={chat.chatId}
          chat={chat}
          isActive={chatId === chat.chatId}
          onClick={() => handleChatClick(chat)}
        />
      ))}
    </div>
  );
};

export default ChatHistory;
