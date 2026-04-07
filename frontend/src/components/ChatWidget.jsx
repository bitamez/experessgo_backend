import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Sparkles, ChevronRight, User, Send } from 'lucide-react';
import aiService from '../ai/aiService';

const ChatWidget = ({ isOpen, toggle }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I can check schedules, book seats, or answer travel questions. How can I help?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const data = await aiService.chat(input);
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I am having trouble connecting to the server. Please check if the backend is running.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="glass-card w-[380px] h-[500px] mb-6 flex flex-col overflow-hidden shadow-2xl border-white/20"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-700 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-black/20 p-2 rounded-lg">
                  <Sparkles size={18} className="text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-black leading-none">AI Travel Assistant</h4>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 p-4 space-y-4 overflow-y-auto bg-black/20 scrollbar-hide"
            >
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border 
                    ${msg.role === 'user' ? 'bg-primary-500/20 border-primary-500/30' : 'bg-white/10 border-white/20'}`}
                  >
                    {msg.role === 'user' ? <User size={16} className="text-primary-500" /> : <Sparkles size={16} className="text-primary-500" />}
                  </div>
                  <div className={`glass-card !rounded-2xl p-3 max-w-[80%] 
                    ${msg.role === 'user' ? '!bg-primary-500/10 !rounded-tr-none' : '!bg-white/5 !rounded-tl-none'}`}
                  >
                    <p className="text-xs leading-relaxed text-white">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2 animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                    <Sparkles size={16} className="text-primary-500" />
                  </div>
                  <div className="glass-card !bg-white/5 !rounded-tl-none p-3">
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/5">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                className="relative"
              >
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..." 
                  className="input-field w-full pr-12 text-sm focus:border-primary-500/50"
                  disabled={isLoading}
                />
                <button 
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 top-1.5 p-1.5 bg-primary-500 hover:bg-primary-400 rounded-lg text-black transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Send size={18} strokeWidth={3} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={toggle}
        className={`p-4 rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 group flex items-center gap-3 cursor-pointer
          ${isOpen ? 'bg-white text-black' : 'bg-primary-500 text-black shadow-primary-500/30'}
        `}
      >
        {isOpen ? <MessageCircle size={24} /> : (
          <>
            <Sparkles size={24} className="animate-pulse" />
            <span className="font-bold pr-2 hidden sm:inline">Ask AI</span>
          </>
        )}
      </button>
    </div>
  );
};

export default ChatWidget;
