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


<footer className="bg-white dark:bg-gray-900 p-8">
<h2 className="text-3xl font-semibold text-gray-900 dark:text-white">Contact</h2>
 <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
<div className="flex mt-4 sm:justify-left sm:mt-0">
              <a href="mailto:aatish13@asu.edu" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
              <svg className="w-10 h-10" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
        <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z"/>
        <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z"/>
    </svg>
                  <span className="sr-only">Send Email</span>
              </a>
              <a href="https://www.linkedin.com/in/aatish13/" target='_blank' className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5">
              <svg className="w-10 h-10" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 25 24" >
                <path fill-rule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  <span className="sr-only">LinkedIn account</span>
              </a>
              <a href="https://github.com/Aatish13" target='_blank' className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5">
                  <svg className="w-10 h-10" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z" clip-rule="evenodd"/>
                  </svg>
                  <span className="sr-only">GitHub account</span>
              </a>
          </div>
</footer>

  );
}

export default Contact;
