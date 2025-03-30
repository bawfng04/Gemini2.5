import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser } from "react-icons/fi";
import { RiRobot2Fill } from "react-icons/ri";

function Message({ message }) {
  const isUser = message.sender === "USER";
  const isError = message.sender === "ERROR";

  const itemVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 350, damping: 25 },
    },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
  };

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
      className={`flex items-end my-4 px-4 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center mr-3 shadow-lg shadow-violet-600/20 border-2 border-violet-400/30">
          <RiRobot2Fill size={20} className="text-white" />
        </div>
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
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center ml-3 shadow-lg shadow-blue-500/20 border-2 border-blue-400/30">
          <FiUser size={18} className="text-white" />
        </div>
      )}
    </motion.div>
  );
}

function MessageList({ messages }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 py-6">
      <AnimatePresence initial={false}>
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Message message={msg} />
          </motion.div>
        ))}
      </AnimatePresence>
      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessageList;
