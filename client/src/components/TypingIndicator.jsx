import React from "react";
import { motion } from "framer-motion";
import { RiRobot2Fill } from "react-icons/ri";

const TypingIndicator = () => {
  const bubbleVariants = {
    initial: { scale: 0.5, opacity: 0.3 },
    animate: (i) => ({
      scale: [0.5, 1, 0.5],
      opacity: [0.3, 1, 0.3],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        delay: i * 0.2,
      },
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-start px-4 my-4"
    >
      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center mr-3 shadow-lg shadow-violet-600/20 border-2 border-violet-400/30">
        <RiRobot2Fill size={20} className="text-white" />
      </div>
      <div className="py-3 px-4 bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm text-gray-100 rounded-2xl rounded-bl-none border border-gray-700/50 shadow-lg inline-flex items-center">
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              custom={i}
              variants={bubbleVariants}
              initial="initial"
              animate="animate"
              className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-violet-400 to-blue-400"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default TypingIndicator;
