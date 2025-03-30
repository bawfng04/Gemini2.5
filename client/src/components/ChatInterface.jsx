import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import { AnimatePresence } from "framer-motion";
import TypingIndicator from "./TypingIndicator";

const API_URL = "http://localhost:5000/api"; // Your backend URL

function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [conversationId, setConversationId] = useState(null); // Store current conversation ID

  // Optional: Load initial messages if a conversation ID exists (e.g., from local storage or URL param)
  useEffect(() => {
    const loadHistory = async (convId) => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/chat/${convId}`);
        setMessages(
          response.data.map((msg) => ({
            id: msg.MessageID, // Use a unique ID from DB
            sender: msg.Sender,
            text: msg.Content,
            timestamp: msg.Timestamp,
          }))
        );
        setConversationId(convId);
      } catch (err) {
        console.error("Error loading chat history:", err);
        setError("Failed to load chat history.");
        setConversationId(null); // Reset on error
        setMessages([]);
      } finally {
        setIsLoading(false);
      }
    };

    const initialConvId = localStorage.getItem("conversationId"); // Example: load from storage
    if (initialConvId) {
      loadHistory(initialConvId);
    }
  }, []);

  const handleSendMessage = useCallback(
    async (inputText) => {
      if (!inputText.trim()) return;

      const userMessage = {
        id: Date.now(), // Temporary ID for UI rendering
        sender: "USER",
        text: inputText,
        timestamp: new Date().toISOString(),
      };

      // Optimistically update UI
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.post(`${API_URL}/chat`, {
          message: inputText,
          conversationId: conversationId, // Send current ID, backend handles new one if null
        });

        const geminiMessage = {
          id: Date.now() + 1, // Temporary ID
          sender: "GEMINI",
          text: response.data.response,
          timestamp: new Date().toISOString(),
        };

        // Update state with Gemini response and the potentially new/confirmed conversation ID
        setMessages((prev) => [...prev, geminiMessage]);
        if (
          response.data.conversationId &&
          response.data.conversationId !== conversationId
        ) {
          setConversationId(response.data.conversationId);
          // Optional: Save conversationId to localStorage
          // localStorage.setItem('conversationId', response.data.conversationId);
        }
      } catch (err) {
        console.error("Error sending message:", err);
        const errorText =
          err.response?.data?.error || "Failed to get response from Gemini.";
        setError(errorText);
        // Optional: Remove optimistic user message on error, or add error message
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 2, sender: "ERROR", text: `Error: ${errorText}` },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [conversationId]
  ); // Re-create function if conversationId changes

  // Clear chat and start new conversation
  const startNewChat = () => {
    setMessages([]);
    setConversationId(null);
    setError(null);
    // Optional: Remove from localStorage
    // localStorage.removeItem('conversationId');
  };

  return (
    <div className="w-full max-w-4xl h-[80vh] flex flex-col bg-black/30 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border border-white/10 transition-all duration-300">
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20">
        <h2 className="text-xl font-medium text-white/90 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Active Conversation
        </h2>
        <button
          onClick={startNewChat}
          className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700 text-white text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-pink-500/25 active:scale-95"
        >
          New Chat
        </button>
      </div>
      <MessageList messages={messages} />
      <AnimatePresence>{isLoading && <TypingIndicator />}</AnimatePresence>
      {error && (
        <div className="p-3 mx-4 my-2 text-red-200 text-center text-sm bg-red-500/20 border border-red-500/30 rounded-lg">
          {error}
        </div>
      )}
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}

export default ChatInterface;
