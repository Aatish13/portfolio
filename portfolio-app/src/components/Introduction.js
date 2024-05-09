// src/components/Introduction.js
import React, { useEffect } from 'react';
import AOS from 'aos';
import './Introduction.css';

import 'aos/dist/aos.css';

function Introduction() {

    useEffect(() => {
        AOS.init();
    }, []);

    return (
            <div className="fade-up-right introduction-section parallax introduction-bg">
    
            <div className='container'>
            <h1>Hello, I'm Aatish Dineshbhai Chaudhari</h1>
                    <h2>A passionate and experienced Software Engineer with expertise in Cloud Computing, Distributed Systems, Computer Vision, and Data Visualization.</h2>

            </div>
                    

            </div>
 
    );
}

export default Introduction;
