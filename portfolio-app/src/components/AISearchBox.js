import React, { useState, useEffect, useContext } from 'react';
import { chatService } from '../services/ChatService';
import { Context } from '../App';

function AISearchBox() {
    const [replytext, setReplyText] = useState('');
    const [messages, setMessages] = useContext(Context);
    const [requestText, setRequestText] = useState('');
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [isSearching, setIsSearching] = useState(false);

    const placeholders = [
        "Ask me anything about Aatish ...",
        "What are Aatish's skills?",
        "What does Aatish do at Amazon?",
        "What projects has Aatish built?",
        "How can I contact Aatish?"
    ];

    useEffect(() => {
        setReplyText("Hello! I am Aatish's AI assistant. Ask me anything about his engineering work as an SDE II at Amazon, featured projects, technical skills, or background!");
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholders.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [placeholders.length]);

    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        const query = requestText.trim();
        if (!query || isSearching) return;

        setIsSearching(true);
        const data = {
            messages: [
                ...messages,
                { role: 'user', content: query }
            ],
            max_tokens: 600,
            stream: true
        };

        try {
            const result = await chatService.query(data, setReplyText);
            setMessages((prevMessages) => [
                ...prevMessages,
                { role: 'user', content: query },
                { role: 'assistant', content: result }
            ]);
        } catch (error) {
            console.error("Error in AI Search:", error);
        } finally {
            setIsSearching(false);
            setRequestText('');
        }
    };

    const handleStartConversation = async (e) => {
        if (e) e.preventDefault();
        if (isSearching) return;

        setIsSearching(true);
        const data = {
            messages: [
                ...messages,
                { role: 'user', content: "Hi" }
            ],
            max_tokens: 600,
            stream: true
        };

        try {
            const result = await chatService.query(data, setReplyText);
            setMessages((prevMessages) => [
                ...prevMessages,
                { role: 'user', content: "Hi" },
                { role: 'assistant', content: result }
            ]);
        } catch (error) {
            console.error("Error starting conversation:", error);
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div>
            <div>
                <button
                    type="button"
                    onClick={handleStartConversation}
                    className="inline-flex justify-between items-center py-1 px-1 pe-4 mb-7 text-sm text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                >
                    <span className="text-xs bg-blue-600 rounded-full text-white px-4 py-1.5 me-3 font-semibold">
                        New
                    </span>
                    <span className="text-sm font-medium">In-Browser AI Assistant • Ask anything</span>
                    <svg className="w-2.5 h-2.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                    </svg>
                </button>
            </div>

            <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                Hello, I'm Aatish
            </h1>

            <form className="pt-0 pb-6" onSubmit={handleSendMessage}>
                <label htmlFor="chat" className="sr-only">Your message</label>
                <div className="flex items-center px-3 py-2 rounded-lg transition ease-in-out delay-150 hover:-translate-y-0.5 max-w-2xl mx-auto">
                    <input
                        id="chat"
                        type="text"
                        className="block mx-2 p-3 w-full text-sm text-gray-900 bg-white rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white shadow-sm"
                        placeholder={placeholders[placeholderIndex]}
                        value={requestText}
                        onChange={(e) => setRequestText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(e)}
                    />
                    <button
                        type="submit"
                        disabled={!requestText.trim() || isSearching}
                        className="duration-300 inline-flex justify-center p-3 text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-sm transition-colors"
                        aria-label="Send message"
                    >
                        <svg className="w-4 h-4 rotate-90 rtl:-rotate-90" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                            <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
                        </svg>
                    </button>
                </div>
            </form>

            <div
                className="mb-8 text-base lg:text-lg font-normal text-gray-600 dark:text-gray-300 sm:px-12 lg:px-36 max-w-4xl mx-auto leading-relaxed chat-message"
                dangerouslySetInnerHTML={{ __html: replytext }}
            ></div>
        </div>
    );
}

export default AISearchBox;