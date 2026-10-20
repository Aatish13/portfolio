import { CreateMLCEngine } from "@mlc-ai/web-llm";

// Singleton engine instance across the application
let mlcEngine = null;
let engineInitPromise = null;
const SELECTED_MODEL = "SmolLM2-360M-Instruct-q4f16_1-MLC";

class ChatService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.selectedModel = SELECTED_MODEL;
    }

    hasWebGPUSupport() {
        return typeof navigator !== "undefined" && Boolean(navigator.gpu);
    }

    async getEngine(setReplyText) {
        if (mlcEngine) {
            return mlcEngine;
        }

        if (engineInitPromise) {
            return await engineInitPromise;
        }

        if (!this.hasWebGPUSupport()) {
            throw new Error("WebGPU is not supported in this browser.");
        }

        engineInitPromise = (async () => {
            const engine = await CreateMLCEngine(this.selectedModel, {
                initProgressCallback: (report) => {
                    if (setReplyText && report?.text) {
                        const percent = Math.round((report.progress || 0) * 100);
                        setReplyText(`🧠 Loading in-browser AI (${percent}%)...`);
                    }
                }
            });
            mlcEngine = engine;
            return engine;
        })();

        try {
            return await engineInitPromise;
        } catch (err) {
            engineInitPromise = null;
            throw err;
        }
    }

    getFallbackReply(data) {
        const lastMsg = [...(data?.messages || [])].reverse().find(m => m.role === 'user');
        const rawQuery = lastMsg ? lastMsg.content : '';
        const query = rawQuery.toLowerCase();

        if (query.includes('skill') || query.includes('tech stack') || query.includes('language') || query.includes('framework')) {
            return "Aatish's core technical skills include Python, Java, C#, TypeScript, JavaScript, SQL, AWS, Azure, Docker, Kubernetes, Microservices, React, Node.js, and Agentic AI/LLM architectures.";
        }
        if (query.includes('amazon') || query.includes('work') || query.includes('experience') || query.includes('job') || query.includes('role')) {
            return "Aatish is a Software Development Engineer II at Amazon (promoted October 2026), having previously served as SDE I since December 2024. He also has engineering experience at ASP, EdPlus, and HHAeXchange.";
        }
        if (query.includes('project')) {
            return "Key projects include Stance Detection (BERT & Python), Edge Computing with distributed ML, Object Detection on AWS (Flask & EC2/SQS), and Augmented Reality applications using Unity.";
        }
        if (query.includes('education') || query.includes('degree') || query.includes('college') || query.includes('university') || query.includes('gpa') || query.includes('asu')) {
            return "Aatish holds a Master of Science in Computer Science & Engineering from Arizona State University (4.0/4.0 GPA) and a B.Tech from Dharmsinh Desai University (3.8/4.0 GPA).";
        }
        if (query.includes('contact') || query.includes('email') || query.includes('phone') || query.includes('reach') || query.includes('hire')) {
            return "You can reach Aatish by email at <a href='mailto:aatishchaudhari99@gmail.com'><u>aatishchaudhari99@gmail.com</u></a>, call (602) 388-5712, or connect via <a href='https://www.linkedin.com/in/aatish13' target='_blank'><u>LinkedIn</u></a>.";
        }
        if (query.includes('resume') || query.includes('cv') || query.includes('download')) {
            return "You can download Aatish's latest updated resume by clicking the 'Download Resume' button at the top of the page.";
        }
        if (query.includes('hi') || query.includes('hello') || query.includes('hey')) {
            return "Hello! I am Aatish's AI assistant. How can I help you today? Feel free to ask about his experience at Amazon, skills, or projects.";
        }
        return "Aatish is a Software Development Engineer II at Amazon specializing in distributed systems, AWS cloud architectures, and machine learning/LLM workflows. Feel free to explore his experience and projects on this site!";
    }

    async streamFallback(data, setReplyText) {
        const reply = this.getFallbackReply(data);
        const words = reply.split(" ");
        let current = "";
        for (let i = 0; i < words.length; i++) {
            current += (i === 0 ? "" : " ") + words[i];
            setReplyText(current);
            await new Promise(r => setTimeout(r, 20));
        }
        return reply;
    }

    async query(data, setReplyText) {
        // 1. Try In-Browser WebGPU LLM first
        if (this.hasWebGPUSupport()) {
            try {
                const engine = await this.getEngine(setReplyText);

                const messages = (data?.messages || []).map(m => ({
                    role: m.role === 'assistant' ? 'assistant' : m.role === 'system' ? 'system' : 'user',
                    content: m.content
                }));

                const stream = await engine.chat.completions.create({
                    messages: messages,
                    stream: true,
                    max_tokens: 250,
                    temperature: 0.6
                });

                let fullText = "";
                for await (const chunk of stream) {
                    const delta = chunk.choices[0]?.delta?.content || "";
                    fullText += delta;
                    setReplyText(fullText);
                }

                if (fullText.trim()) {
                    return fullText;
                }
            } catch (error) {
                console.warn("[WebLLM] Error running in-browser LLM. Falling back to local responder:", error);
            }
        }

        // 2. High-speed local fallback for browsers without WebGPU or upon load failure
        return await this.streamFallback(data, setReplyText);
    }
}

export default ChatService;
