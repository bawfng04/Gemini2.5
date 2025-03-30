import React, { useState, useRef, useEffect } from "react";
import { FiSend, FiMic } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

function ChatInput({ onSendMessage, isLoading }) {
  const [inputText, setInputText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);

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

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "56px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(scrollHeight, 120) + "px";
    }
  }, [inputText]);

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-4 border-t border-white/10"
      style={{
        background: "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.4))",
      }}
    >
      <form onSubmit={handleSubmit} className="relative">
        <motion.div
          className={`relative rounded-2xl ${
            isFocused ? "ring-2 ring-blue-500/50" : ""
          } transition-all duration-300`}
          animate={{
            boxShadow: isFocused
              ? "0 0 15px rgba(59, 130, 246, 0.3)"
              : "0 0 0 rgba(59, 130, 246, 0)",
          }}
        >
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Message Gemini AI..."
            className="w-full px-4 py-3 pr-24 rounded-xl bg-gray-800/70 border border-gray-700/50 placeholder-gray-400 text-white resize-none transition-all duration-200"
            style={{ minHeight: "56px" }}
            disabled={isLoading}
          />

          <div className="absolute right-2 bottom-1.5 flex gap-2">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex items-center justify-center h-10 px-3 rounded-lg bg-gray-700/50 text-gray-400"
                >
                  <div className="flex space-x-1">
                    <div
                      className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"
                      style={{ animationDelay: "0s" }}
                    ></div>
                    <div
                      className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="buttons"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex gap-2"
                >
                  <motion.button
                    type="button"
                    className="p-2.5 rounded-lg bg-gray-700/70 text-gray-300 hover:bg-gray-600/70 hover:text-white transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiMic size={18} />
                  </motion.button>

                  <motion.button
                    type="submit"
                    disabled={isLoading || !inputText.trim()}
                    className={`p-2.5 rounded-lg ${
                      isLoading || !inputText.trim()
                        ? "bg-gray-700/50 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-500 to-violet-500 text-white hover:shadow-lg hover:shadow-blue-500/20"
                    } transition-all duration-200`}
                    whileHover={{
                      scale: isLoading || !inputText.trim() ? 1 : 1.05,
                    }}
                    whileTap={{
                      scale: isLoading || !inputText.trim() ? 1 : 0.95,
                    }}
                  >
                    <FiSend size={18} />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </form>

      {isLoading && (
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="text-xs text-center mt-2 text-indigo-300"
        >
          Gemini is thinking...
        </motion.p>
      )}
    </motion.div>
  );
}

export default ChatInput;
