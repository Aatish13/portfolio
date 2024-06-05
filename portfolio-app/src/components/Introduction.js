// src/components/Introduction.js
import React, { useState,useEffect } from 'react';
import AOS from 'aos';
import './Introduction.css';

import 'aos/dist/aos.css';
import AatishResume from '../assets/pdfs/Aatish_Chaudhari_Resume.pdf';
import DarkMode from './DarkMode';
import ChatBot from './chat_components/ChatBot';
import AISearchBox from './AISearchBox';
function Introduction() {

    const [replytext, setReplyText] = useState('');
    useEffect(() => {
        AOS.init();
        setReplyText("A passionate and experienced Software Engineer with expertise in Cloud Computing, Distributed Systems, Computer Vision, and Data Visualization.");
    }, []);

    return (



        <section className="bg-white dark:bg-gray-900 bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern.svg')] dark:bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern-dark.svg')]">
            <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 z-10 relative">
                <div>
                    
                <a href="#" className="inline-flex justify-between items-center py-1 px-1 pe-4 mb-7 text-sm text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800">
                    <span className="text-xs bg-blue-600 rounded-full text-white px-4 py-1.5 me-3" type="button" data-drawer-target="drawer-right-example" data-drawer-show="drawer-right-example" data-drawer-placement="right" aria-controls="drawer-right-example">New</span> <span className="text-sm font-medium">New info AI Available check it out</span>
                    <svg className="w-2.5 h-2.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" strokelinecap="round" strokelinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                    </svg>
                </a>
                </div>
                <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Hello, I'm Aatish Dineshbhai Chaudhari</h1>
                <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-200">{replytext}</p>
                
                <AISearchBox replyText={replytext} setReplyText={setReplyText}></AISearchBox>
                <a href={AatishResume} target='_blank' className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-100 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"><svg className="w-3.5 h-3.5 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z" />
                    <path d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
                
                </svg> Download Resume</a>
            </div>

            <div className="bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900 w-full h-full absolute top-0 left-0 z-0"></div>

        </section>

    );
}

export default Introduction;
