import React, { useState } from "react";
import { FiSend } from "react-icons/fi";
import { motion } from "framer-motion";

function ChatInput({ onSendMessage, isLoading }) {
  const [inputText, setInputText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText);
    setInputText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-4 border-t border-white/10 bg-black/40 backdrop-blur-md"
    >
      <form onSubmit={handleSubmit} className="relative">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message Gemini AI..."
          className="w-full px-4 py-3 pr-12 rounded-xl bg-gray-800/70 border border-gray-700/50 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 placeholder-gray-400 text-white resize-none transition-all duration-200"
          style={{ maxHeight: "120px", minHeight: "56px" }}
          rows="1"
          disabled={isLoading}
        />
        <motion.button
          type="submit"
          disabled={isLoading || !inputText.trim()}
          className={`absolute right-3 bottom-2.5 p-2.5 rounded-lg transition-all duration-200 ${
            isLoading || !inputText.trim()
              ? "bg-gray-700/50 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 to-violet-500 text-white hover:shadow-lg hover:shadow-blue-500/20"
          }`}
          whileHover={{ scale: isLoading ? 1 : 1.05 }}
          whileTap={{ scale: isLoading ? 1 : 0.95 }}
        >
          <FiSend size={18} />
        </motion.button>
      </form>
      {isLoading && (
        <p className="text-xs text-center mt-2 text-gray-400">
          Gemini is thinking...
        </p>
      )}
    </motion.div>
  );
}

export default ChatInput;
