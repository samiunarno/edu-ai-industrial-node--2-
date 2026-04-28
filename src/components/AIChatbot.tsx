import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, Bot, User, Loader2, Sparkles, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../contexts/LanguageContext";
import { fetchApi } from "../lib/api";

interface AIChatbotProps {
  students: any[];
  feedbacks: any[];
}

export default function AIChatbot({ students, feedbacks }: AIChatbotProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: 'assistant', content: t.landing.chatbot.welcome }]);
    }
  }, [t.landing.chatbot.welcome]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const data = await fetchApi('/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: messages,
          userMessage: userMessage,
          students: students.map(s => ({ name: s.name, course: s.course, marks: s.marks })),
          feedbacks: feedbacks.map(f => ({ student: f.studentId?.name, course: f.course, insight: f.content }))
        })
      });

      setMessages(prev => [...prev, { role: 'assistant', content: data.text }]);
    } catch (error: any) {
      console.error("AI Chat error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Error: " + error.message }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        id="ai-chat-trigger"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-stone-900 text-white p-4 font-mono text-xs uppercase font-bold tracking-widest shadow-[4px_4px_0_0_#1c1917] hover:bg-stone-800 active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all z-50 border-2 border-stone-900 flex items-center gap-3 group"
      >
        <div className="relative flex items-center justify-center">
          <Terminal className="w-5 h-5 text-indigo-400 group-hover:animate-pulse" />
        </div>
        <span id="ai-chat-trigger-text">{t.landing.chatbot.trigger}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            id="ai-chat-window"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-24 right-8 w-[420px] max-w-[calc(100vw-64px)] h-[640px] max-h-[calc(100vh-140px)] bg-white border-2 border-stone-900 shadow-[8px_8px_0_0_#1c1917] flex flex-col z-50 font-sans"
          >
            {/* Header */}
            <div id="ai-chat-header" className="p-4 bg-stone-100 border-b-2 border-stone-900 flex items-center justify-between relative overflow-hidden">
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 border-2 border-stone-900 bg-white flex items-center justify-center">
                  <Terminal className="w-5 h-5 text-stone-900" />
                </div>
                <div>
                  <div className="font-sans font-black text-lg tracking-tighter uppercase mb-0.5 text-stone-900 leading-none">{t.landing.chatbot.title}</div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-indigo-600 font-bold flex items-center gap-1.5 leading-none">
                    <span className="w-1.5 h-1.5 bg-indigo-600 animate-pulse border border-indigo-800" />
                    {t.landing.chatbot.subtitle}
                  </div>
                </div>
              </div>
              <button 
                id="ai-chat-close-button"
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-stone-200 transition-colors relative z-10 border-2 border-transparent hover:border-stone-900"
              >
                <X className="w-5 h-5 text-stone-900" />
              </button>
            </div>

            {/* Messages */}
            <div id="ai-chat-messages-container" className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
              {messages.map((m, idx) => (
                <div key={idx} id={`ai-chat-message-row-${idx}`} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[88%] flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 flex items-center justify-center shrink-0 border-2 border-stone-900 ${m.role === 'user' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-900'}`}>
                      {m.role === 'user' ? <User className="w-4 h-4" /> : <Terminal className="w-4 h-4" />}
                    </div>
                    <div className={`p-4 text-sm leading-relaxed border-2 border-stone-900 font-medium ${m.role === 'user' ? 'bg-stone-900 text-stone-100' : 'bg-white text-stone-800'}`}>
                      {m.content}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div id="ai-chat-loading-indicator" className="flex justify-start">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-stone-100 border-2 border-stone-900 flex items-center justify-center shrink-0">
                      <Terminal className="w-4 h-4 text-stone-900 animate-bounce" />
                    </div>
                    <div className="bg-white border-2 border-stone-900 p-4 flex items-center gap-3">
                      <div className="flex gap-2">
                        <span className="w-2 h-2 bg-stone-900 animate-bounce [animation-delay:-0.3s] border border-stone-900"></span>
                        <span className="w-2 h-2 bg-stone-900 animate-bounce [animation-delay:-0.15s] border border-stone-900"></span>
                        <span className="w-2 h-2 bg-stone-900 animate-bounce border border-stone-900"></span>
                      </div>
                      <span className="font-mono text-[10px] font-bold text-stone-500 uppercase tracking-widest">{t.landing.chatbot.loading}</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Footer */}
            <div id="ai-chat-footer" className="p-4 border-t-2 border-stone-900 bg-stone-50">
              <div className="relative flex gap-2">
                <input 
                  id="ai-chat-input-field"
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={t.landing.chatbot.placeholder}
                  className="w-full px-4 py-3 bg-white border-2 border-stone-900 text-sm font-bold text-stone-900 focus:outline-none transition-colors placeholder:text-stone-400 placeholder:font-normal placeholder:font-sans"
                />
                <button 
                  id="ai-chat-send-button"
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="p-3 bg-stone-900 text-white border-2 border-stone-900 hover:bg-stone-800 disabled:opacity-50 transition-all active:translate-y-[2px] active:translate-x-[2px] shadow-[4px_4px_0_0_#1c1917] active:shadow-none disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 shrink-0"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center justify-center gap-4 mt-4">
                <div className="h-0.5 bg-stone-200 flex-1" />
                <p id="ai-chat-branding" className="font-mono text-[9px] text-stone-400 font-bold uppercase tracking-widest">
                   {t.landing.chatbot.branding}
                </p>
                <div className="h-0.5 bg-stone-200 flex-1" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
