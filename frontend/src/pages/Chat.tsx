import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  PlusCircle,
  BrainCircuit,
  Bot,
  User as UserIcon,
  Sparkles,
  Info
} from 'lucide-react';
import {
  Button,
  SourcesPill,
  BottomNav,
} from '../components';
import type { NavTab } from '../components';
import { sendChatMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import type { ChatMessageItem } from '../types';

interface MessageState {
  sender: 'user' | 'assistant';
  text: string;
  sources?: string[];
  timestamp: string;
}

export const ChatPage: React.FC = () => {
  const { healthProfile, homeLocation } = useAuth();
  const [city] = useState<string>(homeLocation || 'Pune');
  const [activeTab, setActiveTab] = useState<NavTab>('chat');
  const [inputMessage, setInputMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const [messages, setMessages] = useState<MessageState[]>([
    {
      sender: 'assistant',
      text: `Hello! I am your WHO/EPA grounded air quality health assistant for ${city}. How can I assist you with outdoor plans, asthma safety, or pollutant risks today?`,
      sources: ['WHO Global Air Quality Guidelines 2021', 'EPA AQI Technical Assistance Guidance'],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const userText = inputMessage.trim();
    if (!userText || loading) return;

    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: MessageState = { sender: 'user', text: userText, timestamp: timeNow };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      // Map to backend ChatMessageItem format
      const historyPayload: ChatMessageItem[] = messages.map((m) => ({
        role: m.sender,
        content: m.text,
      }));

      const res = await sendChatMessage(city, healthProfile, userText, historyPayload);

      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: res.response,
          sources: res.sources,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: `I encountered an issue processing your query: ${err.message || 'Server standby'}. Based on standard WHO guidelines for ${city}, limit prolonged exertion if AQI is elevated.`,
          sources: ['WHO Global Air Quality Guidelines 2021'],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([
      {
        sender: 'assistant',
        text: `New conversation started for ${city}. Ask me any medical or air quality safety question!`,
        sources: ['WHO Global Air Quality Guidelines 2021'],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-deepAtmosphere text-mistWhite pb-24 flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-[#0B1220]/90 backdrop-blur-md border-b border-slateInk/20 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-clearSky to-blue-600 flex items-center justify-center shadow-lg shadow-clearSky/20">
              <MessageSquare className="w-5 h-5 text-deepAtmosphere font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-lg text-mistWhite tracking-tight">
                  WHO / EPA Medical AI Assistant
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-clearSky/15 text-clearSky border border-clearSky/30">
                  RAG Active
                </span>
              </div>
              <p className="text-xs text-slateInk">Location: {city} • Health Profile: <span className="text-clearSky capitalize">{healthProfile}</span></p>
            </div>
          </div>

          <Button variant="secondary" size="sm" onClick={handleNewChat} leftIcon={<PlusCircle className="w-4 h-4" />}>
            New Chat
          </Button>
        </div>
      </header>

      {/* Main Conversation Body */}
      <main className="max-w-4xl w-full mx-auto px-4 py-6 flex-1 space-y-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                msg.sender === 'user'
                  ? 'bg-slateInk/20 border-slateInk/30 text-mistWhite'
                  : 'bg-clearSky/15 border-clearSky/30 text-clearSky'
              }`}
            >
              {msg.sender === 'user' ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble Container */}
            <div className={`max-w-[85%] sm:max-w-[75%] space-y-2`}>
              <div
                className={`p-4 rounded-2xl shadow-md backdrop-blur-sm ${
                  msg.sender === 'user'
                    ? 'bg-clearSky/20 border border-clearSky/30 text-mistWhite rounded-tr-none'
                    : 'bg-[#121E36] border border-slateInk/25 text-mistWhite rounded-tl-none'
                }`}
              >
                <p className="text-sm font-sans leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                {/* Citation Pills for Assistant */}
                {msg.sender === 'assistant' && msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slateInk/20">
                    <SourcesPill sources={msg.sources} />
                  </div>
                )}
              </div>

              <span className={`block text-[10px] font-mono text-slateInk ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-clearSky/15 border border-clearSky/30 text-clearSky flex items-center justify-center animate-spin">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-[#121E36] border border-clearSky/30 text-xs text-clearSky font-medium animate-pulse flex items-center gap-2">
              <BrainCircuit className="w-4 h-4" />
              Searching WHO & EPA Vector Index for grounded guidance...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Input Area with Medical Disclaimer */}
      <footer className="sticky bottom-16 z-30 bg-[#0B1220]/95 backdrop-blur-md border-t border-slateInk/20 px-4 py-3">
        <div className="max-w-4xl mx-auto space-y-2">
          {/* Medical Disclaimer Banner */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slateInk">
            <Info className="w-3.5 h-3.5 text-hazyAmber" />
            <span>AI advice is for informational purposes and is not a substitute for professional medical care.</span>
          </div>

          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="text"
              placeholder={`Ask a question about air quality in ${city}...`}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-2xl bg-[#131E32] border border-slateInk/30 text-sm text-mistWhite placeholder-slateInk focus:outline-none focus:border-clearSky disabled:opacity-50"
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={loading || !inputMessage.trim()}
              leftIcon={<Send className="w-4 h-4" />}
            >
              Send
            </Button>
          </form>
        </div>
      </footer>

      <BottomNav activeTab={activeTab} onTabChange={(t) => setActiveTab(t)} />
    </div>
  );
};
