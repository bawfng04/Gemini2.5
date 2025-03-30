import React from "react";
import { motion } from "framer-motion";
import { RiRobot2Fill } from "react-icons/ri";

const TypingIndicator = () => {
  const bounceTransition = {
    y: {
      duration: 0.4,
      yoyo: Infinity,
      ease: "easeOut",
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-start px-4 my-4"
    >
      <motion.div
        className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center mr-3 shadow-lg shadow-violet-600/20 border-2 border-violet-400/30"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <RiRobot2Fill size={20} className="text-white" />
      </motion.div>

      <div className="py-3 px-5 bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm text-gray-100 rounded-2xl rounded-bl-none border border-gray-700/50 shadow-lg inline-flex items-center">
        <div className="flex items-center space-x-2">
          <motion.div
            animate={{ y: ["0%", "-30%", "0%"] }}
            transition={{
              ...bounceTransition,
              delay: 0,
            }}
            className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-violet-400 to-blue-400"
          />
          <motion.div
            animate={{ y: ["0%", "-30%", "0%"] }}
            transition={{
              ...bounceTransition,
              delay: 0.1,
            }}
            className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-violet-400 to-blue-400"
          />
          <motion.div
            animate={{ y: ["0%", "-30%", "0%"] }}
            transition={{
              ...bounceTransition,
              delay: 0.2,
            }}
            className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-violet-400 to-blue-400"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default TypingIndicator;
