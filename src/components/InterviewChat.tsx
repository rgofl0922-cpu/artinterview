import React, { useState, useRef, useEffect } from "react";
import { Artist, Message } from "../types.ts";
import { Send, Sparkles, User, HelpCircle, Loader2 } from "lucide-react";

interface InterviewChatProps {
  artist: Artist;
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (content: string) => void;
}

export default function InterviewChat({ artist, messages, isLoading, onSendMessage }: InterviewChatProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput("");
  };

  const handleSuggestClick = (question: string) => {
    if (isLoading) return;
    onSendMessage(question);
  };

  return (
    <div className="flex flex-col h-full bg-white border-4 border-black shadow-brutalist overflow-hidden" id="interview-chat-container">
      {/* Chat Header */}
      <div className="p-4 border-b-4 border-black bg-brand-yellow flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center border-2 border-black font-black text-sm text-black shadow-brutalist-sm ${artist.avatarColor}`}>
            {artist.name.slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-black font-display text-base tracking-tight">{artist.name} 캐릭터봇</span>
              <span className="inline-flex items-center px-1.5 py-0.5 border border-black bg-white text-[9px] font-black uppercase text-black">
                인터뷰 모드
              </span>
            </div>
            <p className="text-xs font-bold text-red-600 uppercase font-mono tracking-wide">{artist.englishName} ({artist.years})</p>
          </div>
        </div>
      </div>

      {/* Messages Window with Artistic Dot Grid Pattern */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-grid-dots max-h-[500px] lg:max-h-none">
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"} animate-fade-in`}
            >
              {/* Avatar Icon */}
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center border-2 border-black text-xs font-black shadow-brutalist-sm ${
                isUser ? "bg-red-500 text-white" : artist.avatarColor
              }`}>
                {isUser ? <User className="w-4 h-4 text-white" /> : artist.name.slice(0, 1)}
              </div>

              {/* Message Bubble */}
              <div className={`flex flex-col max-w-[80%] ${isUser ? "items-end" : "items-start"}`}>
                <div className="text-[9px] font-mono font-bold text-black/60 mb-1 px-1">
                  {isUser ? "나" : artist.name} • {msg.timestamp}
                </div>
                <div className={`px-4 py-2.5 border-2 border-black shadow-brutalist-sm text-sm leading-relaxed whitespace-pre-wrap ${
                  isUser 
                    ? "bg-brand-yellow text-black font-bold" 
                    : "bg-brand-sand text-[#1a1a1a] italic font-serif"
                }`}>
                  {msg.content}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading / Typing indicator */}
        {isLoading && (
          <div className="flex items-start gap-2.5 animate-pulse">
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center border-2 border-black text-xs font-black ${artist.avatarColor}`}>
              {artist.name.slice(0, 1)}
            </div>
            <div className="flex flex-col items-start max-w-[80%]">
              <div className="text-[9px] font-mono font-bold text-black/50 mb-1 px-1">
                {artist.name}님이 답변을 생각하는 중...
              </div>
              <div className="px-4 py-3 border-2 border-black bg-brand-sand shadow-brutalist-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-black shrink-0" />
                <span className="text-xs text-black font-black uppercase tracking-wider">아이디어를 떠올리는 중이란다...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions Panel */}
      <div className="p-3 bg-white border-t-4 border-black">
        <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-black mb-2.5 px-1">
          <HelpCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>추천 질문 리스트 (클릭하면 바로 질문할 수 있어요!)</span>
        </div>
        <div className="flex flex-wrap gap-1.5 max-h-[100px] overflow-y-auto">
          {artist.suggestedQuestions.map((question, idx) => (
            <button
              key={idx}
              onClick={() => handleSuggestClick(question)}
              disabled={isLoading}
              className="text-xs text-left text-black bg-white hover:bg-brand-yellow border-2 border-black font-bold py-1.5 px-3 rounded-none shadow-brutalist-sm hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ✨ {question}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-3 bg-brand-sand border-t-4 border-black flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`${artist.name} 작가에게 무엇이든 물어보세요!`}
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 border-2 border-black bg-white text-sm focus:outline-none font-mono text-black placeholder:text-black/40 disabled:opacity-75"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="bg-black hover:bg-red-600 text-white px-5 py-2.5 text-sm font-black uppercase transition-all tracking-wider flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">질문하기</span>
        </button>
      </form>
    </div>
  );
}
