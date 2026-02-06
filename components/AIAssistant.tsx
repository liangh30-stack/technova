import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Bot, Image as ImageIcon, Send, X, Loader2, BrainCircuit, MessageSquare, Sparkles } from 'lucide-react';
import { chatWithAssistant, chatWithThinking, analyzeImage } from '../services/geminiService';

const AIAssistant: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'chat' | 'vision' | 'think'>('chat');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', text: string, type?: string}[]>([
    { role: 'assistant', text: t('aiWelcome') || "Hello! I'm your AI technical assistant. How can I help you today?" }
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
        setMessages(prev => [...prev, { role: 'assistant', text: t('aiImageUploaded') || "Image uploaded! What should I look for?" }]);
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
      response = t('aiError') || "Sorry, I encountered an error processing that request.";
    }

    setMessages(prev => [...prev, { role: 'assistant', text: response, type: mode }]);
    setLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-brand-primary hover:bg-brand-primary-dark text-white p-4 rounded-lg shadow-lg transition-all hover:scale-110 flex items-center justify-center"
        aria-label={isOpen ? 'Close assistant' : 'Open assistant'}
      >
        {isOpen ? <X size={24} /> : <Bot size={24} />}
      </button>

      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-50 w-80 md:w-96 h-[500px] bg-white border border-brand-border rounded-lg shadow-xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 font-sans"
          role="dialog"
          aria-label={t('aiAssistantTitle') || 'TechNova Assistant'}
        >

          {/* Header */}
          <div className="bg-brand-light p-3 border-b border-brand-border">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-brand-primary-light p-1.5 rounded-lg" aria-hidden="true">
                <Sparkles size={18} className="text-brand-primary" />
              </div>
              <h3 className="font-bold text-brand-dark text-sm">{t('aiAssistantTitle') || 'TechNova Assistant'}</h3>
            </div>

            {/* Mode Toggles */}
            <div className="flex bg-white p-1 rounded-lg border border-brand-border" role="tablist" aria-label="Assistant mode">
               <button
                 onClick={() => setMode('chat')}
                 role="tab"
                 aria-selected={mode === 'chat'}
                 aria-label={t('aiChat') || 'Chat'}
                 className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-medium rounded-md transition-colors ${mode === 'chat' ? 'bg-brand-primary text-white' : 'text-brand-muted hover:text-brand-dark'}`}
               >
                 <MessageSquare size={14} /> {t('aiChat') || 'Chat'}
               </button>
               <button
                 onClick={() => setMode('think')}
                 role="tab"
                 aria-selected={mode === 'think'}
                 aria-label={t('aiThink') || 'Think'}
                 className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-medium rounded-md transition-colors ${mode === 'think' ? 'bg-brand-info text-white' : 'text-brand-muted hover:text-brand-dark'}`}
               >
                 <BrainCircuit size={14} /> {t('aiThink') || 'Think'}
               </button>
               <button
                 onClick={() => fileInputRef.current?.click()}
                 role="tab"
                 aria-selected={mode === 'vision'}
                 aria-label={t('aiVision') || 'Vision'}
                 className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-medium rounded-md transition-colors ${mode === 'vision' ? 'bg-brand-accent text-white' : 'text-brand-muted hover:text-brand-dark'}`}
               >
                 <ImageIcon size={14} /> {t('aiVision') || 'Vision'}
               </button>
               <input
                 type="file"
                 ref={fileInputRef}
                 className="hidden"
                 accept="image/*"
                 onChange={handleImageUpload}
                 aria-label="Upload image for vision analysis"
               />
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white" role="log" aria-label="Chat messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-lg px-4 py-2.5 text-sm ${
                  msg.role === 'user'
                  ? 'bg-brand-primary text-white rounded-br-none'
                  : 'bg-brand-light text-brand-dark rounded-bl-none border border-brand-border'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                 <div className="bg-brand-light rounded-lg rounded-bl-none px-4 py-3 border border-brand-border flex items-center gap-2 text-brand-muted text-xs" aria-live="polite">
                    <Loader2 size={14} className="animate-spin" />
                    {mode === 'think' ? (t('aiThinkingDeeply') || 'Thinking deeply...') : mode === 'vision' ? (t('aiAnalyzingImage') || 'Analyzing image...') : (t('aiTyping') || 'Typing...')}
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-brand-light border-t border-brand-border">
             {selectedImage && (
               <div className="flex items-center gap-2 mb-2 bg-white p-2 rounded-lg border border-brand-border">
                 <div className="w-8 h-8 bg-brand-light rounded-lg flex items-center justify-center" aria-hidden="true">
                   <ImageIcon size={16} className="text-brand-muted"/>
                 </div>
                 <span className="text-xs text-brand-muted flex-1 truncate">{t('aiImageLoaded') || 'Image loaded'}</span>
                 <button
                   onClick={() => { setSelectedImage(null); setMode('chat'); }}
                   className="text-brand-text-tertiary hover:text-brand-dark"
                   aria-label="Remove uploaded image"
                 >
                   <X size={14}/>
                 </button>
               </div>
             )}
             <div className="flex gap-2">
               <input
                 type="text"
                 value={input}
                 onChange={e => setInput(e.target.value)}
                 onKeyDown={e => e.key === 'Enter' && handleSend()}
                 placeholder={mode === 'think' ? (t('aiAskComplex') || "Ask a complex question...") : (t('aiTypeMessage') || "Type a message...")}
                 className="flex-1 bg-white border border-brand-border rounded-lg px-3 py-2 text-sm text-brand-dark focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20"
                 aria-label={t('aiTypeMessage') || "Type a message"}
               />
               <button
                 onClick={handleSend}
                 className={`p-2 rounded-lg transition-colors text-white ${
                   mode === 'think' ? 'bg-brand-info hover:bg-blue-700' :
                   mode === 'vision' ? 'bg-brand-accent hover:bg-orange-600' :
                   'bg-brand-primary hover:bg-brand-primary-dark'
                 }`}
                 aria-label="Send message"
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
