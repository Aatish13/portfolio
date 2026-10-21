import { CreateMLCEngine } from "@mlc-ai/web-llm";

// Singleton engine instance across the application
let mlcEngine = null;
let engineInitPromise = null;
const SELECTED_MODEL = "SmolLM2-360M-Instruct-q4f16_1-MLC";

class ChatService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.selectedModel = SELECTED_MODEL;
        this.status = "idle"; // 'idle' | 'loading' | 'ready' | 'fallback'
        this.progress = 0;
        this.statusText = "";
        this.isWebGPU = this.hasWebGPUSupport();
        this.listeners = new Set();
    }

    hasWebGPUSupport() {
        return typeof navigator !== "undefined" && Boolean(navigator.gpu);
    }

    getStatus() {
        return {
            status: this.status,
            progress: this.progress,
            statusText: this.statusText,
            isWebGPU: this.isWebGPU,
            isEngineReady: Boolean(mlcEngine)
        };
    }

    subscribe(callback) {
        this.listeners.add(callback);
        // Immediately notify with current state
        callback(this.getStatus());
        return () => {
            this.listeners.delete(callback);
        };
    }

    notify() {
        const state = this.getStatus();
        this.listeners.forEach((cb) => {
            try {
                cb(state);
            } catch (err) {
                console.error("[ChatService] Listener error:", err);
            }
        });
    }

    // Auto-preload the model immediately on website load
    async preload() {
        if (mlcEngine) {
            this.status = "ready";
            this.progress = 100;
            this.statusText = "AI Model Ready";
            this.notify();
            return mlcEngine;
        }

        if (engineInitPromise) {
            return await engineInitPromise;
        }

        if (!this.hasWebGPUSupport()) {
            // WebGPU not available in this browser -> fallback mode ready immediately
            this.status = "ready";
            this.progress = 100;
            this.statusText = "Instant AI Ready";
            this.notify();
            return null;
        }

        this.status = "loading";
        this.progress = 0;
        this.statusText = "Starting in-browser AI download...";
        this.notify();

        engineInitPromise = (async () => {
            try {
                const engine = await CreateMLCEngine(this.selectedModel, {
                    initProgressCallback: (report) => {
                        const percent = Math.round((report.progress || 0) * 100);
                        this.progress = percent;
                        // Clean up technical tags like "[1/4]" for clean user display
                        const cleanText = (report?.text || "Loading model weights...")
                            .replace(/\[\d+\/\d+\]/g, "")
                            .trim();
                        this.statusText = cleanText || `Loading AI (${percent}%)...`;
                        this.notify();
                    }
                });

                mlcEngine = engine;
                this.status = "ready";
                this.progress = 100;
                this.statusText = "AI Model Ready";
                this.notify();
                return engine;
            } catch (err) {
                console.warn("[WebLLM] Error initializing in-browser LLM:", err);
                engineInitPromise = null;
                // Graceful fallback to fast local knowledge engine
                this.status = "ready";
                this.progress = 100;
                this.statusText = "Instant AI Ready (Fast Mode)";
                this.notify();
                return null;
            }
        })();

        return await engineInitPromise;
    }

    async getEngine(setReplyText) {
        if (mlcEngine) {
            return mlcEngine;
        }

        if (engineInitPromise) {
            return await engineInitPromise;
        }

        return await this.preload();
    }

    getFallbackReply(data) {
        const lastMsg = [...(data?.messages || [])].reverse().find(m => m.role === 'user');
        const rawQuery = lastMsg ? lastMsg.content : '';
        const query = rawQuery.toLowerCase();

        // 1a. Amazon – LLM Annotation Pipeline (specific, must be BEFORE general Amazon block)
        if (
            query.includes('llm annotation') ||
            (query.includes('annotation') && (query.includes('pipeline') || query.includes('labeling') || query.includes('amazon'))) ||
            (query.includes('human-in') && query.includes('loop')) ||
            query.includes('labeling latency') ||
            query.includes('label') && query.includes('3 weeks')
        ) {
            return "<strong>LLM Annotation Pipeline @ Amazon</strong><br/><br/>" +
                "Aatish designed and deployed an end-to-end <strong>LLM-assisted annotation pipeline with human-in-the-loop validation</strong>. Here's how it works:<br/><br/>" +
                "• <strong>The Problem:</strong> Manually labeling ground-truth training data was taking the team 3 full weeks per cycle — a massive bottleneck for model iteration.<br/>" +
                "• <strong>The Solution:</strong> He built an automated pipeline where an LLM pre-labels data with high confidence, then routes only ambiguous or low-confidence samples to human reviewers for validation.<br/>" +
                "• <strong>The Impact:</strong> Data labeling latency dropped from <strong>3 weeks → 2 days</strong> — a ~93% reduction — drastically accelerating model training and deployment cycles.<br/><br/>" +
                "This system is a core example of Aatish's expertise in <strong>Agentic AI workflows</strong>, combining LLM inference with human oversight at scale using AWS Lambda, DynamoDB, and Java microservices.";
        }

        // 1b. Amazon – Automated Sampling Module
        if (
            query.includes('sampling module') ||
            (query.includes('sampling') && (query.includes('aws') || query.includes('amazon') || query.includes('manual'))) ||
            (query.includes('manual') && query.includes('week') && query.includes('hours')) ||
            query.includes('curation') && query.includes('module')
        ) {
            return "<strong>Automated Sampling Module @ Amazon</strong><br/><br/>" +
                "Aatish architected an intelligent data sampling system that removed a critical manual bottleneck in the ML experimentation workflow:<br/><br/>" +
                "• <strong>Before:</strong> Data scientists had to manually curate training samples every cycle — a tedious process taking a full work week (~40 hours).<br/>" +
                "• <strong>After:</strong> Aatish's sampling module automatically selects statistically representative training samples via AWS workflows (Step Functions + Lambda), based on configurable strategies like stratified sampling and uncertainty-based selection.<br/>" +
                "• <strong>Impact:</strong> Manual effort collapsed from <strong>1 week → 4 hours</strong> per cycle, freeing engineers to focus on model architecture and experimentation instead of data wrangling.<br/><br/>" +
                "<strong>Tech used:</strong> AWS Step Functions, Lambda, DynamoDB, Python, SparkSQL.";
        }

        // 1c. Amazon – CI/CD & Release Pipeline Modernization
        if (
            (query.includes('ci/cd') || query.includes('ci cd') || query.includes('cicd')) ||
            (query.includes('release cycle') || query.includes('release pipeline') || query.includes('deploy') && query.includes('amazon')) ||
            (query.includes('week') && query.includes('3 days') && (query.includes('release') || query.includes('deploy'))) ||
            (query.includes('infrastructure') && query.includes('code') && query.includes('amazon')) ||
            query.includes('iac')
        ) {
            return "<strong>CI/CD & Infrastructure-as-Code Modernization @ Amazon</strong><br/><br/>" +
                "Aatish led the optimization of Amazon's global service deployment pipelines, a project that required both engineering depth and cross-team coordination:<br/><br/>" +
                "• <strong>The Problem:</strong> Global service releases were slow, manual, and error-prone — taking several weeks per cycle due to fragmented pipelines and inconsistent IaC across regions.<br/>" +
                "• <strong>What He Did:</strong> He refactored CI/CD pipeline configurations, standardized Infrastructure-as-Code (IaC) templates, and added automated validation gates to ensure consistent, safe deployments across all AWS regions.<br/>" +
                "• <strong>Result:</strong> Global release cycles shrunk from <strong>several weeks → under 3 days</strong> — making the team dramatically more agile and reducing production incident risk.<br/><br/>" +
                "This was complemented by executing <strong>zero-downtime regional migrations</strong> with 100% availability, demonstrating his ability to safely operate at high-stakes production scale.";
        }

        // 1d. Amazon – Deferrable Operators / Throughput / Cost
        if (
            query.includes('deferrable') ||
            (query.includes('throughput') && (query.includes('amazon') || query.includes('40%'))) ||
            (query.includes('cost') && (query.includes('20%') || query.includes('idle') || query.includes('compute'))) ||
            (query.includes('lambda polling') || (query.includes('polling') && query.includes('amazon'))) ||
            (query.includes('asynchronous') && query.includes('amazon')) ||
            query.includes('concurrency') && query.includes('amazon')
        ) {
            return "<strong>Throughput & Cost Optimization via Deferrable Operators @ Amazon</strong><br/><br/>" +
                "Aatish identified and fixed a fundamental inefficiency in how Amazon's pipeline workers handled asynchronous tasks:<br/><br/>" +
                "• <strong>The Problem:</strong> Services were using <strong>synchronous Lambda polling</strong> to wait for long-running job completions — wasting compute cycles, throttling concurrency, and running up unnecessary costs during idle wait time.<br/>" +
                "• <strong>The Fix:</strong> He replaced polling with <strong>event-driven deferrable operators</strong> — workers release compute resources while waiting for a job to complete, then are re-invoked on completion via event triggers.<br/>" +
                "• <strong>Results:</strong><br/>" +
                "  – Throughput boosted by <strong>40%</strong><br/>" +
                "  – Compute costs reduced by <strong>20%</strong> by eliminating idle resource waste<br/>" +
                "  – System concurrency significantly increased<br/><br/>" +
                "This is a canonical <strong>async microservices pattern</strong> applied at production scale on AWS.";
        }

        // 1e. Amazon – Tech Stack Details
        if (
            (query.includes('tech') || query.includes('stack') || query.includes('tool')) &&
            (query.includes('amazon') || query.includes('sde') || query.includes('aws'))
        ) {
            return "<strong>Aatish's Tech Stack @ Amazon</strong><br/><br/>" +
                "As an SDE II at Amazon, Aatish works across a diverse set of AWS and JVM-based technologies:<br/><br/>" +
                "• <strong>AWS Services:</strong> Lambda (serverless compute), DynamoDB (NoSQL), SQS (message queuing), S3 (object storage), CloudWatch (monitoring & alerting), Step Functions (workflow orchestration)<br/>" +
                "• <strong>Programming Languages:</strong> Java (primary — microservices & pipelines), Python (ML tooling, data processing, scripts)<br/>" +
                "• <strong>Data & Analytics:</strong> SparkSQL (large-scale distributed data processing)<br/>" +
                "• <strong>Architecture Patterns:</strong> Event-driven microservices, async execution via deferrable operators, human-in-the-loop ML workflows, Infrastructure-as-Code (IaC)<br/>" +
                "• <strong>DevOps:</strong> CI/CD pipelines, zero-downtime blue-green deployments, multi-region infrastructure management<br/><br/>" +
                "His background also includes Kafka, .NET Core, React, Node.js, Docker, and Kubernetes from previous roles.";
        }

        // 1. Amazon – General Overview (catches broad Amazon / role questions)
        if (
            query.includes('amazon') ||
            query.includes('sde ii') ||
            query.includes('sde 2') ||
            query.includes('sde 1') ||
            query.includes('sde i') ||
            query.includes('current role') ||
            query.includes('current job') ||
            query.includes('promotion') ||
            query.includes('promoted')
        ) {
            return "At <strong>Amazon</strong>, Aatish serves as a <strong>Software Development Engineer II (SDE II)</strong> in Seattle, WA (promoted October 2026, previously SDE I from Dec 2024 to Oct 2026).<br/><br/>" +
                "<strong>Key Architectural Achievements:</strong><br/>" +
                "• <strong>LLM Annotation Pipeline:</strong> Cut data labeling latency from 3 weeks → 2 days using an LLM + human-in-the-loop pipeline.<br/>" +
                "• <strong>Automated Sampling Module:</strong> Reduced manual curation from 1 week → 4 hours via AWS workflow automation.<br/>" +
                "• <strong>Throughput & Cost:</strong> Replaced Lambda polling with deferrable operators — 40% throughput boost, 20% cost reduction.<br/>" +
                "• <strong>Zero-Downtime Migrations:</strong> Orchestrated regional migrations with 100% uptime.<br/>" +
                "• <strong>CI/CD Modernization:</strong> Global release cycles from weeks → under 3 days.<br/><br/>" +
                "<em>💡 Ask me about any specific achievement above for a deep-dive explanation!</em>";
        }

        // 2. Specific Experience: Advanced Sterilization Products (ASP)
        if (query.includes('asp') || query.includes('sterilization') || query.includes('predictive maintenance')) {
            return "At <strong>Advanced Sterilization Products (ASP)</strong> in Irvine, CA (July 2023 - Dec 2024), Aatish was a Software Engineer and Intern focusing on Machine Learning and IoT:<br/><br/>" +
                "• Built predictive maintenance machine learning solutions in Python to forecast hardware failures, preventing critical medical device downtime.<br/>" +
                "• Collaborated with a 10-person cross-functional engineering team to develop AWS IoT telemetry pipelines for real-time sensor analytics and automated validation.";
        }

        // 3. Specific Experience: EdPlus at ASU (VR / Serverless)
        if (query.includes('edplus') || query.includes('dreamscape') || query.includes('virtual reality') || query.includes('vr')) {
            return "At <strong>EdPlus at Arizona State University</strong> (Aug 2022 - Oct 2023), Aatish worked as a Software Developer Assistant:<br/><br/>" +
                "• Architected serverless backend workflows on AWS Serverless Framework (C#, Node.js, Python) for automated scheduling, notification pipelines, and APIs.<br/>" +
                "• Led the development of two immersive virtual reality (VR) biology simulation applications using Unity3D and Dreamscape Learn SDK, utilized by thousands of university students.";
        }

        // 4. Specific Experience: HHAeXchange
        if (query.includes('hhaexchange') || query.includes('hha') || query.includes('kafka') || query.includes('dotnet') || query.includes('.net') || query.includes('pub-sub') || query.includes('pubsub')) {
            return "At <strong>HHAeXchange</strong> (Dec 2020 - July 2022), Aatish worked as a Software Engineer specializing in distributed event architectures:<br/><br/>" +
                "• Optimized the Apache Kafka event streaming pipeline, achieving <strong>30% faster processing</strong> and a <strong>15% server cost reduction</strong>.<br/>" +
                "• Led an engineering squad of 4 deploying .NET Core microservices processing 10,000+ healthcare files daily.<br/>" +
                "• Partitioned a monolithic SQL database into an event-driven publisher-subscriber architecture and revamped payment modules for a 35% efficiency boost.";
        }

        // 5. Work Experience Overview
        if (query.includes('experience') || query.includes('work') || query.includes('job') || query.includes('career') || query.includes('history')) {
            return "Aatish has progressive engineering experience across industry-leading tech companies:<br/><br/>" +
                "1. <strong>Amazon (SDE II, Seattle WA | Oct 2026 - Present):</strong> Promoted from SDE I (Dec 2024 - Oct 2026). Specializes in distributed systems, LLM pipelines, serverless architectures, and high-throughput microservices.<br/>" +
                "2. <strong>Advanced Sterilization Products (Software Engineer | 2023 - 2024):</strong> Predictive maintenance ML & AWS IoT telemetry.<br/>" +
                "3. <strong>EdPlus at ASU (Software Developer Assistant | 2022 - 2023):</strong> AWS Serverless and Unity VR simulations.<br/>" +
                "4. <strong>HHAeXchange (Software Engineer | 2020 - 2022):</strong> Apache Kafka event pipelines, .NET Core microservices, and database partitioning.";
        }

        // 6. Specific Project: Stance Detection
        if (query.includes('stance') || query.includes('bert') || query.includes('climate') || query.includes('tweet')) {
            return "<strong>Stance Detection (BERT & Python):</strong><br/>" +
                "Aatish led an NLP engineering team to detect public stances on climate change from Twitter discourse. The system utilized fine-tuned BERT models and an interpretability visualizer that highlighted the exact words driving predictions to foster model transparency.<br/><br/>" +
                "🔗 Explore code: <a href='https://github.com/Aatish13/StanceDetection' target='_blank'><u>GitHub - StanceDetection</u></a>";
        }

        // 7. Specific Project: Edge Computing & Distributed ML
        if (query.includes('edge') || query.includes('mobile computing') || query.includes('parallel computing') || query.includes('distributed ml')) {
            return "<strong>Edge Computing with Distributed ML (Java, Python, TensorFlow, Flask):</strong><br/>" +
                "Designed a distributed edge computing system that partitioned neural network inference across nearby edge devices, slashing server latency by <strong>50%</strong> and enabling low-latency mobile digit recognition without centralized server bottlenecks.<br/><br/>" +
                "🔗 Explore code: <a href='https://github.com/Aatish13/Mobile_Computing_App' target='_blank'><u>GitHub - Mobile_Computing_App</u></a>";
        }

        // 8. Specific Project: Object Detection on AWS
        if (query.includes('object detection') || query.includes('sqs') || query.includes('ec2') || query.includes('auto-scale')) {
            return "<strong>Object Detection on AWS (AWS, Python, Flask, EC2, SQS, S3):</strong><br/>" +
                "Built an asynchronous object detection web service. A lightweight Flask web tier receives image uploads and queues jobs in AWS SQS, while worker nodes on Amazon EC2 dynamically scale in and out based on queue backlog.<br/><br/>" +
                "🔗 Explore code: <a href='https://github.com/Aatish13/AWS_Lambda_File_Processor' target='_blank'><u>GitHub - AWS Object Detection</u></a>";
        }

        // 9. Specific Project: Augmented Reality (AR/VR)
        if (query.includes('augmented reality') || query.includes('ar core') || query.includes('unity') || query.includes('treasure hunt')) {
            return "<strong>Augmented Reality and Use Cases (C#, Unity3D, ARCore):</strong><br/>" +
                "Devised interactive AR/VR experiences including interactive facial filters, live books, and a geo-anchored AR treasure hunt game. The deployment drove a <strong>40% boost in festival attendance</strong> and a 50% increase in user engagement.<br/><br/>" +
                "🎥 Watch demo: <a href='https://youtu.be/eyB2Hmcjt3Y' target='_blank'><u>YouTube Video Demo</u></a>";
        }

        // 10. Specific Project: Student Help AI Bot & RAG
        if (query.includes('student') || query.includes('bot') || query.includes('langchain') || query.includes('rag')) {
            return "<strong>Student Help AI Bot (LangChain, OpenAI, Python):</strong><br/>" +
                "Engineered a custom Retrieval-Augmented Generation (RAG) assistant that accurately parses syllabus, coursework, and custom university data to answer student inquiries in real time.<br/><br/>" +
                "🔗 Explore code: <a href='https://github.com/Aatish13/student-help-AI-bot' target='_blank'><u>GitHub - Student Help AI Bot</u></a>";
        }

        // 11. Projects Overview
        if (query.includes('project') || query.includes('portfolio') || query.includes('github repo') || query.includes('built') || query.includes('app')) {
            return "Aatish has engineered several high-impact machine learning and distributed systems projects:<br/><br/>" +
                "• <strong>Stance Detection (BERT & Python):</strong> Climate sentiment analysis with interpretability visualizer (<a href='https://github.com/Aatish13/StanceDetection' target='_blank'><u>GitHub</u></a>).<br/>" +
                "• <strong>Edge Computing (TensorFlow & Flask):</strong> Distributed neural inference achieving 50% latency reduction (<a href='https://github.com/Aatish13/Mobile_Computing_App' target='_blank'><u>GitHub</u></a>).<br/>" +
                "• <strong>AWS Object Detection:</strong> Auto-scaling EC2 inference worker fleet via SQS queues (<a href='https://github.com/Aatish13/AWS_Lambda_File_Processor' target='_blank'><u>GitHub</u></a>).<br/>" +
                "• <strong>Augmented Reality:</strong> Interactive AR applications using Unity3D & ARCore (<a href='https://youtu.be/eyB2Hmcjt3Y' target='_blank'><u>Demo Video</u></a>).<br/>" +
                "• <strong>Student Help AI Bot:</strong> LangChain & OpenAI RAG assistant (<a href='https://github.com/Aatish13/student-help-AI-bot' target='_blank'><u>GitHub</u></a>).<br/>" +
                "• <strong>CRM System:</strong> Small-business management with sales analytics in Django (<a href='https://github.com/Aatish13/CRM_software' target='_blank'><u>GitHub</u></a>).";
        }

        // 12. Technical Skills & Tech Stack
        if (
            query.includes('skill') ||
            query.includes('tech stack') ||
            query.includes('stack') ||
            query.includes('language') ||
            query.includes('framework') ||
            query.includes('python') ||
            query.includes('java') ||
            query.includes('c#') ||
            query.includes('aws') ||
            query.includes('cloud') ||
            query.includes('docker') ||
            query.includes('kubernetes') ||
            query.includes('react')
        ) {
            return "<strong>Aatish's Core Technical Skills:</strong><br/><br/>" +
                "• <strong>Languages:</strong> Python, Java, C#, TypeScript, JavaScript, SQL, C++, Matlab<br/>" +
                "• <strong>Cloud & DevOps:</strong> AWS (Lambda, DynamoDB, EC2, SQS, S3, CloudWatch, Secrets Manager, IoT), Azure, Docker, Kubernetes, CI/CD (Jenkins, GitHub Actions), Terraform, DataDog<br/>" +
                "• <strong>Frameworks & AI:</strong> React, Node.js, Express, .NET Core, Flask, Django, Apache Kafka, SparkSQL, PyTorch, TensorFlow, LangChain, WebLLM<br/>" +
                "• <strong>Databases:</strong> DynamoDB, PostgreSQL, MySQL, MongoDB, Redis<br/>" +
                "• <strong>Specialties:</strong> Distributed Systems, Agentic AI & LLMs, High-Throughput Microservices, Cloud Architecture";
        }

        // 13. Education & Degrees
        if (
            query.includes('education') ||
            query.includes('degree') ||
            query.includes('college') ||
            query.includes('university') ||
            query.includes('gpa') ||
            query.includes('asu') ||
            query.includes('arizona state') ||
            query.includes('ddu') ||
            query.includes('master') ||
            query.includes('bachelor')
        ) {
            return "<strong>Educational Background:</strong><br/><br/>" +
                "🎓 <strong>Master of Science in Computer Science & Engineering</strong><br/>" +
                "• <strong>Arizona State University</strong>, Tempe, AZ (August 2022 - May 2024)<br/>" +
                "• <strong>GPA: 4.0 / 4.0</strong><br/>" +
                "• <em>Coursework:</em> Cloud Computing, Distributed Database Systems, Computer Vision, Data Visualization.<br/><br/>" +
                "🎓 <strong>Bachelor of Technology in Computer Science & Engineering</strong><br/>" +
                "• <strong>Dharmsinh Desai University</strong>, India (July 2017 - May 2021)<br/>" +
                "• <strong>GPA: 3.8 / 4.0</strong><br/>" +
                "• <em>Coursework:</em> Data Structures & Algorithms, Big Data Analysis, Software Engineering.";
        }

        // 14. Contact, Hiring & Links
        if (
            query.includes('contact') ||
            query.includes('email') ||
            query.includes('phone') ||
            query.includes('reach') ||
            query.includes('hire') ||
            query.includes('interview') ||
            query.includes('linkedin') ||
            query.includes('github')
        ) {
            return "You can get in touch with Aatish directly via:<br/><br/>" +
                "• <strong>Email:</strong> <a href='mailto:aatishchaudhari99@gmail.com'><u>aatishchaudhari99@gmail.com</u></a> / <a href='mailto:aatish13@asu.edu'><u>aatish13@asu.edu</u></a><br/>" +
                "• <strong>Phone:</strong> (602) 388-5712<br/>" +
                "• <strong>LinkedIn:</strong> <a href='https://www.linkedin.com/in/aatish13' target='_blank'><u>linkedin.com/in/aatish13</u></a><br/>" +
                "• <strong>GitHub:</strong> <a href='https://github.com/Aatish13' target='_blank'><u>github.com/Aatish13</u></a><br/><br/>" +
                "He is always excited to discuss distributed systems, LLM infrastructure, and new engineering opportunities!";
        }

        // 15. Resume
        if (query.includes('resume') || query.includes('cv') || query.includes('download')) {
            return "You can download Aatish's latest updated resume directly by clicking the <strong>'Download Resume'</strong> button at the top of this website, or click <a href='https://github.com/Aatish13/portfolio' target='_blank'><u>here</u></a>.";
        }

        // 16. Location & Relocation
        if (query.includes('location') || query.includes('where') || query.includes('relocat') || query.includes('remote') || query.includes('seattle')) {
            return "Aatish is currently based in <strong>Seattle, WA</strong>, working at Amazon. He is open to remote roles as well as relocation across the United States.";
        }

        // 17. About / Personal / Hobbies
        if (query.includes('about') || query.includes('who is') || query.includes('hobb') || query.includes('marvel') || query.includes('interest')) {
            return "Aatish Chaudhari is a Software Development Engineer II at Amazon in Seattle, WA. He holds a 4.0 GPA Master's in Computer Science from Arizona State University. Beyond engineering distributed systems and AI models, he is a huge Marvel fan, enjoys outdoor exploration in the Pacific Northwest, and loves staying on the cutting edge of AI advancements!";
        }

        // 18. Greetings
        if (query.includes('hi') || query.includes('hello') || query.includes('hey') || query.includes('sup') || query.includes('help')) {
            return "Hello! I am Aatish's AI assistant. I'm running directly in your browser with knowledge about his engineering work at Amazon, past roles, projects, and skills. How can I help you today? You can ask about his Amazon SDE II achievements, projects like Stance Detection, or how to get in touch!";
        }

        // 19. Default informative response
        return "Aatish Chaudhari is a <strong>Software Development Engineer II (SDE II) at Amazon</strong> in Seattle, WA, specializing in distributed systems, AWS cloud architectures, and machine learning/LLM pipelines. He holds a Master's in Computer Science from Arizona State University (4.0 GPA).<br/><br/>Feel free to ask about his work at Amazon, past experience (ASP, EdPlus, HHAeXchange), projects (BERT Stance Detection, Edge Computing, AWS Object Detection), or technical skills!";
    }

    async streamFallback(data, setReplyText) {
        const reply = this.getFallbackReply(data);
        // Split by words or HTML tags to preserve HTML structure nicely
        const tokens = reply.split(/(<[^>]+>|[\s]+)/).filter(Boolean);
        let current = "";
        for (let i = 0; i < tokens.length; i++) {
            current += tokens[i];
            setReplyText(current);
            // Quick 15ms streaming effect for smooth instant response
            if (!tokens[i].startsWith("<")) {
                await new Promise(r => setTimeout(r, 15));
            }
        }
        return reply;
    }

    async query(data, setReplyText) {
        // 1. Try In-Browser WebGPU LLM first if engine is ready
        if (this.hasWebGPUSupport()) {
            try {
                // If engine is not yet ready, start/await it or use fallback if takes too long
                const engine = mlcEngine || (await this.getEngine(setReplyText));

                if (engine) {
                    const messages = (data?.messages || []).map(m => ({
                        role: m.role === 'assistant' ? 'assistant' : m.role === 'system' ? 'system' : 'user',
                        content: m.content
                    }));

                    const maxTokens = data?.max_tokens || 800;

                    const stream = await engine.chat.completions.create({
                        messages: messages,
                        stream: true,
                        max_tokens: maxTokens,
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
                }
            } catch (error) {
                console.warn("[WebLLM] Error running in-browser LLM. Falling back to local responder:", error);
            }
        }

        // 2. High-speed local fallback for browsers without WebGPU or while loading / upon error
        return await this.streamFallback(data, setReplyText);
    }
}

// Global shared singleton instance for the entire application
export const chatService = new ChatService(process.env.REACT_APP_HUGGINGFACE_API_KEY || "");
export default ChatService;
