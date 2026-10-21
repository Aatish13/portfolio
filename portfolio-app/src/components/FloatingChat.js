import React, { useState, useEffect, useRef, useCallback } from 'react';
import { chatService } from '../services/ChatService';

// -------------------------------------------------------
// Topic-aware follow-up suggestion engine.
// Detects the current topic from the last reply and returns
// 4 suggestions from DIFFERENT topic areas to encourage exploration.
// usedQuestions is a Set passed in so we never repeat a chip.
// -------------------------------------------------------

// Pool of questions grouped by topic area
const QUESTION_POOLS = {
    amazon_llm: [
        "How does the LLM annotation pipeline work in detail?",
        "What was the impact of cutting labeling time from 3 weeks to 2 days?",
        "What is Agentic AI and how did Aatish use it at Amazon?",
    ],
    amazon_infra: [
        "How did Aatish modernize CI/CD at Amazon?",
        "What are deferrable operators and how did they help at Amazon?",
        "How did he achieve zero-downtime regional migrations?",
        "What throughput and cost improvements did he drive?",
    ],
    amazon_general: [
        "Tell me about his Amazon SDE II role",
        "What was the LLM annotation pipeline he built?",
        "How did the automated sampling module save time?",
        "What deferrable operators did he implement?",
        "How did he cut CI/CD release cycles to 3 days?",
        "What is Aatish's tech stack at Amazon?",
    ],
    skills: [
        "What are Aatish's core technical skills?",
        "What AWS services has he worked with?",
        "What cloud certifications or expertise does he have?",
        "How has he used Python in production?",
        "What distributed systems patterns does he know?",
    ],
    projects: [
        "What projects has Aatish built?",
        "Tell me about the Stance Detection project",
        "Explain the Edge Computing project",
        "What was the Object Detection AWS project?",
        "Tell me about the Augmented Reality project",
        "What is the Student Help AI Bot?",
    ],
    experience: [
        "Tell me about his work at HHAeXchange",
        "What did he do at Advanced Sterilization Products?",
        "Tell me about his EdPlus / VR work",
        "What was his first engineering role?",
        "How did he get into distributed systems?",
    ],
    education: [
        "What is his educational background?",
        "What did he study at Arizona State University?",
        "How did his MS at ASU shape his career?",
        "What courses did he take at ASU?",
    ],
    contact: [
        "How can I contact Aatish?",
        "Is he open to new job opportunities?",
        "Is Aatish open to remote work?",
        "Where is Aatish located?",
    ],
    personal: [
        "Tell me something interesting about Aatish",
        "What motivates Aatish as an engineer?",
        "Is Aatish open to relocation?",
    ],
};

// Pick N questions from a pool, excluding already-used ones
function pickFrom(pool, n, used) {
    return (pool || []).filter(q => !used.has(q)).slice(0, n);
}

// Build a list of 4 suggestions from pools OTHER than the current topic
function buildSuggestions(currentTopics, used) {
    const allTopics = Object.keys(QUESTION_POOLS);
    // Pools to draw from: everything EXCEPT the current topic group(s)
    const otherTopics = allTopics.filter(t => !currentTopics.includes(t));

    const result = [];
    // Cycle through other topic pools in a stable order
    const order = ['projects', 'experience', 'skills', 'education', 'contact', 'personal',
        'amazon_general', 'amazon_llm', 'amazon_infra'];
    const drawFrom = order.filter(t => otherTopics.includes(t));

    for (const topic of drawFrom) {
        if (result.length >= 4) break;
        const picks = pickFrom(QUESTION_POOLS[topic], 1, used);
        result.push(...picks);
    }

    // If still short, pull from current topic pools as fallback (but still avoid used)
    if (result.length < 4) {
        for (const topic of currentTopics) {
            if (result.length >= 4) break;
            const picks = pickFrom(QUESTION_POOLS[topic], 4 - result.length, new Set([...used, ...result]));
            result.push(...picks);
        }
    }

    return result.slice(0, 4);
}

