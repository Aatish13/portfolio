// src/components/Projects.js

import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './Projects.css';

function Projects() {
    useEffect(() => {
        AOS.init();
    }, []);
  return (

<section id="projects" className="fade-up-right project-section parallax project-bg">
<div className='container'>
                    <h1>Projects</h1>
                    <h2>Stance Detection (Python, BERT)</h2>
                    <h3>Led a team in Climate Stance detection, analyzing tweets to identify causes of shifts. Visualized the decision-making process by highlighting influential words to build user trust in tweet stance prediction. Developed an engaging website for the project.</h3>
        
                    <h2>Edge Computing (Java, Python, TensorFlow, Flask)</h2>
                    <h3>Designed a parallel computing solution, reducing server load by achieving a 50% reduction in latency. Optimized nearby device utilization for enhanced image digit prediction with a distributed machine learning model.</h3>
        
                    <h2>Object Detection using AWS (AWS, Python, AWS S3, Flask)</h2>
                    <h3>Implemented the web tier utilizing Flask, and the application tier on EC2 infrastructure for object detection. Configured the application tier to auto-scale on EC2 instances in response to changes in the size of the SQS queue.</h3>
        
                    <h2>Augmented Reality and Its Use Case (C#, AR Core, AR Tool Kit, Unity3D)</h2>
                    <h3>Devised and deployed AR/VR experiences, resulting in a 30% increase in festival engagement. Designed face filters, live books, and games, leading to a 40% boost in festival attendance. Delivered an immersive treasure hunt game, resulting in a 50% increase in interactive experiences.</h3>
               
</div>

                </section>
  );
}

export default Projects;
