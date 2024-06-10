import React, { useState, useEffect, useContext } from 'react';
import ResumeString from '../assets/resume';
import { Context } from '../App';
function AISearchBox() {
    const [replytext, setReplyText] = useState('');
    const [messages, setMessages] = useContext(Context);
    const [requestText, setRequestText] = useState('');
    useEffect(() => {
        setReplyText("A passionate and experienced Software Engineer with expertise in Cloud Computing, Distributed Systems, Computer Vision, and Data Visualization. How can I help You today?");
    }, []);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (requestText.trim() !== '') {
            query(
                {
                    "model": "meta-llama/Meta-Llama-3-8B-Instruct",
                    "messages": [...messages,
                    { role: 'user', content: `Answer in 50 words.
                    Question:${requestText}` }],
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
                setMessages((prevMessages) => [...prevMessages,
                { role: 'user', content: requestText },
                { role: 'assistant', content: result }]);
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

            console.log(done, value);
            if (done) {
                break;
            }
            const chunk = decoder.decode(value, { stream: true });
            const events = chunk.split("\n\n");
            console.log(events)
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
                        await new Promise(resolve => setTimeout(resolve, 10));
                    }
                } catch (error) {
                    console.error("Error parsing event:", error);
                }
            }
        }

        return text;
    }

    const handleStartConversation = (e) => {
        e.preventDefault()
            query(
                {
                    "model": "meta-llama/Meta-Llama-3-8B-Instruct",
                    "messages": [...messages,
                    { role: 'user', content: `Answer in 50 words.

                    Question:Hi` }],
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
                setMessages((prevMessages) => [...prevMessages,
                { role: 'user', content: requestText },
                { role: 'assistant', content: result }]);
            }).catch((error) => {
                console.error("Error:", error);
            });
            setRequestText('');
        
    };
    return (
        <div>
            <div >

                <a  onClick={handleStartConversation}  className="inline-flex justify-between items-center py-1 px-1 pe-4 mb-7 text-sm text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800">
                    <span  className="text-xs bg-blue-600 rounded-full text-white px-4 py-1.5 me-3" type="button" data-drawer-target="drawer-right-example" data-drawer-show="drawer-right-example" data-drawer-placement="right" aria-controls="drawer-right-example">New</span> <span className="text-sm font-medium">New info AI Available check it out</span>
                    <svg className="w-2.5 h-2.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" strokelinecap="round" strokelinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                    </svg>
                </a>
            </div>
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Hello, I'm Aatish Dineshbhai Chaudhari</h1>
            <div className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-200" dangerouslySetInnerHTML={{ __html: replytext }}></div>
            <form className='pt-0 pb-8' onSubmit={handleSendMessage}>
                <label htmlFor="chat" className="sr-only">Your message</label>
                <div className="flex items-center px-3 py-2 rounded-lg transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105  ">
                    <input id="chat" rows="1" className="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Ask me anything about Aatish ..."
                        value={requestText}
                        onChange={(e) => setRequestText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(e)}>

                    </input>
                    <button type="submit" className="duration-300 inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600">
                        <svg className="w-5 h-5 rotate-90 rtl:-rotate-90" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                            <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
                        </svg>
                        <span className="sr-only">Send message</span>
                    </button>
                </div>
            </form>
        </div>

    );
}

export default AISearchBox;