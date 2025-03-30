import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import { AnimatePresence, motion } from "framer-motion";
import TypingIndicator from "./TypingIndicator";
import { IoAddCircle } from "react-icons/io5";

const API_URL = "http://localhost:5000/api";

function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [conversationId, setConversationId] = useState(null);

  // If there's a conversationId, load messages for that conversation
  useEffect(() => {
    if (conversationId) {
      const fetchMessages = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get(`${API_URL}/chat/${conversationId}`);

          if (response.data && Array.isArray(response.data)) {
            const formattedMessages = response.data.map((msg, index) => ({
              id: msg.MessageID || index,
              text: msg.Content,
              sender: msg.Sender,
              timestamp: msg.Timestamp,
            }));
            setMessages(formattedMessages);
          }
        } catch (err) {
          console.error("Error fetching messages:", err);
          setError("Failed to load conversation history.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchMessages();
    }
  }, [conversationId]);

  // Remove the scrollToBottomWithDelay function and related useEffect

  const handleSendMessage = useCallback(
    async (message) => {
      try {
        // Add user message to UI immediately
        const userMessage = {
          id: Date.now(),
          text: message,
          sender: "USER",
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);
        setError(null);

        // Send message to API
        const response = await axios.post(`${API_URL}/chat`, {
          message,
          conversationId,
        });

        // Add AI response to messages
        if (response.data) {
          const aiMessage = {
            id: Date.now() + 1,
            text: response.data.response,
            sender: "GEMINI",
            timestamp: new Date().toISOString(),
          };

          setMessages((prev) => [...prev, aiMessage]);

          // Update conversation ID if this was a new conversation
          if (response.data.conversationId && !conversationId) {
            setConversationId(response.data.conversationId);
          }
        }
      } catch (err) {
        console.error("Error sending message:", err);
        setError(
          err.response?.data?.error ||
            "Failed to send message. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [conversationId]
  );

  const startNewChat = () => {
    setMessages([]);
    setConversationId(null);
    setError(null);
  };

  return (
    <motion.div
      className="w-full max-w-4xl h-[85vh] flex flex-col rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(139,92,246,0.15)] transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      style={{
        background:
          "linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.5))",
        backdropFilter: "blur(16px)",
      }}
    >
      <motion.div
        className="p-4 border-b border-white/10 flex justify-between items-center"
        style={{
          background:
            "linear-gradient(to right, rgba(0,0,0,0.5), rgba(30,30,60,0.5))",
        }}
      >
        <h2 className="text-xl font-medium text-white/90 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
            {conversationId ? `Conversation #${conversationId}` : "New Chat"}
          </span>
        </h2>
        <motion.button
          onClick={startNewChat}
          className="px-4 py-2 rounded-full flex items-center gap-2 text-white text-sm font-medium transition-all duration-300 active:scale-95"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{
            background:
              "linear-gradient(to right, rgb(219, 39, 119), rgb(124, 58, 237))",
            boxShadow: "0 4px 15px rgba(219, 39, 119, 0.25)",
          }}
        >
          <IoAddCircle size={18} />
          New Chat
        </motion.button>
      </motion.div>

      <MessageList messages={messages} />

      <AnimatePresence>{isLoading && <TypingIndicator />}</AnimatePresence>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-3 mx-4 my-2 text-red-200 text-center text-sm bg-red-500/20 border border-red-500/30 rounded-lg"
        >
          {error}
        </motion.div>
      )}

      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </motion.div>
  );
}

export default ChatInterface;
