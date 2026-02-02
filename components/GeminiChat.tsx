import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { chatWithAssistant } from '../services/geminiService';

const GeminiChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', text: string}[]>([
    { role: 'assistant', text: "Hi! I'm TechBot. Need help finding a case or checking a repair?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const response = await chatWithAssistant(userMsg);
    
    setMessages(prev => [...prev, { role: 'assistant', text: response }]);
    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-lg hover:shadow-blue-500/30 transition-all hover:scale-110"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 md:w-96 h-[450px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="bg-slate-800 p-4 border-b border-slate-700 flex items-center gap-3">
             <div className="bg-blue-500/20 p-2 rounded-lg">
                <Bot size={20} className="text-blue-400" />
             </div>
             <div>
               <h3 className="font-bold text-white text-sm">TechBot Support</h3>
               <span className="text-xs text-green-400 flex items-center gap-1">
                 <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/> Online
               </span>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/95">
             {messages.map((msg, idx) => (
               <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                 <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                   msg.role === 'user' 
                   ? 'bg-blue-600 text-white rounded-br-none' 
                   : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                 }`}>
                   {msg.text}
                 </div>
               </div>
             ))}
             {loading && (
               <div className="flex justify-start">
                 <div className="bg-slate-800 rounded-2xl rounded-bl-none px-4 py-3 border border-slate-700">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-200" />
                    </div>
                 </div>
               </div>
             )}
             <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-slate-800 border-t border-slate-700 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about repairs or cases..."
              className="flex-1 bg-slate-900 border border-slate-600 rounded-xl px-3 text-sm text-white focus:outline-none focus:border-blue-500"
            />
            <button 
              onClick={handleSend}
              className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-xl transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default GeminiChat;
