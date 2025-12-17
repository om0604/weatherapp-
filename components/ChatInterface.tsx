'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, CloudRain, Sparkles, ArrowUp } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type Message = {
    role: 'user' | 'assistant';
    content: string;
};

const COLLEGE_ROLL_NUMBER = "2024510008";

export default function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([
        // Empty initial state
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [userMsg],
                    runId: "weatherAgent",
                    maxRetries: 2,
                    maxSteps: 5,
                    temperature: 0.5,
                    topP: 1,
                    runtimeContext: {},
                    threadId: COLLEGE_ROLL_NUMBER,
                    resourceId: "weatherAgent"
                })
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }

            if (!response.body) throw new Error("No response body");

            setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let done = false;

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                const chunkValue = decoder.decode(value, { stream: true });

                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMsg = newMessages[newMessages.length - 1];
                    if (lastMsg && lastMsg.role === 'assistant') {
                        newMessages[newMessages.length - 1] = {
                            ...lastMsg,
                            content: lastMsg.content + chunkValue
                        };
                    }
                    return newMessages;
                });
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setError("Failed to connect to the weather agent. Please try again.");
            setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last && last.role === 'assistant' && last.content === '') {
                    return prev.slice(0, -1);
                }
                return prev;
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setInput(suggestion);
        // We could auto-submit here, but usually filling input is safer UX
    };

    return (
        <div className="flex flex-col h-screen bg-white text-zinc-900 font-sans relative overflow-hidden selection:bg-zinc-100">
            {/* Header */}
            <header className="flex-none px-6 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-20 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">
                        <CloudRain size={16} strokeWidth={2.5} />
                    </div>
                    <span className="font-semibold text-sm tracking-tight">Weather Agent</span>
                </div>
                <button className="text-zinc-500 hover:text-black transition-colors">
                    {/* Share icon or Menu could go here, keeping clean for now */}
                </button>
            </header>

            {/* Messages Area */}
            <main className="flex-1 overflow-y-auto w-full scroll-smooth" ref={scrollContainerRef}>
                <div className="max-w-2xl mx-auto px-4 py-8 min-h-full flex flex-col">

                    {messages.length === 0 ? (
                        /* Empty State */
                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-10 py-10 animate-in fade-in duration-500">
                            <div className="space-y-4 max-w-lg">
                                <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">
                                    What can I help you with?
                                </h2>
                            </div>

                            <div className="grid gap-2 w-full max-w-md">
                                {["Current weather in Mumbai", "Forecast for Pune this weekend", "Is it raining in Delhi?"].map((suggestion, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className="px-4 py-3 bg-zinc-50 hover:bg-zinc-100 rounded-xl text-sm text-left text-zinc-600 transition-colors flex items-center justify-between group"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* Message List */
                        <div className="space-y-8 flex-1 pb-20">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={cn(
                                        "flex flex-col gap-2",
                                        msg.role === 'user' ? "items-end" : "items-start"
                                    )}
                                >
                                    {/* Message Content */}
                                    <div className={cn(
                                        "max-w-[85%] sm:max-w-[80%] text-[15px] leading-7",
                                        msg.role === 'user'
                                            ? "bg-zinc-100 px-5 py-3 rounded-2xl text-zinc-800 font-medium"
                                            : "bg-transparent px-0 py-0 text-zinc-900 prose prose-zinc prose-p:leading-7 prose-headings:font-semibold max-w-none"
                                    )}>
                                        {msg.role === 'user' ? (
                                            msg.content
                                        ) : (
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {msg.content}
                                            </ReactMarkdown>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Loading Indicator */}
                            {isLoading && (
                                <div className="flex items-center gap-2 text-zinc-400 animate-pulse">
                                    <div className="w-2 h-2 bg-zinc-300 rounded-full" />
                                    <div className="w-2 h-2 bg-zinc-300 rounded-full animation-delay-150" />
                                    <div className="w-2 h-2 bg-zinc-300 rounded-full animation-delay-300" />
                                </div>
                            )}
                            <div ref={messagesEndRef} className="h-px" />
                        </div>
                    )}
                </div>
            </main>

            {/* Input Area */}
            <footer className="flex-none p-4 sm:p-6 bg-gradient-to-t from-white via-white to-transparent sticky bottom-0 z-20">
                <div className="max-w-2xl mx-auto">
                    <form
                        onSubmit={handleSubmit}
                        className="relative flex items-center gap-2 bg-white p-2 rounded-3xl border border-zinc-200 shadow-lg shadow-zinc-200/50 focus-within:ring-2 focus-within:ring-zinc-900/5 transition-shadow"
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Message Weather Agent..."
                            disabled={isLoading}
                            className="flex-1 bg-transparent px-4 py-2 outline-none text-zinc-900 placeholder:text-zinc-400 text-base"
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="flex-none w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                        >
                            <ArrowUp size={20} className={cn("transition-transform", input.trim() ? "opacity-100" : "opacity-50")} />
                        </button>
                    </form>
                </div>
            </footer>
        </div>
    );
}
