// src/components/Experience.js
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './Experience.css';

function Experience() {

    useEffect(() => {
        AOS.init();
    }, []);

    return (

        <div id="experience" className='fade-up-right experience-section parallax experience-bg'>
            <div className=' container'>
                <h1>Experience</h1>
                <h2>Advanced Sterilization Products (Software Engineer Intern)</h2>
                <h3>Developed a Python-based application for hardware and software validation. Developing a chatbot leveraging Azure OpenAI and Cognitive Search to deliver customized responses based on company-specific data.</h3>

                <h2>EdPlus (Software Developer Assistant)</h2>
                <h3>Developed automated processes on AWS Serverless Framework, facilitating email reminders, file processing, and API development. Led the development of two virtual reality software applications using Dream Scape Learn SDK and Unity. Streamlined project workflow in collaboration with the development team, ensuring timely delivery of software.</h3>

                <h2>HHAeXchange (Software Engineer)</h2>
                <h3>Optimized a Kafka event processing pipeline, resulting in 30% faster processing and 15% lower server costs. Led a team of 4 for deploying an application that processed over 10k files per day, leveraging .Net Core and C#. Partitioned a SQL database into multiple databases using events-based publisher-subscriber architecture. Revamped an Angular cash payment module for 35% efficiency boost and better UX. Expertly integrated advanced security features leveraging AWS Secrets Manager Services and AWS Cloud Watch Logging Service with Structured logging in .Net Core.</h3>
            </div>
        </div>

    );
}

export default Experience;
