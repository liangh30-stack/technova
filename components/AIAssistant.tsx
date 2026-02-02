import React, { useState, useRef, useEffect } from 'react';
import { Bot, Image as ImageIcon, Send, X, Loader2, BrainCircuit, MessageSquare, Sparkles } from 'lucide-react';
import { chatWithAssistant, chatWithThinking, analyzeImage } from '../services/geminiService';

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'chat' | 'vision' | 'think'>('chat');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', text: string, type?: string}[]>([
    { role: 'assistant', text: "Hello! I'm your AI technical assistant. How can I help you today?" }
  ]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Strip prefix for API
        const base64Data = base64String.split(',')[1];
        setSelectedImage(base64Data);
        setMode('vision');
        setMessages(prev => [...prev, { role: 'assistant', text: "Image uploaded! What should I look for?" }]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if (!input.trim() && !selectedImage) return;

    const currentInput = input;
    const currentImage = selectedImage;
    
    setMessages(prev => [...prev, { role: 'user', text: currentInput || (currentImage ? "[Image Analysis Request]" : "") }]);
    setInput('');
    setLoading(true);

    let response = '';

    try {
      if (mode === 'vision' && currentImage) {
        response = await analyzeImage(currentImage, currentInput);
        setSelectedImage(null); // Clear after sending
        setMode('chat'); // Revert to chat
      } else if (mode === 'think') {
        response = await chatWithThinking(currentInput);
      } else {
        response = await chatWithAssistant(currentInput);
      }
    } catch (e) {
      response = "Sorry, I encountered an error processing that request.";
    }

    setMessages(prev => [...prev, { role: 'assistant', text: response, type: mode }]);
    setLoading(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-lg hover:shadow-blue-500/30 transition-all hover:scale-110 flex items-center justify-center"
      >
        {isOpen ? <X size={24} /> : <Bot size={24} />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 md:w-96 h-[500px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 font-sans">
          
          {/* Header */}
          <div className="bg-slate-800 p-3 border-b border-slate-700">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-indigo-500/20 p-1.5 rounded-lg">
                <Sparkles size={18} className="text-indigo-400" />
              </div>
              <h3 className="font-bold text-white text-sm">Gemini AI Assistant</h3>
            </div>
            
            {/* Mode Toggles */}
            <div className="flex bg-slate-900 p-1 rounded-lg">
               <button 
                 onClick={() => setMode('chat')}
                 className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-medium rounded-md transition-colors ${mode === 'chat' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
               >
                 <MessageSquare size={14} /> Chat
               </button>
               <button 
                 onClick={() => setMode('think')}
                 className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-medium rounded-md transition-colors ${mode === 'think' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
               >
                 <BrainCircuit size={14} /> Think
               </button>
               <button 
                 onClick={() => fileInputRef.current?.click()}
                 className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-medium rounded-md transition-colors ${mode === 'vision' ? 'bg-green-600 text-white' : 'text-slate-400 hover:text-white'}`}
               >
                 <ImageIcon size={14} /> Vision
               </button>
               <input 
                 type="file" 
                 ref={fileInputRef} 
                 className="hidden" 
                 accept="image/*"
                 onChange={handleImageUpload} 
               />
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
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
                 <div className="bg-slate-800 rounded-2xl rounded-bl-none px-4 py-3 border border-slate-700 flex items-center gap-2 text-slate-400 text-xs">
                    <Loader2 size={14} className="animate-spin" />
                    {mode === 'think' ? 'Thinking deeply...' : mode === 'vision' ? 'Analyzing image...' : 'Typing...'}
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-slate-800 border-t border-slate-700">
             {selectedImage && (
               <div className="flex items-center gap-2 mb-2 bg-slate-900 p-2 rounded-lg border border-slate-700">
                 <div className="w-8 h-8 bg-slate-700 rounded flex items-center justify-center">
                   <ImageIcon size={16} className="text-slate-400"/>
                 </div>
                 <span className="text-xs text-slate-300 flex-1 truncate">Image loaded</span>
                 <button onClick={() => { setSelectedImage(null); setMode('chat'); }} className="text-slate-500 hover:text-white"><X size={14}/></button>
               </div>
             )}
             <div className="flex gap-2">
               <input 
                 type="text" 
                 value={input}
                 onChange={e => setInput(e.target.value)}
                 onKeyDown={e => e.key === 'Enter' && handleSend()}
                 placeholder={mode === 'think' ? "Ask a complex question..." : "Type a message..."}
                 className="flex-1 bg-slate-900 border border-slate-600 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
               />
               <button 
                 onClick={handleSend}
                 className={`p-2 rounded-xl transition-colors text-white ${mode === 'think' ? 'bg-purple-600 hover:bg-purple-500' : 'bg-blue-600 hover:bg-blue-500'}`}
               >
                 <Send size={18} />
               </button>
             </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;
