
import React, { useEffect, useContext } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Context } from '../App';

const ProjectCard = ({ title, content, imageUrl, videoUrl, githubUrl }) => {

    const [messages, setMessages] = useContext(Context);
    useEffect(() => {
        AOS.init();

    }, []);
    function handleMouseLeave() {
        console.log('Mouse left');
        setMessages((prevMessages) => [...prevMessages,
        {
            "role": "user",
            "content": `I have scrolled through ${title} project. Thank me for it when i ask about projects and also suggest me to explore the more projects or I have any doubt.`
        }
        ]);
    }
    function handleReadMore() {
        console.log('Read more clicked');
        setMessages((prevMessages) => [...prevMessages,
        {
            "role": "user",
            "content": `I have clicked read more of ${title} project. Thank me for it when i ask about projects  and also suggest me to explore the more projects or I have any doubt.`
        }
        ]);
    }
    return (
        <div onMouseLeave={handleMouseLeave} className="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700" data-aos="zoom-in-right" data-aos-duration="1000">
            <a href={githubUrl} target="_blank" rel='noreferrer'  >
                <img className="rounded-t-lg" src={imageUrl} alt="" />
                {videoUrl && (
                    <video className="w-full rounded-t-lg" autoPlay muted controls>
                        <source src={videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                )}
            </a>
            <div className="p-5">
                <a href={githubUrl} target="_blank" rel='noreferrer'  >
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h5>
                </a>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{content}.</p>
                <a href={githubUrl} onClick={handleReadMore} target="_blank" rel='noreferrer' className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Read more
                    <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                    </svg>
                </a>
            </div>


        </div>
    );
};

export default ProjectCard;