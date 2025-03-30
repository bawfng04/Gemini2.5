import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser } from "react-icons/fi";
import { RiRobot2Fill } from "react-icons/ri";
import { format } from "date-fns"; // Add this to your dependencies

function Message({ message, index }) {
  const isUser = message.sender === "USER";
  const isError = message.sender === "ERROR";

  // Calculate staggered animation delay
  const staggerDelay = index * 0.05;

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 350,
        damping: 25,
        delay: staggerDelay,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.3 },
    },
  };

  const messageTime = message.timestamp
    ? format(new Date(message.timestamp), "h:mm a")
    : "";

  if (isError) {
    return (
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="flex items-center justify-center my-3 px-4"
      >
        <div className="max-w-md px-4 py-3 rounded-lg bg-gradient-to-r from-red-900/40 to-red-600/40 backdrop-blur-sm text-red-100 border border-red-500/30 shadow-lg">
          {message.text}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`flex items-end my-5 px-4 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center mr-3 shadow-lg shadow-violet-600/20 border-2 border-violet-400/30">
          <RiRobot2Fill size={20} className="text-white" />
        </div>
      )}

      <div className="flex flex-col">
        {!isUser && (
          <span className="text-xs text-gray-400 ml-3 mb-1">
            Gemini • {messageTime}
          </span>
        )}

        <motion.div
          whileHover={{ scale: 1.01 }}
          className={`max-w-xs sm:max-w-sm md:max-w-md px-4 py-3 rounded-2xl shadow-lg ${
            isUser
              ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-br-none shadow-blue-500/20"
              : "bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm text-gray-100 rounded-bl-none border border-gray-700/50"
          }`}
        >
          <div className="prose prose-sm max-w-none prose-invert">
            {message.text.split("\n").map((line, index) => (
              <span key={index}>
                {line}
                <br />
              </span>
            ))}
          </div>
        </motion.div>

        {isUser && (
          <span className="text-xs text-gray-400 mr-3 mt-1 text-right">
            You • {messageTime}
          </span>
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center ml-3 shadow-lg shadow-blue-500/20 border-2 border-blue-400/30">
          <FiUser size={18} className="text-white" />
        </div>
      )}
    </motion.div>
  );
}

function MessageList({ messages }) {
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  // Check if we should auto-scroll based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (!messagesContainerRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } =
        messagesContainerRef.current;
      // If user is within 100px of bottom, enable auto-scroll
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShouldAutoScroll(isNearBottom);
    };

    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Improved scroll function that only auto-scrolls if we're near the bottom
  const scrollToBottom = () => {
    if (shouldAutoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  // Auto-scroll when messages change if appropriate
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, shouldAutoScroll]);

  return (
    <div
      ref={messagesContainerRef}
      className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 py-6"
    >
      {messages.length === 0 && (
        <div className="h-full flex flex-col items-center justify-center text-center p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <RiRobot2Fill
              size={56}
              className="mx-auto text-violet-500 opacity-80"
            />
          </motion.div>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl font-medium mb-2 text-white/80"
          >
            Begin Your Conversation
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-400 max-w-md"
          >
            Start chatting with Gemini AI. Ask questions, get creative
            responses, or just have a friendly conversation.
          </motion.p>
        </div>
      )}

      <AnimatePresence initial={false}>
        {messages.map((msg, index) => (
          <Message key={msg.id} message={msg} index={index} />
        ))}
      </AnimatePresence>
      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessageList;
