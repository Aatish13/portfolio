
import React, { useEffect, useContext } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Context } from '../App';

const SkillsRatingBar = ({ SkillName, SkillRating }) => {
    useEffect(() => {
        AOS.init();
    }, []);

    const [messages, setMessages] = useContext(Context);
    function handleMouseLeave() {
        setMessages((prevMessages) => [...prevMessages,
            {
                "role": "system",
                "content": `I have scrolled through ${SkillName} skill. Thank me for it  when i ask about skills and also suggest me to explore the more skills or I have any doubt.`
            }
        ]);
    }
    return (
        <dl onMouseLeave={handleMouseLeave}>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400" data-aos="zoom-in-right">{SkillName}</dt>
            <dd className="flex items-center mb-3"  >
                <div className="w-full bg-gray-200 rounded h-2.5 dark:bg-gray-700 me-2"  data-aos-duration="300" data-aos="zoom-in-right">
                    <div className="bg-blue-600 h-2.5 rounded dark:bg-blue-500" data-aos="zoom-in-right"  data-aos-duration="1500" style={{ width: `${SkillRating*10}%`}} ></div>
                </div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400" data-aos="zoom-in">{SkillRating}</span>
            </dd>
        </dl>
    );
};

export default SkillsRatingBar;