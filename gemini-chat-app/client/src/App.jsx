import React, { useState } from "react";
import ChatInterface from "./components/ChatInterface";
import "./App.css";
import { motion } from "framer-motion";

function App() {
  return (
    <div className="relative flex flex-col h-screen overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 z-0">
        <div className="absolute inset-0 opacity-20">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-purple-600 blur-3xl"
              initial={{
                opacity: 0.1,
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: Math.random() * 2 + 1,
              }}
              animate={{
                opacity: [0.1, 0.2, 0.1],
                scale: [1, 2, 1],
                x: [null, Math.random() * window.innerWidth],
                y: [null, Math.random() * window.innerHeight],
              }}
              transition={{
                duration: Math.random() * 20 + 15,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              style={{
                width: `${Math.random() * 40 + 10}vw`,
                height: `${Math.random() * 40 + 10}vh`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main content */}
      <motion.header
        className="relative z-10 py-4 px-6 flex items-center justify-between backdrop-blur-md border-b border-white/10 bg-black/20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400 pulse-animation">
          Gemini AI Chat
        </h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-full">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs text-gray-300">Powered by Google AI</span>
          </div>
        </div>
      </motion.header>

      <motion.main
        className="relative z-10 flex-1 flex items-center justify-center p-4 md:p-6 overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <ChatInterface />
      </motion.main>
    </div>
  );
}

export default App;
