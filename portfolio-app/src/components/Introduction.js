// src/components/Introduction.js
import React, { useEffect, useContext } from 'react';
import AOS from 'aos';

import 'aos/dist/aos.css';
import AatishResume from '../assets/pdfs/Aatish_Chaudhari_Resume_gmail.pdf';
import AISearchBox from './AISearchBox';
import { Context, InteractionContext } from '../App';
function Introduction() {
    const [messages, setMessages] = useContext(Context);
    const handleInteraction = useContext(InteractionContext);
    useEffect(() => {
        AOS.init();
    }, []);

    function handleDownloadResume() {
        setMessages((prevMessages) => [...prevMessages,
        {
            "role": "system",
            "content": `I have Downlaoded the resume. Thank me for it and also suggest me to explore the website.`
        }
        ]);
    }
    return (



        <section className="bg-white dark:bg-gray-900 bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern.svg')] dark:bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern-dark.svg')]">
            <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 z-10 relative" data-aos="fade-up">

                <AISearchBox></AISearchBox>
                <a href={AatishResume} rel='noreferrer' onClick={handleDownloadResume} onMouseEnter={() => handleInteraction('Just do it!', 'follower', 'happy')} target='_blank' className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-100 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"><svg className="w-3.5 h-3.5 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z" />
                    <path d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />

                </svg> Download Resume</a>
            </div>

            <div className="bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900 w-full h-full absolute top-0 left-0 z-0"></div>

        </section>

    );
}

export default Introduction;
