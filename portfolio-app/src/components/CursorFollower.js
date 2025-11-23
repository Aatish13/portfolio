import React, { useState, useEffect } from 'react';
import avatarNeutral from '../assets/images/AatishIcon.png';
import avatarHappy from '../assets/images/aatish_happy.png';
import avatarSurprised from '../assets/images/aatish_surprised.png';

const CursorFollower = ({ message, expression = 'neutral' }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const updatePosition = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });
            setIsVisible(true);
        };

        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = () => setIsVisible(true);

        window.addEventListener('mousemove', updatePosition);
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseenter', handleMouseEnter);

        return () => {
            window.removeEventListener('mousemove', updatePosition);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseenter', handleMouseEnter);
        };
    }, []);

    // Determine which image to show based on expression
    const getAvatarImage = () => {
        switch (expression) {
            case 'happy':
                return avatarHappy;
            case 'surprised':
                return avatarSurprised;
            default:
                return avatarNeutral;
        }
    };

    return (
        <div
            className="fixed pointer-events-none z-[100] transition-transform duration-100 ease-out will-change-transform"
            style={{
                left: 0,
                top: 0,
                transform: `translate(${position.x + 20}px, ${position.y + 20}px)`, // Offset to side
                opacity: isVisible ? 1 : 0
            }}
        >
            <div className="relative">
                {/* Speech Bubble */}
                {message && (
                    <div className="absolute bottom-full left-0 mb-2 w-40 bg-white text-gray-800 text-[10px] p-2 rounded-xl shadow-xl border border-gray-100 animate-bounce text-center font-medium z-[101]">
                        {message}
                        <div className="absolute top-full left-4 -mt-1 border-4 border-transparent border-t-white"></div>
                    </div>
                )}

                {/* Avatar Image */}
                <div className="relative w-12 h-12"> {/* Smaller size */}
                    {/* Glow/Shadow effect */}
                    <div className="absolute inset-0 rounded-full bg-black opacity-10 blur-md transform translate-y-1"></div>

                    <img
                        src={getAvatarImage()}
                        alt="AI Companion"
                        className={`w-full h-full rounded-full object-cover border-2 border-white shadow-lg transition-all duration-300 ${expression === 'happy' ? 'scale-110' : ''} ${expression === 'surprised' ? 'scale-110' : ''}`}
                    />
                </div>
            </div>
        </div>
    );
};

export default CursorFollower;
