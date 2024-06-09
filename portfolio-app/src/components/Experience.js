// src/components/Experience.js
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

function Experience() {

    useEffect(() => {
        AOS.init();
    }, []);

    return (
        <div className='relative p-8 ' >
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white" data-aos="fade-right">Experience</h2>
            <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" data-aos="fade-right" />
            <ol className="relative border-s border-gray-200 dark:border-gray-700" >
                <li className="mb-10 ms-6">
                    <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                        <svg className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                        </svg>
                    </span>
                    <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white" data-aos="fade-right">Advanced Sterilization Products (Software Engineer Intern) <span className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 ms-3">Current</span></h3>
                    <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500" data-aos="fade-right">Sepetember 2023</time>
                    <ul class="space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
                        <li data-aos="fade-right">
                            Developed Python based application for hardware and software validation for ASP Access Technology
                        </li>
                        <li data-aos="fade-right">
                            Developing a chatbot leveraging Azure OpenAI and Cognitive Search to deliver customized responses based on company-specific data
                        </li>
                    </ul>
                </li>
                <li className="mb-10 ms-6" >
                    <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                        <svg className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                        </svg>
                    </span>
                    <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white" data-aos="fade-right">EdPlus (Software Developer Assistant)</h3>
                    <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500" data-aos="fade-right">August 2022</time>
                    <ul class="space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
                        <li data-aos="fade-right">
                        Developed automated processes on AWS Serverless Framework, facilitating email reminders, file processing, and API development
                        </li>
                        <li data-aos="fade-right">
                        Led the development of two virtual reality software applications using Dream Scape Learn SDK and Unity.
                        </li>
                        <li data-aos="fade-right">
                        Streamlined project workflow in collaboration with the development team, ensuring timely delivery of software
                        </li>
                    </ul>
                 </li>
                <li className="ms-6">
                    <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                        <svg className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                        </svg>
                    </span>
                    <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white" data-aos="fade-right">HHAeXchange (Software Engineer)</h3>
                    <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500" data-aos="fade-right">December 2020</time>
                    <ul class="space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
                        <li data-aos="fade-right">
                        Optimized kafka event processing pipeline, resulting in 30% faster processing and 15% lower server costs
                        </li>
                        <li data-aos="fade-right">
                        Led a team of 4 for deploying an application that processed over 10k files per day, leveraging .Net Core and C#
                        </li>
                        <li data-aos="fade-right">
                        Partitioned a SQL database into multiple databases using events-based publisher-subscriber architecture
                        </li>
                        <li data-aos="fade-right">
                        Revamped Angular cash payment module for 35% efficiency boost and better UX
                        </li>
                        <li data-aos="fade-right">
                        Expertly integrated advanced security features leveraging AWS Secrets Manager Services and AWS Cloud Watch Logging Service with Structured logging in .Net Core
                        </li>
                    </ul>
                       </li>
            </ol>



        </div>

    );
}

export default Experience;
