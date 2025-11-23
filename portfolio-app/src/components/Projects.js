import React, { useEffect, useState, useContext, useRef } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import ProjectCard from './ProjectCard';
import Arvideo from '../assets/videos/AugmentedRealityUseCases.mp4';
import EdgeComputingImage from '../assets/images/Edge-computing-image.webp';
import ObjectDetectionImage from '../assets/images/object-detection-app.jpg';
import StanceDetectionImage from '../assets/images/stance_detection.webp';
import AiBotImage from '../assets/images/AI-Chatbots.png';
import { InteractionContext } from '../App';

function Projects() {
  const [projects, setProjects] = useState([]);
  const handleInteraction = useContext(InteractionContext);
  const observerRef = useRef(null);
  const viewedProjects = useRef(new Set());

  useEffect(() => {
    AOS.init();
    setProjects([
      {
        title: "Student Help AI bot",
        content: "Langchain and OpenAI-based AI which answers student questions based on custom data.",
        imageUrl: AiBotImage,
        githubUrl: "https://github.com/Aatish13/student-help-AI-bot"
      },
      {
        title: "Augmented Reality and Its Use Case",
        content: "Devised and deployed AR/VR experiences, resulting in a 30% increase in festival engagement. Designed face filters, live books, and games, leading to a 40% boost in festival attendance. Delivered an immersive treasure hunt game, resulting in a 50% increase in interactive experiences.",
        videoUrl: Arvideo,
        imageUrl: "",
        githubUrl: "https://github.com/Aatish13/AWS_Lambda_File_Processor"
      },
      {
        title: "Stance Detection",
        content: "Led a team in Climate Stance detection, analyzing tweets to identify causes of shifts. Visualized the decision-making process by highlighting influential words to build user trust in tweet stance prediction. Developed an engaging website for the project.",
        imageUrl: StanceDetectionImage,
        githubUrl: "https://github.com/Aatish13/StanceDetection"
      },
      {
        title: "Object Detection using AWS",
        content: "Implemented the web tier utilizing Flask, and the application tier on EC2 infrastructure for object detection. Configured the application tier to auto-scale on EC2 instances in response to changes in the size of the SQS queue.",
        imageUrl: ObjectDetectionImage,
        githubUrl: "https://github.com/Aatish13/AWS_Lambda_File_Processor"
      },
      {
        title: "Edge Computing",
        content: "Designed a parallel computing solution, reducing server load by achieving a 50% reduction in latency. Optimized nearby device utilization for enhanced image digit prediction with a distributed machine learning model.",
        imageUrl: EdgeComputingImage,
        githubUrl: "https://github.com/Aatish13/Mobile_Computing_App"
      },
      {
        title: "CRM(Customer Relationship Management)",
        content: "A Website assists small company owners in managing all staff and client relationships, it also displays sales information in a graphical style for better comprehension",
        imageUrl: "https://raw.githubusercontent.com/Aatish13/CRM_software/542b1d7f94058cc030ad11ba14f95bb38a0fbf86/images/Screenshot45.png",
        githubUrl: "https://github.com/Aatish13/CRM_software"
      }

    ]);
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const projectTitle = entry.target.getAttribute('data-project-title');
          if (projectTitle && !viewedProjects.current.has(projectTitle)) {
            viewedProjects.current.add(projectTitle);
            // Send hidden context message
            handleInteraction(`User has scrolled to/viewed the project: ${projectTitle}. If they ask about projects, acknowledge this.`, 'context');
          }
        }
      });
    }, { threshold: 0.5 }); // Trigger when 50% visible

    const cards = document.querySelectorAll('.project-card-container');
    cards.forEach(card => observerRef.current.observe(card));

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [projects, handleInteraction]);

  return (
    <div className='relative p-8 bg-white dark:bg-gray-900'>
      <h2 className="text-3xl font-semibold text-gray-900 dark:text-white py-2">Projects</h2>
      <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {projects.map((project, index) => (
          <div
            key={index}
            className="project-card-container"
            data-project-title={project.title}
            onMouseEnter={() => handleInteraction(`Want to know more about ${project.title}?`, 'follower', 'happy')}
          >
            <ProjectCard
              title={project.title}
              content={project.content}
              imageUrl={project.imageUrl}
              videoUrl={project.videoUrl}
              githubUrl={project.githubUrl}
            />
          </div>
        ))}
      </div>
    </div>

  );
}

export default Projects;
