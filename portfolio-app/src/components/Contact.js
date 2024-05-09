// src/components/Projects.js

import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './Contact.css';

function Contact() {
    useEffect(() => {
        AOS.init();
    }, []);
  return (

<section id="contact" className="fade-up-right contact-section parallax contact-bg">

<div className='container'>
                    <h1>Contact Me</h1>
                    <h2>Email: <a href="mailto:aatish13@asu.edu">aatish13@asu.edu</a> | LinkedIn: <a href="https://linkedin.com/in/aatish13" target="_blank" rel="noopener noreferrer">linkedin.com/in/aatish13</a> | Github: <a href="https://github.com/aatish13" target="_blank" rel="noopener noreferrer">github.com/aatish13</a>. </h2> 
                    <h2>I'm always excited to discuss new opportunities and collaborate on interesting projects.</h2>
                </div>
                </section>
  );
}

export default Contact;
