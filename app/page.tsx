"use client";
import { useState, useEffect, useRef } from "react";
import { Send, Bot, User, Loader2, Minimize2, Maximize2 } from "lucide-react";

type Message = {
  role: "assistant" | "user";
  content: string;
  id: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [activeMessage, setActiveMessage] = useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() =>{
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input, 
      id: Date.now().toString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });
      if (!response.ok) throw new Error("Failed to fetch response");

      const data = await response.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
        id: (Date.now() + 1).toString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center  bg-gradient-to-br from-gray-950 via-black to-gray-950 text-gray-200 overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/5 via-transparent to-transparent">
        {/* Main Container */}
        <main className="relative min-h-screen flex flex-col items-center justify-denter p-4">
          {/* Title */}
          <h1 className="text-3xl font-bold mb-6">What can I help you with?</h1>
          {/* Chat Interface */}
          <div className= {`relative w-full max-w-5xl transition-all duration-500 ease-in-out ${
            isExpanded ? "h-[85vh]" : "h-[60vh]"
           }`}>
            {/* Glass Panel */}
            <div className="absolute inset-0 backdrop-blue-2xl bg-white/5 rounded-3xl border border-white/10 shadow-[0_0_100px_-15px] shadow-purple-500/20">
                {/* Header */}
                <div className="relative p-6 flex items-center justify-between border-b border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse"/>
                    <h1 className="text-xl font-light tracking-wider">
                      Quanti-Chat
                    </h1>
                  </div>
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    {isExpanded ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                  </button> 
                </div>
                {/* Messages Container - Added pb-20 for bottom padding an dchanged overflow behavior */}
                <div className="relative h-[calc(100%-8rem)] overflow-y-auto overscroll-contain p-6 pb-20 space-y-6">
                  {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full space-y-4 text-center">
                      <div className="text-4xl font-thin tracking-widest text-putple-300">
                        2050
                      </div>
                      <p className="text-gray-400 max-w-md">
                        Welcome to the quantum realm of conversation. your thoughts will be processed through advanced neural matrices. 
                      </p>
                    </div>
                  )}
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === "assistant" ? "justify-start" : "justify-end"
                      }`}
                      onMouseEnter={() => setActiveMessage(message.id)}
                      onMouseLeave={() => setActiveMessage(null)}
                    >
                      <div
                        className={`group relative max-w-[80%] mb-6 ${
                          message.role === "assistant" ? "pr-4" : "pl-4"
                        }`}>
                          <div 
                            className={`p-4 rounded-3xl transition-all duration-300 ${
                            activeMessage === message.id ? "scale-[1.02]" : "scale-100"} ${
                            message.role === "assistant" ? "bg-purple-500/10 hover:bg-purple-500/20 rounded-tl-sm"
                            : "bg-white/5 hover:bg-white/10 rounded-tr-sm"
                          }`}
                          >
                            {message.content}
                          </div> 
                          <div
                            className={`absolute -bottom-6 flex items-center gap-2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transiiton-opacity ${
                              message.role === "assistant" ? "left-0" : "right-0"}`}
                          >
                            <div
                              className="w-5 h-5 rounded-full flex items-center justify-center bg-white/5">
                                {message.role === "assistant" ? (
                                  <Bot size={12} />
                                ) : (
                                  <User size={12} />
                                )}
                            </div>
                              {new Date().toLocaleTimeString()}
                          </div>   
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                          <Loader2 size={14} className="animate-spin text-purple-500"/>
                        </div>
                        <div className="space-y-2">
                          <div className="h-1 w-24 bg-purple-500/10 rounded-full animate-pulse"/>
                          <div className="h-1 w-16 bg-purple-500/10 rounded-full animate-pulse"/>
                        </div>
                      </div>
                  ) }
                  <div ref={messagesEndRef} />
                </div>
                {/* Input Area - Added bg-blur effect and z-index */}
                <form
                  onSubmit={handleSubmit}
                  className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10 bg-gray-950/80 backdrop-blur-md z-10">
                    <div className="relative">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Enter your message..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 pr-12 focus:outline-none focus:ring-2  focus:ring-purple-500/50 placeholder:text-gray-500"
                      />
                      <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl hover:bg-white/5 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                      >
                        <Send size={20} />
                      </button>
                    </div>
                  </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
