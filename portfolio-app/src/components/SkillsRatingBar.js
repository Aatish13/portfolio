
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const SkillsRatingBar = ({ SkillName, SkillRating }) => {
    useEffect(() => {
        AOS.init();
    }, []);
    return (
        <dl>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400" data-aos="zoom-in-right">{SkillName}</dt>
            <dd class="flex items-center mb-3"  >
                <div class="w-full bg-gray-200 rounded h-2.5 dark:bg-gray-700 me-2"  data-aos-duration="300" data-aos="zoom-in-right">
                    <div class="bg-blue-600 h-2.5 rounded dark:bg-blue-500" data-aos="zoom-in-right"  data-aos-duration="1500" style={{ width: `${SkillRating*10}%`}} ></div>
                </div>
                <span class="text-sm font-medium text-gray-500 dark:text-gray-400" data-aos="zoom-in">{SkillRating}</span>
            </dd>
        </dl>
    );
};

export default SkillsRatingBar;