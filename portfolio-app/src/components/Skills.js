
import React, { useEffect, useState} from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import SkillsRatingBar from './SkillsRatingBar';

function Skills() {

    const [skills, setSkills] = useState([]);

    useEffect(() => {
        AOS.init();
        setSkills([
            { SkillName: "Python", SkillRating: 9.9 },
            { SkillName: "JavaScript", SkillRating: 9 },
            { SkillName: "C#", SkillRating: 8.8 },
            { SkillName: "AI", SkillRating: 8.2 },
            { SkillName: "Docker", SkillRating: 8.5 },
            { SkillName: "AWS", SkillRating: 9.5},
            { SkillName: "Azure", SkillRating: 8.5 },
            { SkillName: "SQL", SkillRating: 8.8 },
            { SkillName: "Serverless Framework", SkillRating: 9.2 },
            { SkillName: "Kafka", SkillRating: 8.5 },
            { SkillName: "React", SkillRating: 9.5 },
            { SkillName: "Node.js", SkillRating: 9 },
            { SkillName: "Kubernetes", SkillRating: 8.5 },
            { SkillName: "Angular", SkillRating: 7.8 },
            { SkillName: "MongoDB", SkillRating: 7 },

        ])
    }, []);

    return (
        <div className='relative p-8'>
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white" data-aos="fade-right">Skills</h2>
            <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" data-aos="fade-right" />
            <div className="gap-8 grid md:grid-cols-5 grid-cols-3">
                {skills.map((skill, index) => (
                    <SkillsRatingBar key={index} SkillName={skill.SkillName} SkillRating={skill.SkillRating} />
                ))}

            </div>

        </div>
    );
}

export default Skills;