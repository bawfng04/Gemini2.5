import React from "react";
import ChatInterface from "./components/ChatInterface";

function App() {
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <header className="py-4 px-6 flex items-center justify-between bg-black/20 backdrop-blur-md border-b border-white/10">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
          Gemini AI Chat
        </h1>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs text-gray-300">Powered by Google AI</span>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4 md:p-6 overflow-hidden">
        <ChatInterface />
      </main>
    </div>
  );
}

export default App;