function getFollowUpSuggestions(lastReply = '', used = new Set()) {
    const text = lastReply.toLowerCase();

    // Detect current topic(s)
    const currentTopics = [];

    if (text.includes('llm annotation') || text.includes('annotation pipeline') || (text.includes('human-in') && text.includes('loop')) || text.includes('labeling latency')) {
        currentTopics.push('amazon_llm');
    }
    if (text.includes('deferrable') || text.includes('sampling module') || text.includes('ci/cd') || text.includes('release cycle') || text.includes('zero-downtime') || text.includes('throughput') && text.includes('amazon')) {
        currentTopics.push('amazon_infra');
    }
    if ((text.includes('amazon') || text.includes('sde ii')) && currentTopics.length === 0) {
        currentTopics.push('amazon_general');
    }
    if (text.includes('kafka') || text.includes('hhaexchange') || text.includes('edplus') || text.includes('sterilization') || text.includes('iot') || text.includes('unity') || text.includes('serverless')) {
        currentTopics.push('experience');
    }
    if (text.includes('stance') || text.includes('bert') || text.includes('edge computing') || text.includes('object detection') || text.includes('augmented reality') || text.includes('langchain') || text.includes('rag')) {
        currentTopics.push('projects');
    }
    if (text.includes('python') || text.includes('java') || text.includes('kubernetes') || text.includes('docker') || (text.includes('tech stack') && !text.includes('amazon'))) {
        currentTopics.push('skills');
    }
    if (text.includes('arizona state') || text.includes('asu') || text.includes('gpa') || text.includes('master') || text.includes('bachelor')) {
        currentTopics.push('education');
    }
    if (text.includes('email') || text.includes('linkedin') || text.includes('contact') || text.includes('reach')) {
        currentTopics.push('contact');
    }

    // Default if no topic matched
    if (currentTopics.length === 0) {
        currentTopics.push('amazon_general');
    }

    return buildSuggestions(currentTopics, used);
}


