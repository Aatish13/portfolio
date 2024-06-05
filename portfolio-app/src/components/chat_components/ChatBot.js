import React, { useState, useEffect} from 'react';
import aatishdp from '../../assets/images/AatishDP.png';
import userdp from '../../assets/images/UserDP.png';
import ChatBubbleReply from './ChatBubbleReply';
import ChatBubbleRequest from './ChatBubbleRequest';
import ResumeString from '../../assets/resume';
const ChatBot = () => {
    const [messages, setMessages] = useState([]);
    const [replytext, setReplyText] = useState('');
    const [requestText, setRequestText] = useState('');
    useEffect(() => {
        setReplyText("Hi, I am Aatish! ")
        setMessages([
            {
                "role": "system",
                "content": `You are a helpful and honest assistant how is representing Aatish Chaudhari a whose resume is this: ${ResumeString} 
                Please, represent as aatish concisely and truthfully and only answer in 50 words. 
                If there is more information ask user if they want to know more.
                Only reply with the information that is in the resume.`
            }
        ]);
    }, []);

    const handleSendMessage = (e) => {
        e.preventDefault();
        setMessages((prevMessages) => [...prevMessages, { role: 'user', content: requestText }]);
        if (requestText.trim() !== '') {
            query(
                {
                    "model": "meta-llama/Meta-Llama-3-8B-Instruct",
                    "messages": messages,
                    "parameters": {
                        "max_new_tokens": 1000,
                        "stop": [
                            "<|end_of_text|>",
                            "<|eot_id|>"
                        ]
                    },
                    "stream": true
                }

            ).then((result) => {
                setMessages((prevMessages) => [...prevMessages, { role: 'assistant', content: result }]);
            }).catch((error) => {
                console.error("Error:", error);
            });
            setRequestText('');
        }
    };

    async function query(data) {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct/v1/chat/completions",
            {
                headers: {
                    "Authorization": `Bearer ${process.env.REACT_APP_HUGGINGFACE_API_KEY}`,
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify(data),
            }
        );

        if (!response.body) {
            throw new Error("No response body found");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");

        let text = "";
        while (true) {
            const { done, value } = await reader.read();

            if (done) {
                break;
            }
            const chunk = decoder.decode(value, { stream: true });
            const events = chunk.split("\n\n");
            for (const event of events) {
                if (event.trim() === "") {
                    continue;
                }
                try {
                    const jsonString = event.startsWith("data: ") ? event.slice(6) : event;
                    const jsonEvent = JSON.parse(jsonString);
                    const content = jsonEvent.choices[0].delta.content;

                    if (content) {
                        text += content;

                        setReplyText(text);
                        // await new Promise(resolve => setTimeout(resolve, 50));
                    }
                } catch (error) {
                    console.error("Error parsing event:", error);
                }
            }
        }

        return text;
    }




    return (
        <div className='bg-gray-10 dark:bg-gray-500 rounded-lg '>
            {messages.map((message, index) => {
                if (message.role === "user") {
                    return (
                        <ChatBubbleRequest
                            key={index}
                            name="User"
                            content={message.content}
                            time={new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                            chat_dp={userdp}
                        />
                    );
                } else if (message.role === "assistant") {
                    return (
                        <ChatBubbleReply
                            key={index}
                            name="Aatish"
                            content={message.content}
                            time={new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                            chat_dp={aatishdp}
                        />
                    );
                } else {
                    return null;
                }
            })}
            <form onSubmit={handleSendMessage}>
                <label htmlFor="chat" className="sr-only">Your message</label>
                <div className="flex items-center px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <textarea id="chat" rows="1" className="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your message..." value={requestText} onChange={(e) => setRequestText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(e)}></textarea>
                    <button type="submit" className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600">
                        <svg className="w-5 h-5 rotate-90 rtl:-rotate-90" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                            <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
                        </svg>
                        <span className="sr-only">Send message</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatBot;