
import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { startChat, sendMessageToChat } from '../services/geminiService';
import type { ChatMessage } from '../types';
import type { Chat } from '@google/genai';
import { DefaultAvatarIcon, BotMessageSquareIconClean, TrashIcon } from '../components/common/icons';

const ChatView: React.FC = () => {
    const { profile, strings } = useAppContext();
    
    const getInitialMessages = (): ChatMessage[] => [
        { role: 'model', text: strings.chatWelcome }
    ];

    const [messages, setMessages] = useState<ChatMessage[]>(getInitialMessages());
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initialize chat session on component mount with the starting message.
        chatRef.current = startChat(messages);
    }, []); // Empty dependency array ensures this runs only once.

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        if (!chatRef.current) {
            // If the chat session was lost, re-initialize it with the current message history.
            chatRef.current = startChat(messages);
        }

        const responseText = await sendMessageToChat(chatRef.current!, userMessage.text);
        const modelMessage: ChatMessage = { role: 'model', text: responseText };
        
        setMessages(prev => [...prev, modelMessage]);
        setIsLoading(false);
    };
    
    const handleClearChat = () => {
        const initialMessages = getInitialMessages();
        setMessages(initialMessages);
        // Start a completely new chat session with only the initial welcome message.
        chatRef.current = startChat(initialMessages);
    }

    return (
        <section className="flex flex-col h-full bg-[var(--color-card)] rounded-2xl shadow-xl">
            <header className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
                <h2 className="text-xl font-bold text-[var(--color-text-primary)]">{strings.chatMainHeader}</h2>
                <button 
                    onClick={handleClearChat}
                    className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-red-600 transition-colors px-3 py-1 rounded-lg hover:bg-red-500/10"
                    title={strings.btnClearChat}
                >
                    <TrashIcon />
                    <span className="hidden sm:inline">{strings.btnClearChat}</span>
                </button>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scroll bg-[var(--color-background)]">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role === 'model' && (
                            <div className="w-8 h-8 rounded-full bg-[var(--color-card)] border border-[var(--color-border)] flex items-center justify-center flex-shrink-0">
                                <BotMessageSquareIconClean />
                            </div>
                        )}
                        <div className={`max-w-md p-3 rounded-2xl ${msg.role === 'user' ? 'bg-[var(--color-primary)] text-white rounded-br-none' : 'bg-[var(--color-card)] text-[var(--color-text-primary)] rounded-bl-none'}`}>
                           <p className="text-sm">{msg.text}</p>
                        </div>
                         {msg.role === 'user' && (
                             <div className="w-8 h-8 rounded-full flex-shrink-0">
                                {profile.photoUrl ? (
                                    <img src={profile.photoUrl} alt="User" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <DefaultAvatarIcon className="w-full h-full" />
                                )}
                            </div>
                        )}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-[var(--color-card)] border border-[var(--color-border)] flex items-center justify-center flex-shrink-0">
                            <BotMessageSquareIconClean />
                        </div>
                        <div className="max-w-md p-3 rounded-2xl bg-[var(--color-card)] text-[var(--color-text-primary)] rounded-bl-none flex items-center">
                           <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                           <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s] mx-1"></div>
                           <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-card)] rounded-b-2xl">
                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={strings.chatInputPlaceholder}
                        className="flex-1 p-3 border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-transparent"
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading || !input.trim()} className="p-3 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-hover)] disabled:bg-gray-300 dark:disabled:bg-gray-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </button>
                </form>
            </div>
        </section>
    );
};

export default ChatView;