const FloatingChat = ({ messages, setMessages, isOpen, setIsOpen }) => {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [modelState, setModelState] = useState(() => chatService.getStatus());
    const [followUps, setFollowUps] = useState([]);
    const messagesEndRef = useRef(null);
    // Tracks every follow-up chip shown across the whole session to avoid repeats
    const usedQuestions = useRef(new Set());

    // Subscribe to AI model loading progress
    useEffect(() => {
        const unsubscribe = chatService.subscribe((state) => {
            setModelState(state);
        });
        return unsubscribe;
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen, isLoading]);

    const sendMessage = async (messageText) => {
        const trimmed = (messageText || input).trim();
        if (!trimmed || isLoading) return;

        const userMessage = { role: "user", content: trimmed };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            let latestReply = '';
            const setReplyText = (text) => {
                latestReply = text;
                setMessages([...newMessages, { role: "assistant", content: text }]);
            };

            await chatService.query({
                messages: newMessages,
                max_tokens: 800,
                stream: true
            }, setReplyText);

            // Generate follow-up suggestions from a DIFFERENT topic area
            if (latestReply) {
                const suggestions = getFollowUpSuggestions(latestReply, usedQuestions.current);
                // Record these as used so they won't appear again this session
                suggestions.forEach(q => usedQuestions.current.add(q));
                setFollowUps(suggestions);
            }

        } catch (error) {
            console.error("Chat error:", error);
            setMessages([...newMessages, { role: "assistant", content: "Sorry, I encountered an error while processing your request." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await sendMessage(input);
    };

    const handleQuickPrompt = useCallback((prompt) => {
        setFollowUps([]); // Clear old suggestions when a new message is sent
        sendMessage(prompt);
    }, [sendMessage]); // eslint-disable-line react-hooks/exhaustive-deps

    const visibleMessages = messages.filter(m => m.role === 'user' || m.role === 'assistant');
    const lastAssistantIdx = visibleMessages.reduce((last, m, i) => m.role === 'assistant' ? i : last, -1);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-80 sm:w-96 h-[480px] mb-4 flex flex-col border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 ease-in-out">
                    {/* Header */}
                    <div className="bg-blue-600 dark:bg-blue-700 p-3.5 flex justify-between items-center text-white shadow-sm">
                        <div className="flex items-center gap-2.5">
                            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                {modelState.status === 'ready' && (
                                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-blue-600 rounded-full"></span>
                                )}
                            </div>
                            <div>
                                <div className="font-bold text-sm leading-tight flex items-center gap-2">
                                    Aatish AI Assistant
                                </div>
                                <div className="text-[11px] text-blue-100 flex items-center gap-1.5">
                                    {modelState.status === 'loading' ? (
                                        <>
                                            <svg className="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Downloading model ({modelState.progress}%)</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                            <span>Online • In-Browser AI</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white/80 hover:text-white hover:bg-white/10 rounded-full p-1.5 transition-colors"
                            aria-label="Close chat"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>

                    {/* Progress Bar (Visible while downloading in-browser model) */}
                    {modelState.status === 'loading' && (
                        <div className="w-full bg-blue-900/30 h-1 overflow-hidden">
                            <div
                                className="bg-emerald-400 h-1 transition-all duration-300 ease-out"
                                style={{ width: `${Math.max(modelState.progress, 5)}%` }}
                            ></div>
                        </div>
                    )}

                    {/* Messages Body */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900 scroll-smooth">
                        {/* Empty State / Welcome Screen */}
                        {visibleMessages.length === 0 && (
                            <div className="flex flex-col gap-3 py-2">
                                {modelState.status === 'loading' ? (
                                    /* Loading state card */
                                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-blue-100 dark:border-gray-700 text-center">
                                        <div className="inline-flex p-3 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 mb-2">
                                            <svg className="animate-spin h-6 w-6 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        </div>
                                        <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                                            Loading In-Browser AI ({modelState.progress}%)
                                        </h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            Downloading lightweight model to your browser for fast, private inference. Cached for future visits!
                                        </p>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-3 overflow-hidden">
                                            <div
                                                className="bg-blue-600 dark:bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                                                style={{ width: `${Math.max(modelState.progress, 5)}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-2.5 font-medium">
                                            ⚡ Instant answers are active! Ask anything below.
                                        </p>
                                    </div>
                                ) : (
                                    /* Ready state card */
                                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                                        <div className="inline-flex p-2.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </div>
                                        <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                                            Welcome to Aatish's AI Assistant!
                                        </h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            Ask me anything about Aatish's work as an SDE II at Amazon, projects, tech stack, or background.
                                        </p>
                                    </div>
                                )}

                                {/* Quick prompt chips */}
                                <div className="space-y-1.5">
                                    <p className="text-[11px] uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500 px-1">
                                        Suggested Questions
                                    </p>
                                    <div className="flex flex-col gap-1.5">
                                        {[
                                            "Tell me about his Amazon SDE II role",
                                            "What are Aatish's core technical skills?",
                                            "Explain the Stance Detection project",
                                            "How can I get in touch with Aatish?"
                                        ].map((prompt, i) => (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => handleQuickPrompt(prompt)}
                                                className="text-left text-xs bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700/80 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors shadow-2xs"
                                            >
                                                💬 {prompt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Chat Messages */}
                        {visibleMessages.map((msg, idx) => (
                            <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <div
                                    className={`max-w-[88%] rounded-2xl p-3 text-sm leading-relaxed shadow-xs ${msg.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-br-xs'
                                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-bl-xs'
                                        } chat-message`}
                                    dangerouslySetInnerHTML={{ __html: msg.content }}
                                />

                                {/* Follow-up suggestion chips after the LAST assistant message */}
                                {msg.role === 'assistant' && idx === lastAssistantIdx && !isLoading && followUps.length > 0 && (
                                    <div className="mt-2 flex flex-col gap-1.5 w-full max-w-[92%] items-start">
                                        <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500">
                                            Follow-up
                                        </p>
                                        {followUps.map((q, qi) => (
                                            <button
                                                key={qi}
                                                type="button"
                                                onClick={() => handleQuickPrompt(q)}
                                                className="text-left text-[11px] bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-150 shadow-xs w-full"
                                            >
                                                ↩ {q}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Typing / Loading indicator */}
                        {isLoading && (
                            <div className="flex items-start">
                                <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-bl-xs px-3.5 py-2.5 text-xs text-gray-500 dark:text-gray-400 shadow-xs flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]"></span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]"></span>
                                    <span className="ms-1 text-[11px]">Thinking...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Form */}
                    <form onSubmit={handleSubmit} className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex gap-2 items-center">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={
                                    modelState.status === 'loading'
                                        ? `AI downloading (${modelState.progress}%)... Ask anything!`
                                        : "Ask about Amazon, skills, projects..."
                                }
                                className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-400"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-full p-2.5 transition-colors duration-200 flex items-center justify-center shadow-xs"
                                aria-label="Send message"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Toggle Button */}
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`${isOpen ? 'bg-gray-600 dark:bg-gray-700' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-full p-4 shadow-xl transition-all duration-300 flex items-center justify-center transform hover:scale-105 active:scale-95`}
                    aria-label="Toggle chat"
                    title={
                        modelState.status === 'loading'
                            ? `Downloading AI Model (${modelState.progress}%)...`
                            : "Chat with Aatish's AI Assistant"
                    }
                >
                    {isOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    )}
                </button>

                {/* Loading indicator icon / Badge when closed */}
                {!isOpen && (
                    modelState.status === 'loading' ? (
                        <span
                            className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center"
                            title={`Downloading AI Model: ${modelState.progress}%`}
                        >
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-5 w-5 bg-blue-600 text-white items-center justify-center border-2 border-white dark:border-gray-900 shadow-xs">
                                <svg className="animate-spin h-2.5 w-2.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </span>
                        </span>
                    ) : (
                        <span
                            className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5"
                            title="AI Assistant Ready"
                        >
                            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-gray-900 shadow-xs"></span>
                        </span>
                    )
                )}
            </div>
        </div>
    );
};

export default FloatingChat;
