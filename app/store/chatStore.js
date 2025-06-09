// store/chatStore.js
import { create } from "zustand";

const useChatStore = create((set) => ({
  chatId: typeof window !== "undefined" ? localStorage.getItem("chatId") : null,
  messages:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("chatMessages") || "[]")
      : [],

  // Set the entire chat state (chatId and messages)
  setChat: (chatId, messages) => {
    localStorage.setItem("chatId", chatId);
    localStorage.setItem("chatMessages", JSON.stringify(messages));
    set({ chatId, messages });
  },

  // Set just the chatId
  setChatId: (chatId) => {
    localStorage.setItem("chatId", chatId);
    set({ chatId });
  },

  // Set just the messages array
  setMessages: (messages) => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
    set({ messages });
  },

  // Add a new message to the chat
  addMessage: (message) => {
    set((state) => {
      const updatedMessages = [...state.messages, message];
      localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
      return { messages: updatedMessages };
    });
  },

  // Clear the entire chat state
  clearChat: () => {
    localStorage.removeItem("chatId");
    localStorage.removeItem("chatMessages");
    set({ chatId: null, messages: [] });
  },

  // Get the last message in the chat
  getLastMessage: () => {
    const messages = useChatStore.getState().messages;
    return messages.length > 0 ? messages[messages.length - 1] : null;
  },
}));

export default useChatStore;
